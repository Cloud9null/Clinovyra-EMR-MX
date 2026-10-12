'use strict';

// The former personal-edition route checked Supabase Auth. Commercial AI must
// fail closed until Neon Auth, membership, Premium entitlement, consent and
// cost controls are verified in a trusted API.
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store, private');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method==='OPTIONS'){
    const origin=String(req.headers?.origin||'');
    if(!['capacitor://localhost','https://localhost','app://clinovyra-commercial.local'].includes(origin)){
      res.statusCode=403;return res.end(JSON.stringify({error:'Origen no autorizado.'}));
    }
    res.setHeader('Access-Control-Allow-Origin',origin);
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');
    res.setHeader('Vary','Origin');
    res.statusCode=204;return res.end();
  }
  if(req.method==='GET'){
    res.statusCode=200;
    return res.end(JSON.stringify({ok:true,externalAI:false,provider:'disabled',model:null}));
  }
  res.statusCode=req.method==='POST'?503:405;
  return res.end(JSON.stringify({error:req.method==='POST'?'IA Premium no habilitada: falta validar identidad, plan y consentimiento en servidor.':'Método no permitido.'}));
};
