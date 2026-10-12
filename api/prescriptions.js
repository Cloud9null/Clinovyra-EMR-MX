'use strict';
// Development fails closed until Neon Auth JWT verification, scoped membership,
// cryptographic note verification and transactional issuance are implemented.
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.statusCode=req.method==='POST'?503:405;
  res.end(JSON.stringify({error:req.method==='POST'?'Emisión comercial no habilitada: falta autorización y validación del servidor Neon.':'Método no permitido.'}));
};
