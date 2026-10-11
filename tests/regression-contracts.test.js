const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');

test('legacy prescription contracts remain present',()=>{
  const app=read('app.js');
  assert.match(app,/function renderHistory\(/);
  assert.match(app,/function canonicalPayload\(recipe\)/);
  assert.match(app,/ECDSA-P256-SHA256/);
  assert.match(read('index.html'),/8\.5 × 5\.5/);
  assert.match(read('styles.css'),/width:8\.5in;height:5\.5in/);
  assert.match(app,/https:\/\/cedulaprofesional\.sep\.gob\.mx\/cedula\/presidencia\/indexAvanzada\.action/);
  assert.doesNotMatch(app,/function renderManualLetterPages\(/);
  assert.match(app,/function voidRecipe\(/);
});

test('prescription relation is external to the signed canonical payload',()=>{
  const app=read('app.js'),emr=read('emr.js');
  const canonical=app.match(/function canonicalPayload\(recipe\)\{return \{([^}]+\}[^}]*)\}\}/)?.[0]||'';
  assert.doesNotMatch(canonical,/encounterId|noteId|prescriptionLinks/);
  assert.match(emr,/prescriptionLinks\.push\(link\)/);
});

test('direct prescriptions remain searchable and can be linked retrospectively without resigning',()=>{
  const app=read('app.js'),emr=read('emr.js'),html=read('index.html');
  assert.match(app,/patientName\+' '\+id/);
  assert.match(app,/openRecipePatientBtn/);
  assert.match(html,/id="encounterSourceRx"/);
  assert.match(emr,/unlinkedPatientPrescriptions\(patientId\)/);
  assert.match(emr,/sourceRx\.patient\?\.id!==patientId/);
  assert.match(emr,/prescriptionLinks\.some\(l=>l\.rxId===sourceRxId\)/);
  assert.match(emr,/prescription\.linked_retroactively/);
  assert.match(emr,/Recetas sin nota/);
  assert.match(emr,/data-open-recipe/);
  assert.match(emr,/data-link-recipe/);
});

test('PWA precaches every new EMR runtime asset',()=>{
  const sw=read('sw.js');
  for(const asset of ['emr.css','emr-core.js','emr.js','secure-sync.js','clinical-assistant.js','quick-note.js'])assert.match(sw,new RegExp(asset.replace('.','\\.')));
  assert.doesNotMatch(sw,/localStorage\.clear|indexedDB\.deleteDatabase/);
});



test('clinical AI endpoint is authenticated, no-store and never exposes the provider key',()=>{
  const api=read('api/clinical-note.js'),emr=read('emr.js');assert.match(api,/\/auth\/v1\/user/);assert.match(api,/store:false/);assert.match(api,/process\.env\.OPENAI_API_KEY/);assert.match(api,/x-vercel-oidc-token/);assert.match(api,/process\.env\.VERCEL_OIDC_TOKEN/);assert.match(api,/ai-gateway\.vercel\.sh/);assert.match(api,/disallowPromptTraining:true/);assert.doesNotMatch(emr,/OPENAI_API_KEY|VERCEL_OIDC_TOKEN/);assert.match(emr,/identifiersSent:false/);
});

