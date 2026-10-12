const test=require('node:test');
const assert=require('node:assert/strict');
const handler=require('../api/clinical-note.js');

function response(){return {headers:{},statusCode:0,body:'',setHeader(key,value){this.headers[key]=value},end(body){this.body=body}}}

test('commercial AI stays closed despite provider token or untrusted supplied plan',async()=>{
  const oldFetch=global.fetch;
  global.fetch=()=>{throw new Error('No commercial request may leave this server')};
  try{
    const res=response();
    await handler({method:'POST',headers:{authorization:'Bearer synthetic','x-vercel-oidc-token':'synthetic'},body:{plan:'premium',documented:{reasonForVisit:'synthetic'}}},res);
    assert.equal(res.statusCode,503);assert.match(res.body,/IA Premium no habilitada/);
    const status=response();await handler({method:'GET',headers:{}},status);
    assert.equal(JSON.parse(status.body).externalAI,false);
  }finally{global.fetch=oldFetch}
});
