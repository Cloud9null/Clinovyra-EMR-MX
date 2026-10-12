'use strict';

const CLINICAL_FEATURES=new Set(['patients','encounters','notes','prescriptions']);
const PREMIUM_FEATURES=new Set(['ai_note','transcription']);
const SIGNING_FEATURES=new Set(['notes.sign','prescriptions.issue']);

/** Caller must supply identity from verified Auth and DB rows loaded server-side. */
function checkAccess({identity,membership,subscription,feature,now=new Date()}={}){
  if(!identity?.id||!membership||membership.auth_user_id!==identity.id||membership.status!=='active')return {allowed:false,reason:'membership'};
  if(!membership.organization_id||membership.organization_id!==subscription?.organization_id)return {allowed:false,reason:'organization'};
  if(!['owner','admin','doctor','assistant'].includes(membership.role))return {allowed:false,reason:'role'};
  if(SIGNING_FEATURES.has(feature)&&!['owner','doctor'].includes(membership.role))return {allowed:false,reason:'signing_role'};
  const time=new Date(now).getTime();
  if(!Number.isFinite(time))return {allowed:false,reason:'clock'};
  const expiry=subscription.status==='trial'?subscription.trial_ends_at:subscription.status==='active'?subscription.current_period_ends_at:null;
  const expiryMs=expiry?new Date(expiry).getTime():NaN;
  if(!Number.isFinite(expiryMs)||expiryMs<=time)return {allowed:false,reason:'expired'};
  if(subscription.status==='trial'){
    const startMs=subscription.trial_started_at?new Date(subscription.trial_started_at).getTime():NaN;
    if(!Number.isFinite(startMs)||startMs>time||expiryMs<=startMs)return {allowed:false,reason:'trial_window'};
  }
  if(PREMIUM_FEATURES.has(feature)&&subscription.plan!=='premium')return {allowed:false,reason:'premium'};
  if(!CLINICAL_FEATURES.has(feature)&&!PREMIUM_FEATURES.has(feature)&&!SIGNING_FEATURES.has(feature))return {allowed:false,reason:'unknown_feature'};
  return {allowed:true,organizationId:membership.organization_id,actorId:identity.id};
}

module.exports={checkAccess};