test('document payloads upload only encrypted content and cloud metadata strips ciphertext',()=>{
  const cloud=read('cloud.js'),emr=read('emr.js');assert.match(emr,/encryptDocument\(new Uint8Array/);assert.match(cloud,/delete safe\.encryptedContent/);assert.match(cloud,/storagePut\(path,doc\.encryptedContent/);assert.doesNotMatch(cloud,/storagePut\(path,doc\.dataUrl/);
});



test('every issued prescription can populate longitudinal medications without requiring a note',()=>{
  const source=read('emr.js');
  assert.match(source,/sourceRxId:rec\.id/);
  assert.match(source,/encounterId:context\?\.encounterId\|\|null/);
  assert.match(source,/linked:Boolean\(context\)/);
});









test('application and clinical AI both enforce the server-side owner allowlist',()=>{
  const app=read('app.js'),cloud=read('cloud.js'),api=read('api/clinical-note.js'),html=read('index.html');
  assert.match(cloud,/async function authorizeUser\(/);assert.match(cloud,/app_authorized_users/);
  assert.match(app,/async function resolveInitialAccess\(/);assert.match(app,/ownerIdHash/);
  assert.match(api,/async function authorize\(/);assert.match(api,/app_authorized_users/);
  assert.match(html,/ACCESO RESTRINGIDO/);assert.doesNotMatch(html,/registrarse|crear cuenta/i);
  assert.match(app,/\['localhost','127\.0\.0\.1'\][\s\S]+get\('e2e'\)==='1'/);
});



test('Liquid Glass is progressive and respects reduced motion',()=>{
  const css=read('styles.css'),app=read('app.js'),html=read('index.html');
  assert.match(css,/@supports \(\(-webkit-backdrop-filter/);assert.match(css,/@keyframes rxGlassSlide/);assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/min-height:100svh/);assert.match(css,/env\(safe-area-inset-top\)/);assert.match(html,/viewport-fit=cover/);
  assert.match(html,/La misma que usas para sincronización; no es el PIN de la bóveda/);
  assert.match(app,/display-mode: standalone/);assert.match(app,/ios-pwa/);
});

test('biometric unlock self-tests and falls back from PRF to credential-protected largeBlob',()=>{
  const app=read('app.js'),html=read('index.html');
  assert.match(app,/isUserVerifyingPlatformAuthenticatorAvailable/);assert.match(app,/getClientCapabilities/);
  assert.match(app,/largeBlob:\{support:'preferred'\}/);assert.match(app,/largeBlob:\{write:/);assert.match(app,/largeBlob:\{read:true\}/);
  assert.match(app,/getClientExtensionResults\?\.\(\)/);assert.match(app,/registrationSecret=extension\?\.prf\?\.results\?\.first/);
  assert.match(app,/transports:internalTransports\(transports\)/);assert.match(app,/pendingBiometric/);assert.match(app,/Completar con Face ID/);
  assert.match(app,/await unlockBiometric\(\);await afterUnlock\(\)/);assert.match(app,/function biometricError\(/);
  assert.match(html,/id="testBiometricBtn"/);assert.match(html,/id="disableBiometricBtn"/);assert.match(html,/id="lockNowBtn"/);
});

test('vault PIN can be rotated locally without replacing the clinical encryption key',()=>{
  const app=read('app.js'),html=read('index.html');
  assert.match(html,/id="changePinForm"/);assert.match(html,/id="currentVaultPin"/);assert.match(html,/id="newVaultPin"/);
  assert.match(app,/async function changeVaultPin\(/);assert.match(app,/wrapVaultKeyForPin\(state\.vaultKey,next\)/);assert.match(app,/pinChangedAt/);
  assert.match(app,/\.\.\.state\.meta,\.\.\.pinBox/);assert.doesNotMatch(app,/changeVaultPin[\s\S]{0,1200}setupVault\(/);
});

test('night mode is explicit and preserves the last light and dark palettes',()=>{
  const app=read('app.js'),html=read('index.html');
  assert.match(html,/id="nightModeBtn"/);assert.match(html,/Modo nocturno/);assert.match(app,/async function toggleNightMode\(/);
  assert.match(app,/lastDarkTheme/);assert.match(app,/lastLightTheme/);assert.match(app,/documentElement\.dataset\.themeMode/);
  for(const name of ['Deep Clinic','Aurora Night','Obsidian Gold','Burgundy Noir','Emerald Night','Cobalt Noir'])assert.match(app,new RegExp(name));
  assert.ok((app.match(/dark:true/g)||[]).length>=6);assert.match(app,/Temas nocturnos/);
});

test('standalone quick note is temporary, desidentified and uses the authenticated AI endpoint',()=>{
  const source=read('quick-note.js'),html=read('index.html'),css=read('styles.css');
  assert.match(html,/id="screen-quicknote"/);assert.match(html,/Sin identificadores/);assert.match(source,/RxClinicalAssistant\.buildAiPayload/);assert.match(source,/Authorization:`Bearer \$\{token\}`/);assert.match(source,/onLock/);
  assert.doesNotMatch(source,/localStorage|sessionStorage|indexedDB/);assert.match(css,/printing-quick-note/);assert.match(html,/Modo lectura grande/);
});
