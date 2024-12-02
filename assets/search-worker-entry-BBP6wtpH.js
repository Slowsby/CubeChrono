function _(e){const t=new WeakMap;return{postMessage:e.postMessage.bind(e),addEventListener:(n,o)=>{const r=s=>{"handleEvent"in o?o.handleEvent({data:s}):o({data:s})};e.on("message",r),t.set(o,r)},removeEventListener:(n,o)=>{const r=t.get(o);r&&(e.off("message",r),t.delete(o))},nodeWorker:e,terminate:()=>{e.terminate()}}}var z=_;async function W(e){var n;const t=(n=globalThis.process)==null?void 0:n.getBuiltinModule;return t?t(e):import(e)}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const T=Symbol("Comlink.proxy"),L=Symbol("Comlink.endpoint"),v=Symbol("Comlink.releaseProxy"),k=Symbol("Comlink.finalizer"),E=Symbol("Comlink.thrown"),S=e=>typeof e=="object"&&e!==null||typeof e=="function",H={canHandle:e=>S(e)&&e[T],serialize(e){const{port1:t,port2:n}=new MessageChannel;return h(e,t),[n,[n]]},deserialize(e){return e.start(),D(e)}},V={canHandle:e=>S(e)&&E in e,serialize({value:e}){let t;return e instanceof Error?t={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:t={isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},A=new Map([["proxy",H],["throw",V]]);function I(e,t){for(const n of e)if(t===n||n==="*"||n instanceof RegExp&&n.test(t))return!0;return!1}function h(e,t=globalThis,n=["*"]){t.addEventListener("message",function o(r){if(!r||!r.data)return;if(!I(n,r.origin)){console.warn(`Invalid origin '${r.origin}' for comlink proxy`);return}const{id:s,type:g,path:l}=Object.assign({path:[]},r.data),u=(r.data.argumentList||[]).map(d);let a;try{const i=l.slice(0,-1).reduce((c,m)=>c[m],e),f=l.reduce((c,m)=>c[m],e);switch(g){case"GET":a=f;break;case"SET":i[l.slice(-1)[0]]=d(r.data.value),a=!0;break;case"APPLY":a=f.apply(i,u);break;case"CONSTRUCT":{const c=new f(...u);a=Y(c)}break;case"ENDPOINT":{const{port1:c,port2:m}=new MessageChannel;h(e,m),a=G(c,[c])}break;case"RELEASE":a=void 0;break;default:return}}catch(i){a={value:i,[E]:0}}Promise.resolve(a).catch(i=>({value:i,[E]:0})).then(i=>{const[f,c]=M(i);t.postMessage(Object.assign(Object.assign({},f),{id:s}),c),g==="RELEASE"&&(t.removeEventListener("message",o),R(t),k in e&&typeof e[k]=="function"&&e[k]())}).catch(i=>{const[f,c]=M({value:new TypeError("Unserializable return value"),[E]:0});t.postMessage(Object.assign(Object.assign({},f),{id:s}),c)})}),t.start&&t.start()}function j(e){return e.constructor.name==="MessagePort"}function R(e){j(e)&&e.close()}function D(e,t){const n=new Map;return e.addEventListener("message",function(r){const{data:s}=r;if(!s||!s.id)return;const g=n.get(s.id);if(g)try{g(s)}finally{n.delete(s.id)}}),P(e,n,[],t)}function w(e){if(e)throw new Error("Proxy has been released and is not useable")}function C(e){return y(e,new Map,{type:"RELEASE"}).then(()=>{R(e)})}const b=new WeakMap,p="FinalizationRegistry"in globalThis&&new FinalizationRegistry(e=>{const t=(b.get(e)||0)-1;b.set(e,t),t===0&&C(e)});function F(e,t){const n=(b.get(t)||0)+1;b.set(t,n),p&&p.register(e,t,e)}function U(e){p&&p.unregister(e)}function P(e,t,n=[],o=function(){}){let r=!1;const s=new Proxy(o,{get(g,l){if(w(r),l===v)return()=>{U(s),C(e),t.clear(),r=!0};if(l==="then"){if(n.length===0)return{then:()=>s};const u=y(e,t,{type:"GET",path:n.map(a=>a.toString())}).then(d);return u.then.bind(u)}return P(e,t,[...n,l])},set(g,l,u){w(r);const[a,i]=M(u);return y(e,t,{type:"SET",path:[...n,l].map(f=>f.toString()),value:a},i).then(d)},apply(g,l,u){w(r);const a=n[n.length-1];if(a===L)return y(e,t,{type:"ENDPOINT"}).then(d);if(a==="bind")return P(e,t,n.slice(0,-1));const[i,f]=x(u);return y(e,t,{type:"APPLY",path:n.map(c=>c.toString()),argumentList:i},f).then(d)},construct(g,l){w(r);const[u,a]=x(l);return y(e,t,{type:"CONSTRUCT",path:n.map(i=>i.toString()),argumentList:u},a).then(d)}});return F(s,e),s}function B(e){return Array.prototype.concat.apply([],e)}function x(e){const t=e.map(M);return[t.map(n=>n[0]),B(t.map(n=>n[1]))]}const O=new WeakMap;function G(e,t){return O.set(e,t),e}function Y(e){return Object.assign(e,{[T]:!0})}function M(e){for(const[t,n]of A)if(n.canHandle(e)){const[o,r]=n.serialize(e);return[{type:"HANDLER",name:t,value:o},r]}return[{type:"RAW",value:e},O.get(e)||[]]}function d(e){switch(e.type){case"HANDLER":return A.get(e.name).deserialize(e.value);case"RAW":return e.value}}function y(e,t,n,o){return new Promise(r=>{const s=$();t.set(s,r),e.start&&e.start(),e.postMessage(Object.assign({id:s},n),o)})}function $(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}var q=typeof globalThis.Worker>"u"&&typeof globalThis.WorkerNavigator>"u";async function N(){const{parentPort:e}=await W("node:worker_threads");return z(e)}function X(e){q?(async()=>h(e,await N()))():h(e)}(async()=>(await import("./inside-CVVS4HLC-CluI377I.js").then(function(t){return t.i}),(globalThis.postMessage?globalThis:await N()).postMessage("comlink-exposed")))();export{X as e,W as g};
