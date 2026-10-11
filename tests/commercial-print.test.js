const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const app=fs.readFileSync('app.js','utf8');
const body=app.slice(app.indexOf('async function printRecipe('),app.indexOf('function duplicateRecipe('));
function printHarness({online,configured,registered,authorized=true}){
  let printed=0,accessChecks=0;const messages=[];
  const context={navigator:{onLine:online},window:{RxCloud:{configured:()=>configured},ClinovyraPrint:{print:async()=>{printed++}}},toast:m=>messages.push(m),validateCloudAccess:async()=>{accessChecks++;if(!authorized)throw new Error('Acceso denegado')},$:()=>({innerHTML:''}),renderRxSheet:()=>'<article>RX sintética</article>'};
  vm.runInNewContext(`${body}\nthis.printRecipe=printRecipe`,context);
  return {run:()=>context.printRecipe({id:'RX-TEST',seal:{cloudRegistered:registered}}),stats:()=>({printed,accessChecks,messages})};
}
test('prescriptions cannot print without connectivity or a commercial backend',async()=>{
  for(const options of [{online:false,configured:true,registered:true},{online:true,configured:false,registered:true}]){
    const h=printHarness(options);await h.run();assert.equal(h.stats().printed,0);assert.equal(h.stats().accessChecks,0);
  }
});
test('electronic prescription print waits for authenticated server confirmation',async()=>{
  const unregistered=printHarness({online:true,configured:true,registered:false});await unregistered.run();assert.equal(unregistered.stats().printed,0);
  const denied=printHarness({online:true,configured:true,registered:true,authorized:false});await denied.run();assert.equal(denied.stats().printed,0);
  const allowed=printHarness({online:true,configured:true,registered:true});await allowed.run();assert.equal(allowed.stats().printed,1);
});
test('commercial build has no manual prescription generator or legacy personal backup import',()=>{
  const html=fs.readFileSync('index.html','utf8'),worker=fs.readFileSync('sw.js','utf8');
  assert.doesNotMatch(html,/manualTemplate|manual-pdf|talonario/i);
  assert.doesNotMatch(worker,/manual-pdf/);
  assert.doesNotMatch(app,/ClinovyraManualPDF|function printManualTemplate/);
  assert.match(app,/obj\.format!=='clinovyra-commercial-v1-backup'/);
});
