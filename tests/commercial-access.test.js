const test=require('node:test');
const assert=require('node:assert/strict');
const {checkAccess}=require('../api/commercial-access.js');

const now=new Date('2026-10-12T12:00:00Z');
const identity={id:'synthetic-doctor-a'};
const membership={auth_user_id:identity.id,organization_id:'synthetic-clinic-a',role:'doctor',status:'active'};
const subscription={organization_id:'synthetic-clinic-a',status:'trial',plan:'premium',trial_started_at:'2026-10-11T00:00:00Z',trial_ends_at:'2026-10-13T00:00:00Z'};
const allowed=(changes={})=>checkAccess({identity,membership,subscription,feature:'patients',now,...changes});

test('trial allows only matching active membership within the date window',()=>{
  assert.equal(allowed().allowed,true);
  assert.equal(allowed({identity:{id:'synthetic-doctor-b'}}).reason,'membership');
  assert.equal(allowed({subscription:{...subscription,organization_id:'synthetic-clinic-b'}}).reason,'organization');
  assert.equal(allowed({membership:{...membership,status:'suspended'}}).reason,'membership');
  assert.equal(allowed({now:new Date('2026-10-13T00:00:00Z')}).reason,'expired');
  assert.equal(allowed({now:new Date('2026-10-10T00:00:00Z')}).reason,'trial_window');
});

test('Premium and signature authority are enforced separately',()=>{
  assert.equal(allowed({feature:'ai_note'}).allowed,true);
  assert.equal(allowed({feature:'transcription',subscription:{...subscription,plan:'lite'}}).reason,'premium');
  assert.equal(allowed({feature:'notes',subscription:{...subscription,plan:'lite'}}).allowed,true);
  assert.equal(allowed({feature:'prescriptions.issue',membership:{...membership,role:'assistant'}}).reason,'signing_role');
  assert.equal(allowed({feature:'unrecognized'}).reason,'unknown_feature');
  assert.equal(allowed({subscription:{...subscription,status:'past_due'}}).reason,'expired');
});
