(function(root,factory){
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.ClinovyraRuntime=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
  'use strict';
  // Inject the independent commercial origin only after its deployment is ready.
  const PUBLIC_ORIGIN='';
  const LOCAL_PROTOCOLS=new Set(['capacitor:','app:']);
  function nativeOrigin(location=root.location){
    if(!location)return false;
    return LOCAL_PROTOCOLS.has(location.protocol)||location.origin==='https://localhost'&&Boolean(root.Capacitor?.isNativePlatform?.());
  }
  function publicVerifierUrl(token,location=root.location){
    const base=nativeOrigin(location)?PUBLIC_ORIGIN:location?.origin;
    if(!base)throw new Error('Configura primero el origen comercial de verificación.');
    const url=new URL('/verify.html',base);url.hash=token;return url.toString();
  }
  function clinicalApiUrl(location=root.location){if(nativeOrigin(location)){if(!PUBLIC_ORIGIN)throw new Error('Configura primero el origen comercial de la API.');return `${PUBLIC_ORIGIN}/api/clinical-note`}return '/api/clinical-note'}
  return Object.freeze({PUBLIC_ORIGIN,nativeOrigin,publicVerifierUrl,clinicalApiUrl});
});
