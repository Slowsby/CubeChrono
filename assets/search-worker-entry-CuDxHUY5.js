function N(e){const t=new WeakMap;return{postMessage:e.postMessage.bind(e),addEventListener:(n,s)=>{const r=u=>{"handleEvent"in s?s.handleEvent({data:u}):s({data:u})};e.on("message",r),t.set(s,r)},removeEventListener:(n,s)=>{const r=t.get(s);r&&(e.off("message",r),t.delete(s))},nodeWorker:e,terminate:()=>{e.terminate()}}}var _=N;async function z(e){var n;const t=(n=globalThis.process)==null?void 0:n.getBuiltinModule;return t?t(e):import(e)}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const T=Symbol("Comlink.proxy"),W=Symbol("Comlink.endpoint"),H=Symbol("Comlink.releaseProxy"),M=Symbol("Comlink.finalizer"),h=Symbol("Comlink.thrown"),L=e=>typeof e=="object"&&e!==null||typeof e=="function",V={canHandle:e=>L(e)&&e[T],serialize(e){const{port1:t,port2:n}=new MessageChannel;return p(e,t),[n,[n]]},deserialize(e){return e.start(),D(e)}},v={canHandle:e=>L(e)&&h in e,serialize({value:e}){let t;return e instanceof Error?t={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:t={isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},S=new Map([["proxy",V],["throw",v]]);function I(e,t){for(const n of e)if(t===n||n==="*"||n instanceof RegExp&&n.test(t))return!0;return!1}function p(e,t=globalThis,n=["*"]){t.addEventListener("message",function s(r){if(!r||!r.data)return;if(!I(n,r.origin)){console.warn(`Invalid origin '${r.origin}' for comlink proxy`);return}const{id:u,type:a,path:c}=Object.assign({path:[]},r.data),f=(r.data.argumentList||[]).map(d);let o;try{const i=c.slice(0,-1).reduce((l,y)=>l[y],e),g=c.reduce((l,y)=>l[y],e);switch(a){case"GET":o=g;break;case"SET":i[c.slice(-1)[0]]=d(r.data.value),o=!0;break;case"APPLY":o=g.apply(i,f);break;case"CONSTRUCT":{const l=new g(...f);o=Y(l)}break;case"ENDPOINT":{const{port1:l,port2:y}=new MessageChannel;p(e,y),o=G(l,[l])}break;case"RELEASE":o=void 0;break;default:return}}catch(i){o={value:i,[h]:0}}Promise.resolve(o).catch(i=>({value:i,[h]:0})).then(i=>{const[g,l]=k(i);t.postMessage(Object.assign(Object.assign({},g),{id:u}),l),a==="RELEASE"&&(t.removeEventListener("message",s),A(t),M in e&&typeof e[M]=="function"&&e[M]())}).catch(i=>{const[g,l]=k({value:new TypeError("Unserializable return value"),[h]:0});t.postMessage(Object.assign(Object.assign({},g),{id:u}),l)})}),t.start&&t.start()}function j(e){return e.constructor.name==="MessagePort"}function A(e){j(e)&&e.close()}function D(e,t){return P(e,[],t)}function E(e){if(e)throw new Error("Proxy has been released and is not useable")}function R(e){return m(e,{type:"RELEASE"}).then(()=>{A(e)})}const w=new WeakMap,b="FinalizationRegistry"in globalThis&&new FinalizationRegistry(e=>{const t=(w.get(e)||0)-1;w.set(e,t),t===0&&R(e)});function F(e,t){const n=(w.get(t)||0)+1;w.set(t,n),b&&b.register(e,t,e)}function U(e){b&&b.unregister(e)}function P(e,t=[],n=function(){}){let s=!1;const r=new Proxy(n,{get(u,a){if(E(s),a===H)return()=>{U(r),R(e),s=!0};if(a==="then"){if(t.length===0)return{then:()=>r};const c=m(e,{type:"GET",path:t.map(f=>f.toString())}).then(d);return c.then.bind(c)}return P(e,[...t,a])},set(u,a,c){E(s);const[f,o]=k(c);return m(e,{type:"SET",path:[...t,a].map(i=>i.toString()),value:f},o).then(d)},apply(u,a,c){E(s);const f=t[t.length-1];if(f===W)return m(e,{type:"ENDPOINT"}).then(d);if(f==="bind")return P(e,t.slice(0,-1));const[o,i]=x(c);return m(e,{type:"APPLY",path:t.map(g=>g.toString()),argumentList:o},i).then(d)},construct(u,a){E(s);const[c,f]=x(a);return m(e,{type:"CONSTRUCT",path:t.map(o=>o.toString()),argumentList:c},f).then(d)}});return F(r,e),r}function B(e){return Array.prototype.concat.apply([],e)}function x(e){const t=e.map(k);return[t.map(n=>n[0]),B(t.map(n=>n[1]))]}const C=new WeakMap;function G(e,t){return C.set(e,t),e}function Y(e){return Object.assign(e,{[T]:!0})}function k(e){for(const[t,n]of S)if(n.canHandle(e)){const[s,r]=n.serialize(e);return[{type:"HANDLER",name:t,value:s},r]}return[{type:"RAW",value:e},C.get(e)||[]]}function d(e){switch(e.type){case"HANDLER":return S.get(e.name).deserialize(e.value);case"RAW":return e.value}}function m(e,t,n){return new Promise(s=>{const r=$();e.addEventListener("message",function u(a){!a.data||!a.data.id||a.data.id!==r||(e.removeEventListener("message",u),s(a.data))}),e.start&&e.start(),e.postMessage(Object.assign({id:r},t),n)})}function $(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}var q=typeof globalThis.Worker>"u"&&typeof globalThis.WorkerNavigator>"u";async function O(){const{parentPort:e}=await z("node:worker_threads");return _(e)}function X(e){q?(async()=>p(e,await O()))():p(e)}(async()=>(await import("./inside-CVVS4HLC-KLRKMWn3.js").then(function(t){return t.i}),(globalThis.postMessage?globalThis:await O()).postMessage("comlink-exposed")))();export{X as e,z as g};