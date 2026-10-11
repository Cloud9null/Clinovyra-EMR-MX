const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
delete process.env.RX_SUPABASE_URL;
delete process.env.RX_SUPABASE_PUBLISHABLE_KEY;
const handler=require('../api/clinical-note.js');

test('unconfigured commercial API refuses clinical POST without any outbound request',async()=>{
  const previous=global.fetch, calls=[];
  global.fetch=async url=>{calls.push(url);throw Error('unexpected network request')};
  const res={headers:{},setHeader(k,v){this.headers[k]=v},end(data){this.data=JSON.parse(data)}};
  try{
    await handler({method:'POST',headers:{authorization:'Bearer synthetic-token'},body:{keyPoints:'Sintético'}},res);
    assert.equal(res.statusCode,503);
    assert.equal(calls.length,0);
    assert.match(res.data.error,/comercial no configurado/);
  }finally{global.fetch=previous}
});

test('fresh commercial client configuration contains no cloud endpoint',()=>{
  const cfg=fs.readFileSync(path.join(__dirname,'../supabase-config.js'),'utf8');
  assert.match(cfg,/url: ''/);
  assert.match(cfg,/publishableKey: ''/);
});
