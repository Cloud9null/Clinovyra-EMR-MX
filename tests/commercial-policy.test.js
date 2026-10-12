const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const policy=require('../product-policy.js');
const handler=require('../api/prescriptions.js');
test('all commercial prescription entry points require matching final signed note',()=>{
  assert.equal(policy.edition,'saas');
  const emr={encounters:[{id:'e',patientId:'p',status:'final'}],clinicalNotes:[{id:'n',encounterId:'e',patientId:'p',status:'final',canonicalText:'signed',finalSnapshot:{},seal:{hash:'h'}}]};
  assert.equal(policy.validatePrescription({patientId:'p',context:{patientId:'p',encounterId:'e',noteId:'n'},emr}).ok,true);
  assert.equal(policy.validatePrescription({patientId:'p',context:{patientId:'p',encounterId:'e',noteId:'n'},emr:{...emr,encounters:[{...emr.encounters[0],status:'draft'}]}}).ok,false);
  assert.equal(policy.validatePrescription({mode:'personal',patientId:'p',emr}).ok,false);
});
test('server refuses unauthenticated issuance without network or database activity',async()=>{
  let calls=0;const previous=global.fetch;global.fetch=()=>{calls++;throw Error('unexpected fetch')};
  const res={setHeader(){},end(x){this.body=JSON.parse(x)}};
  try{await handler({method:'POST',body:{patientId:'synthetic'}},res);assert.equal(res.statusCode,503);assert.equal(calls,0);assert.match(res.body.error,/Neon/)}finally{global.fetch=previous}
});
test('schema binds prescription to same patient and signed final note, and keeps RLS closed',()=>{
  const sql=fs.readFileSync('neon/migrations/0002_signed_prescription_gate.sql','utf8');
  assert.match(sql,/FOREIGN KEY \(organization_id, patient_id, encounter_id, note_id, note_status, signed_note_hash\)/);
  assert.match(sql,/CHECK \(note_status = 'final'\)/);
  assert.match(sql,/CHECK \(encounter_status = 'final'\)/);
  assert.match(sql,/signed_note_hash\)/);
  assert.doesNotMatch(sql,/CREATE POLICY|GRANT SELECT|GRANT INSERT/);
});
