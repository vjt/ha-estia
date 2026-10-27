var Q=globalThis,tt=Q.ShadowRoot&&(Q.ShadyCSS===void 0||Q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ct=Symbol(),Tt=new WeakMap,I=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==ct)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(tt&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=Tt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&Tt.set(t,e))}return e}toString(){return this.cssText}},Pt=s=>new I(typeof s=="string"?s:s+"",void 0,ct),A=(s,...e)=>{let t=s.length===1?s[0]:e.reduce((n,i,r)=>n+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new I(t,s,ct)},Mt=(s,e)=>{if(tt)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let n=document.createElement("style"),i=Q.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=t.cssText,s.appendChild(n)}},ut=tt?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(let n of e.cssRules)t+=n.cssText;return Pt(t)})(s):s;var{is:ce,defineProperty:ue,getOwnPropertyDescriptor:he,getOwnPropertyNames:pe,getOwnPropertySymbols:me,getPrototypeOf:ge}=Object,et=globalThis,Rt=et.trustedTypes,fe=Rt?Rt.emptyScript:"",_e=et.reactiveElementPolyfillSupport,z=(s,e)=>s,ht={toAttribute(s,e){switch(e){case Boolean:s=s?fe:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},Dt=(s,e)=>!ce(s,e),Ht={attribute:!0,type:String,converter:ht,reflect:!1,useDefault:!1,hasChanged:Dt};Symbol.metadata??=Symbol("metadata"),et.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ht){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(e,n,t);i!==void 0&&ue(this.prototype,e,i)}}static getPropertyDescriptor(e,t,n){let{get:i,set:r}=he(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let a=i?.call(this);r?.call(this,o),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ht}static _$Ei(){if(this.hasOwnProperty(z("elementProperties")))return;let e=ge(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(z("properties"))){let t=this.properties,n=[...pe(t),...me(t)];for(let i of n)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[n,i]of t)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[t,n]of this.elementProperties){let i=this._$Eu(t,n);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let i of n)t.unshift(ut(i))}else e!==void 0&&t.push(ut(e));return t}static _$Eu(e,t){let n=t.attribute;return n===!1?void 0:typeof n=="string"?n:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Mt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,n);if(i!==void 0&&n.reflect===!0){let r=(n.converter?.toAttribute!==void 0?n.converter:ht).toAttribute(t,n.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){let n=this.constructor,i=n._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let r=n.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:ht;this._$Em=i;let a=o.fromAttribute(t,r.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(e,t,n,i=!1,r){if(e!==void 0){let o=this.constructor;if(i===!1&&(r=this[e]),n??=o.getPropertyOptions(e),!((n.hasChanged??Dt)(r,t)||n.useDefault&&n.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,n))))return;this.C(e,t,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:i,wrapped:r},o){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,r]of n){let{wrapped:o}=r,a=this[i];o!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,r,a)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[z("elementProperties")]=new Map,w[z("finalized")]=new Map,_e?.({ReactiveElement:w}),(et.reactiveElementVersions??=[]).push("2.1.2");var vt=globalThis,Ot=s=>s,nt=vt.trustedTypes,Ut=nt?nt.createPolicy("lit-html",{createHTML:s=>s}):void 0,Bt="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,Wt="?"+x,ye=`<${Wt}>`,T=document,j=()=>T.createComment(""),B=s=>s===null||typeof s!="object"&&typeof s!="function",bt=Array.isArray,ve=s=>bt(s)||typeof s?.[Symbol.iterator]=="function",pt=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Nt=/-->/g,It=/>/g,k=RegExp(`>|${pt}(?:([^\\s"'>=/]+)(${pt}*=${pt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),zt=/'/g,Lt=/"/g,Ft=/^(?:script|style|textarea|title)$/i,$t=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),p=$t(1),V=$t(2),Fe=$t(3),P=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),jt=new WeakMap,C=T.createTreeWalker(T,129);function Vt(s,e){if(!bt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ut!==void 0?Ut.createHTML(e):e}var be=(s,e)=>{let t=s.length-1,n=[],i,r=e===2?"<svg>":e===3?"<math>":"",o=L;for(let a=0;a<t;a++){let l=s[a],d,u,h=-1,g=0;for(;g<l.length&&(o.lastIndex=g,u=o.exec(l),u!==null);)g=o.lastIndex,o===L?u[1]==="!--"?o=Nt:u[1]!==void 0?o=It:u[2]!==void 0?(Ft.test(u[2])&&(i=RegExp("</"+u[2],"g")),o=k):u[3]!==void 0&&(o=k):o===k?u[0]===">"?(o=i??L,h=-1):u[1]===void 0?h=-2:(h=o.lastIndex-u[2].length,d=u[1],o=u[3]===void 0?k:u[3]==='"'?Lt:zt):o===Lt||o===zt?o=k:o===Nt||o===It?o=L:(o=k,i=void 0);let f=o===k&&s[a+1].startsWith("/>")?" ":"";r+=o===L?l+ye:h>=0?(n.push(d),l.slice(0,h)+Bt+l.slice(h)+x+f):l+x+(h===-2?a:f)}return[Vt(s,r+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]},W=class s{constructor({strings:e,_$litType$:t},n){let i;this.parts=[];let r=0,o=0,a=e.length-1,l=this.parts,[d,u]=be(e,t);if(this.el=s.createElement(d,n),C.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=C.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(Bt)){let g=u[o++],f=i.getAttribute(h).split(x),$=/([.?@])?(.*)/.exec(g);l.push({type:1,index:r,name:$[2],strings:f,ctor:$[1]==="."?gt:$[1]==="?"?ft:$[1]==="@"?_t:O}),i.removeAttribute(h)}else h.startsWith(x)&&(l.push({type:6,index:r}),i.removeAttribute(h));if(Ft.test(i.tagName)){let h=i.textContent.split(x),g=h.length-1;if(g>0){i.textContent=nt?nt.emptyScript:"";for(let f=0;f<g;f++)i.append(h[f],j()),C.nextNode(),l.push({type:2,index:++r});i.append(h[g],j())}}}else if(i.nodeType===8)if(i.data===Wt)l.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(x,h+1))!==-1;)l.push({type:7,index:r}),h+=x.length-1}r++}}static createElement(e,t){let n=T.createElement("template");return n.innerHTML=e,n}};function D(s,e,t=s,n){if(e===P)return e;let i=n!==void 0?t._$Co?.[n]:t._$Cl,r=B(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,t,n)),n!==void 0?(t._$Co??=[])[n]=i:t._$Cl=i),i!==void 0&&(e=D(s,i._$AS(s,e.values),i,n)),e}var mt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,i=(e?.creationScope??T).importNode(t,!0);C.currentNode=i;let r=C.nextNode(),o=0,a=0,l=n[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new F(r,r.nextSibling,this,e):l.type===1?d=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(d=new yt(r,this,e)),this._$AV.push(d),l=n[++a]}o!==l?.index&&(r=C.nextNode(),o++)}return C.currentNode=T,i}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}},F=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=D(this,e,t),B(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==P&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ve(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&B(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,i=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=W.createElement(Vt(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new mt(i,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=jt.get(e.strings);return t===void 0&&jt.set(e.strings,t=new W(e)),t}k(e){bt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,n,i=0;for(let r of e)i===t.length?t.push(n=new s(this.O(j()),this.O(j()),this,this.options)):n=t[i],n._$AI(r),i++;i<t.length&&(this._$AR(n&&n._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let n=Ot(e).nextSibling;Ot(e).remove(),e=n}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,i,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=c}_$AI(e,t=this,n,i){let r=this.strings,o=!1;if(r===void 0)e=D(this,e,t,0),o=!B(e)||e!==this._$AH&&e!==P,o&&(this._$AH=e);else{let a=e,l,d;for(e=r[0],l=0;l<r.length-1;l++)d=D(this,a[n+l],t,l),d===P&&(d=this._$AH[l]),o||=!B(d)||d!==this._$AH[l],d===c?e=c:e!==c&&(e+=(d??"")+r[l+1]),this._$AH[l]=d}o&&!i&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},gt=class extends O{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},ft=class extends O{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},_t=class extends O{constructor(e,t,n,i,r){super(e,t,n,i,r),this.type=5}_$AI(e,t=this){if((e=D(this,e,t,0)??c)===P)return;let n=this._$AH,i=e===c&&n!==c||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,r=e!==c&&(n===c||i);i&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},yt=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){D(this,e)}};var $e=vt.litHtmlPolyfillSupport;$e?.(W,F),(vt.litHtmlVersions??=[]).push("3.3.3");var qt=(s,e,t)=>{let n=t?.renderBefore??e,i=n._$litPart$;if(i===void 0){let r=t?.renderBefore??null;n._$litPart$=i=new F(e.insertBefore(j(),r),r,void 0,t??{})}return i._$AI(s),i};var wt=globalThis,v=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=qt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};v._$litElement$=!0,v.finalized=!0,wt.litElementHydrateSupport?.({LitElement:v});var we=wt.litElementPolyfillSupport;we?.({LitElement:v});(wt.litElementVersions??=[]).push("4.2.2");function Kt(s){return typeof s=="number"&&Number.isFinite(s)?s:null}function Yt(s){let e=null,t=null;return s.map(n=>(n.a!==void 0&&(e=Kt(n.a.current_temperature)??("current_temperature"in n.a?null:e),t=Kt(n.a.temperature)??("temperature"in n.a?null:t)),{t:n.lu*1e3,current:e,target:t,heat:n.s==="heat"}))}function xe(s){return s.heat&&s.current!==null&&s.target!==null&&s.target>s.current}function Xt(s,e,t){let n=[];return s.forEach((i,r)=>{if(!xe(i))return;let o=Math.max(i.t,e),a=Math.min(r+1<s.length?s[r+1].t:t,t);if(a<=o)return;let l=n[n.length-1];l!==void 0&&l.to===o?l.to=a:n.push({from:o,to:a})}),n}function Gt(s,e,t){let n=(e-s)/t,i=10**Math.floor(Math.log10(n)),r=[1,2,2.5,5,10].map(a=>a*i).find(a=>a>=n)??n,o=[];for(let a=Math.ceil(s/r)*r;a<=e+1e-9;a+=r)o.push(Math.round(a*100)/100);return o}var Se={modes:{home:"Home",away:"Away",preheat:"Preheat",manual:"Manual",boost:"Boost",paused:"Manual (no expiry)",off:"Off"},directions:{towards:"heading home",away_from:"moving away",stationary:"not moving",arrived:"arrived"},travellerHome:s=>`${s} is home`,travellerAway:(s,e,t)=>`${s} is ${e} away, ${t}`,travellerUnknown:s=>`${s}: position unknown`,manualUntil:s=>`Manual until ${s}`,returnToSchedule:"Return to schedule",schedule:"Schedule",allOff:"All off",pausedInfo:"Schedule off: Estia leaves the thermostat alone and keeps the temperature you set, with no end. Slots, away and preheat are ignored until you choose Scheduled again.",offInfo:"Heating off: the thermostat is off and Estia does not touch it.",scheduled:"Scheduled",boost:"Boost",boostUntil:s=>`Boost: maximum until ${s}, then back to before`,settings:"Schedule",edit:"Edit",done:"Done",awaySummary:(s,e)=>`Away: ${s} \xB0C after ${e} min with nobody home`,preheatSummary:s=>`Preheat: within ${s} km when someone is heading home`,preheatOff:"Preheat off",history:"Temperature",roomTemperature:"Room",targetTemperature:"Target",heatingEstimate:"Heating (estimated)",periods:[{hours:24,label:"24 hours"},{hours:168,label:"7 days"},{hours:720,label:"30 days"}],preheat:"Preheat on the way home",awaySetpoint:"Away setpoint",awayDelay:"Away delay",preheatRadius:"Preheat radius",addSlot:"Add slot",deleteSlot:"Delete slot",confirmDelete:"Tap again to delete",start:"Start",setpoint:"Setpoint",noSlots:"No slots: add one with +",unavailable:"Schedule unavailable",full:"No free start time left"},Ee={modes:{home:"In casa",away:"Fuori casa",preheat:"Preriscaldo",manual:"Manuale",boost:"Massimo",paused:"Manuale (senza scadenza)",off:"Spento"},directions:{towards:"sta tornando",away_from:"si allontana",stationary:"non si muove",arrived:"arrivato"},travellerHome:s=>`${s} \xE8 a casa`,travellerAway:(s,e,t)=>`${s} \xE8 a ${e}, ${t}`,travellerUnknown:s=>`${s}: posizione sconosciuta`,manualUntil:s=>`Manuale fino alle ${s}`,returnToSchedule:"Ritorna al programma",schedule:"Programma",allOff:"Spegni tutto",pausedInfo:"Programma spento: Estia non tocca il termostato e tiene la temperatura che hai impostato, senza scadenza. Fasce, fuori casa e preriscaldo sono ignorati finch\xE9 non scegli di nuovo Pianificato.",offInfo:"Riscaldamento spento: il termostato \xE8 spento ed Estia non lo tocca.",scheduled:"Pianificato",boost:"Massimo",boostUntil:s=>`Massimo fino alle ${s}, poi torna com'era`,settings:"Programma",edit:"Modifica",done:"Fatto",awaySummary:(s,e)=>`Fuori casa: ${s} \xB0C dopo ${e} min senza nessuno`,preheatSummary:s=>`Preriscaldo: entro ${s} km se qualcuno sta tornando`,preheatOff:"Preriscaldo spento",history:"Temperatura",roomTemperature:"Ambiente",targetTemperature:"Obiettivo",heatingEstimate:"Riscaldamento (stima)",periods:[{hours:24,label:"24 ore"},{hours:168,label:"7 giorni"},{hours:720,label:"30 giorni"}],preheat:"Preriscaldo al rientro",awaySetpoint:"Temperatura fuori casa",awayDelay:"Ritardo fuori casa",preheatRadius:"Raggio preriscaldo",addSlot:"Aggiungi fascia",deleteSlot:"Elimina fascia",confirmDelete:"Tocca ancora per eliminare",start:"Inizio",setpoint:"Temperatura",noSlots:"Nessuna fascia: aggiungine una con +",unavailable:"Programma non disponibile",full:"Nessun orario libero"};function M(s){return s.split("-")[0]==="it"?Ee:Se}var it=240,y={left:36,right:12,top:12,bottom:28},Ae=5*6e4,q=class extends v{constructor(){super();this._resize=null;this._loaded="";this.hass=void 0,this.entity=void 0,this.hours=24,this._points=null,this._width=0,this._hover=null,this._error=null}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>void this._load(),Ae),this._resize=new ResizeObserver(t=>{let n=t[0]?.contentRect.width??0;Math.abs(n-this._width)>1&&(this._width=n)}),this._resize.observe(this)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer),this._resize?.disconnect()}updated(t){let n=`${this.entity??""}:${this.hours}`;(t.has("hours")||t.has("entity")||t.has("hass"))&&n!==this._loaded&&(this._loaded=n,this._load())}async _load(){if(this.hass===void 0||this.entity===void 0)return;let t=new Date(Date.now()-this.hours*36e5);try{let n=await this.hass.callWS({type:"history/history_during_period",start_time:t.toISOString(),entity_ids:[this.entity],minimal_response:!1,no_attributes:!1,significant_changes_only:!1});this._points=Yt(n[this.entity]??[]),this._error=null}catch(n){this._error=n instanceof Error?n.message:String(n)}}render(){if(this.hass===void 0)return c;let t=M(this.hass.language);if(this._error!==null)return p`<ha-card><div class="message">${this._error}</div></ha-card>`;let n=this._points,i=this._width;if(n===null||i===0)return p`<ha-card><div class="placeholder"></div></ha-card>`;let r=Date.now(),o=r-this.hours*36e5,a=n.flatMap(m=>[m.current,m.target]).filter(m=>m!==null),l=Math.floor(Math.min(...a,18)-.5),d=Math.ceil(Math.max(...a,20)+.5),u=i-y.left-y.right,h=it-y.top-y.bottom,g=m=>y.left+(m-o)/(r-o)*u,f=m=>y.top+(1-(m-l)/(d-l))*h,$=m=>{let lt="",dt=null;return n.forEach((kt,de)=>{let Z=m(kt),Ct=g(Math.max(kt.t,o));if(Z===null){dt=null;return}lt+=dt===null?`M${Ct},${f(Z)}`:`H${Ct}V${f(Z)}`,dt=Z,de===n.length-1&&(lt+=`H${g(r)}`)}),lt},ae=Xt(n,o,r),le=this._timeTicks(o,r),N=this._hover===null?null:this._sampleAt(n,this._hover),Et=this.hass.language,At=m=>m===null?"\u2014":`${new Intl.NumberFormat(Et,{maximumFractionDigits:1}).format(m)} \xB0C`;return p`<ha-card>
      <svg
        width=${i}
        height=${it}
        @pointermove=${m=>this._onMove(m,o,r,u)}
        @pointerleave=${()=>this._hover=null}
      >
        ${ae.map(m=>V`<rect class="band" x=${g(m.from)} y=${y.top} width=${g(m.to)-g(m.from)} height=${h}></rect>`)}
        ${Gt(l,d,5).map(m=>V`<line class="grid" x1=${y.left} x2=${i-y.right} y1=${f(m)} y2=${f(m)}></line>
            <text class="axis" x=${y.left-6} y=${f(m)+4} text-anchor="end">${m}</text>`)}
        ${le.map(m=>V`<text class="axis" x=${g(m.t)} y=${it-8} text-anchor="middle">${m.label}</text>`)}
        <path class="target" d=${$(m=>m.target)}></path>
        <path class="current" d=${$(m=>m.current)}></path>
        ${N===null||this._hover===null?c:V`<line class="cursor" x1=${g(this._hover)} x2=${g(this._hover)} y1=${y.top} y2=${y.top+h}></line>`}
      </svg>
      <div class="legend">
        ${N===null?p`<span><i class="swatch current"></i>${t.roomTemperature}</span>
              <span><i class="swatch target"></i>${t.targetTemperature}</span>
              <span><i class="swatch band"></i>${t.heatingEstimate}</span>`:p`<span>${new Date(N.t).toLocaleString(Et,{weekday:"short",hour:"2-digit",minute:"2-digit"})}</span>
              <span><i class="swatch current"></i>${At(N.current)}</span>
              <span><i class="swatch target"></i>${At(N.target)}</span>`}
      </div>
    </ha-card>`}_sampleAt(t,n){let i=null;for(let r of t){if(r.t>n)break;i=r}return i}_onMove(t,n,i,r){let o=t.currentTarget.getBoundingClientRect(),a=(t.clientX-o.left-y.left)/r;this._hover=a<0||a>1?null:n+a*(i-n)}_timeTicks(t,n){let i=(n-t)/36e5,r=this.hass?.language??"en",o=i<=24?4:i<=168?24:24*7,a=new Date(t);a.setMinutes(0,0,0),o>=24&&a.setHours(0);let l=[];for(let d=a.getTime();d<=n;d+=o*36e5){if(d<t)continue;let u=new Date(d),h=o<24?u.toLocaleTimeString(r,{hour:"2-digit",minute:"2-digit"}):u.toLocaleDateString(r,{day:"numeric",month:"short"});l.push({t:d,label:h})}return l}};q.properties={hass:{attribute:!1},entity:{attribute:!1},hours:{attribute:!1},_points:{state:!0},_width:{state:!0},_hover:{state:!0},_error:{state:!0}},q.styles=A`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px 8px 8px;
      overflow: hidden;
    }
    svg {
      display: block;
      touch-action: pan-y;
    }
    .band {
      fill: var(--warning-color, #ff9800);
      opacity: 0.18;
    }
    .grid {
      stroke: var(--divider-color);
      stroke-width: 1;
    }
    .axis {
      fill: var(--secondary-text-color);
      font-size: 11px;
    }
    path {
      fill: none;
      stroke-width: 2;
      stroke-linejoin: round;
    }
    path.current {
      stroke: var(--info-color, #039be5);
    }
    path.target {
      stroke: var(--warning-color, #ff9800);
      stroke-dasharray: 5 3;
    }
    .cursor {
      stroke: var(--secondary-text-color);
      stroke-width: 1;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px 16px;
      padding: 6px 8px 4px;
      color: var(--secondary-text-color);
      font-size: 0.9em;
      min-height: 1.5em;
    }
    .swatch {
      display: inline-block;
      width: 14px;
      height: 10px;
      margin-right: 6px;
      border-radius: 2px;
      vertical-align: middle;
    }
    .swatch.current {
      background: var(--info-color, #039be5);
    }
    .swatch.target {
      background: var(--warning-color, #ff9800);
    }
    .swatch.band {
      background: var(--warning-color, #ff9800);
      opacity: 0.35;
    }
    .placeholder {
      height: ${it}px;
    }
    .message {
      padding: 16px;
      color: var(--error-color, #db4437);
    }
  `;customElements.get("estia-history")===void 0&&customElements.define("estia-history",q);var U=class{constructor(e){this.onReady=e;this.cards=new Map;this.helpers=null;this.loading=!1}get(e,t){let n=JSON.stringify(e),i=this.cards.get(n);if(i!==void 0)return i.hass=t,i;if(this.helpers===null)return this.load(),null;let r=this.helpers.createCardElement(e);return r.hass=t,this.cards.set(n,r),r}load(){this.loading||(this.loading=!0,ke().then(e=>{e!==null&&(this.helpers=e,this.onReady())}))}};async function ke(){if(window.loadCardHelpers===void 0){if(customElements.get("partial-panel-resolver")===void 0)return null;let s=document.createElement("partial-panel-resolver");s.hass={panels:[{url_path:"estia-lovelace",component_name:"lovelace"}]},s._updateRoutes(),await s.routerOptions.routes["estia-lovelace"].load()}return window.loadCardHelpers===void 0?null:window.loadCardHelpers()}var Jt="estia-panel-period",xt=new CSSStyleSheet;xt.replaceSync("ha-icon-button.more-info { display: none !important; }");function Ce(s,e){for(let t of Object.values(s.states))if(t!==void 0&&t.entity_id.startsWith("sensor.")&&t.attributes.config_entry_id===e&&s.entities[t.entity_id]?.platform==="estia")return t.entity_id;return null}function Te(){try{let s=Number(window.localStorage.getItem(Jt));return s>0?s:24}catch{return 24}}function Pe(s){try{window.localStorage.setItem(Jt,String(s))}catch{}}var K=class extends v{constructor(){super();this._card=null;this._entity=null;this._native=new U(()=>this.requestUpdate());this.hass=void 0,this.narrow=!1,this.panel=void 0,this._hours=Te()}_scheduleCard(t){return(this._card===null||this._entity!==t)&&(this._card=document.createElement("estia-card"),this._card.setConfig({type:"custom:estia-card",entity:t}),this._entity=t),this._card.hass=this.hass,this._card}updated(){let t=this.shadowRoot?.querySelector(".thermostat > *")?.shadowRoot;t!=null&&!t.adoptedStyleSheets.includes(xt)&&(t.adoptedStyleSheets=[...t.adoptedStyleSheets,xt])}_setPeriod(t){this._hours=t,Pe(t)}render(){let t=this.hass;if(t===void 0||this.panel===void 0)return c;let n=M(t.language),i=Ce(t,this.panel.config.config_entry_id),r=i===null?void 0:t.states[i]?.attributes.climate_entity,o=typeof r=="string"?this._native.get({type:"thermostat",entity:r},t):null;return p`
      <div class="toolbar">
        <ha-menu-button .hass=${t} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">${this.panel.title??"Estia"}</div>
      </div>
      ${i===null?p`<div class="message">${n.unavailable}</div>`:p`<div class="layout">
            <div class="column">
              ${o===null?c:p`<div class="thermostat">${o}</div>`}
              ${this._scheduleCard(i)}
            </div>
            <div class="column">
              <div class="periods">
                <span class="heading">${n.history}</span>
                ${n.periods.map(a=>p`<button
                    class=${a.hours===this._hours?"selected":""}
                    @click=${()=>this._setPeriod(a.hours)}
                  >
                    ${a.label}
                  </button>`)}
              </div>
              ${typeof r=="string"?p`<estia-history .hass=${t} .entity=${r} .hours=${this._hours}></estia-history>`:c}
            </div>
          </div>`}
    `}};K.properties={hass:{attribute:!1},narrow:{attribute:!1},panel:{attribute:!1},_hours:{state:!0}},K.styles=A`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
    }
    .toolbar {
      display: flex;
      align-items: center;
      height: var(--header-height, 56px);
      padding: 0 12px;
      gap: 12px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color, #fff));
      font-size: 20px;
    }
    .layout {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
      gap: 16px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
      box-sizing: border-box;
    }
    .column {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
    }
    /* The thermostat card sizes its dial to its box, which a plain column
       does not give it: without a height the dial shrinks to a thumbnail. */
    .thermostat {
      height: 400px;
    }
    .thermostat > * {
      height: 100%;
    }
    .periods {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
    .heading {
      flex: 1;
      font-size: 1.2em;
      font-weight: 500;
    }
    .periods button {
      font: inherit;
      min-height: 40px;
      padding: 8px 16px;
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      cursor: pointer;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .periods button.selected {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .message {
      padding: 16px;
    }
  `;customElements.get("estia-panel")===void 0&&customElements.define("estia-panel",K);var Zt=["home","away","preheat","manual","boost","paused","off"];var H=24*60,S=15,b=class extends Error{};function _(s,e){if(!(e in s))throw new b(`missing attribute ${e}`);return s[e]}function R(s,e){if(typeof s!="string")throw new b(`${e} is not a string`);return s}function Y(s,e){if(typeof s!="number")throw new b(`${e} is not a number`);return s}function st(s,e){return s===null?null:R(s,e)}function Qt(s,e){if(!Array.isArray(s))throw new b(`${e} is not a list`);return s}function te(s,e){if(typeof s!="object"||s===null||Array.isArray(s))throw new b(`${e} is not a mapping`);return s}function St(s){let e=/^(\d{2}):(\d{2})$/.exec(s);if(e===null)throw new b(`bad time ${s}`);return Number(e[1])*60+Number(e[2])}function E(s){let e=Math.floor(s/60)%24,t=s%60;return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}`}function Me(s){if(s==="unknown"||s==="unavailable")return null;let e=Zt.find(t=>t===s);if(e===void 0)throw new b(`unknown mode ${s}`);return e}function ee(s){let e=s.attributes,t=Qt(_(e,"slots"),"slots").map((a,l)=>{let d=te(a,`slot ${l}`);return{id:R(_(d,"id"),"slot id"),start:St(R(_(d,"start"),"slot start")),setpoint:Y(_(d,"setpoint"),"slot setpoint")}}),n=Qt(_(e,"proximity"),"proximity").map((a,l)=>{let d=te(a,`proximity ${l}`);return{distance:R(_(d,"distance"),"distance sensor"),direction:R(_(d,"direction"),"direction sensor"),person:st(_(d,"person"),"tracked person")}}),i=st(_(e,"hold_until"),"hold_until"),r=st(_(e,"boost_until"),"boost_until"),o=_(e,"target");return{mode:Me(s.state),slots:t.sort((a,l)=>a.start-l.start),activeSlot:st(_(e,"active_slot"),"active_slot"),holdUntil:i===null?null:new Date(i),boostUntil:r===null?null:new Date(r),target:o===null?null:Y(o,"target"),configEntryId:R(_(e,"config_entry_id"),"config_entry_id"),climate:R(_(e,"climate_entity"),"climate_entity"),proximity:n,setpointMin:Y(_(e,"setpoint_min"),"setpoint_min"),setpointMax:Y(_(e,"setpoint_max"),"setpoint_max"),setpointStep:Y(_(e,"setpoint_step"),"setpoint_step")}}var Re=["schedule","boost","preheat","away_setpoint","away_delay","preheat_radius","resume","all_off"];function rt(s,e){let t={schedule:null,boost:null,preheat:null,away_setpoint:null,away_delay:null,preheat_radius:null,resume:null,all_off:null},n=s.entities[e]?.device_id??null;if(n===null)return t;for(let i of Object.values(s.entities)){if(i===void 0||i.platform!=="estia"||i.device_id!==n)continue;let r=Re.find(o=>o===i.translation_key);r!==void 0&&(t[r]=i.entity_id)}return t}function ne(s){if(s.length===0)return[];let e=[...s].sort((i,r)=>i.start-r.start),t=[],n=e[e.length-1];return e[0].start>0&&t.push({slot:n,from:0,to:e[0].start}),e.forEach((i,r)=>{let o=r+1<e.length?e[r+1].start:H;t.push({slot:i,from:i.start,to:o})}),t.filter(i=>i.to>i.from)}function ie(s,e){let t=[...s].sort((o,a)=>o.start-a.start),n=t.findIndex(o=>o.id===e);if(n<0)throw new b(`no slot ${e}`);let i=n>0?t[n-1].start+S:0,r=n+1<t.length?t[n+1].start-S:H-S;return{min:i,max:r}}function se(s,e){let t=Math.round(s/S)*S;return Math.min(e.max,Math.max(e.min,t))}function re(s){let e=new Set(s.map(r=>r.start));if(!e.has(12*60))return 12*60;let t=[...e].sort((r,o)=>r-o),n=0,i=null;for(let r=0;r<t.length;r++){let o=t[r],l=(r+1<t.length?t[r+1]:t[0]+H)-o,d=Math.round((o+l/2)/S)*S%H;l>S&&!e.has(d)&&l>n&&(n=l,i=d)}return i}function oe(s,e,t){return`hsl(${(210-210*Math.min(1,Math.max(0,(s-e)/(t-e)))).toFixed(0)}, 70%, 52%)`}function ot(s){return s.getHours()*60+s.getMinutes()}var He=550,De=900,Oe=10,Ue=26,X="estia",Ne={home:"var(--success-color, #43a047)",away:"var(--info-color, #039be5)",preheat:"var(--warning-color, #ffa600)",manual:"var(--accent-color, #ff9800)",boost:"var(--error-color, #db4437)",paused:"var(--disabled-text-color, #9e9e9e)",off:"var(--secondary-text-color, #727272)"};function Ie(s,e){if(s===void 0)return null;let t=s.attributes[e];return typeof t=="number"?t:null}function at(s,e){if(s===void 0)return null;let t=s.attributes[e];return typeof t=="string"?t:null}function ze(s){if(s===void 0)return null;let e=Number(s.state);if(s.state===""||!Number.isFinite(e))return null;let t={m:1,km:1e3,mi:1609.344,ft:.3048,yd:.9144},n=at(s,"unit_of_measurement");return n===null||!(n in t)?null:e*t[n]}function G(s){return`${(s/H*100).toFixed(3)}%`}var J=class extends v{constructor(){super();this._native=new U(()=>this.requestUpdate());this._longPressed=!1;this.hass=void 0,this._config=void 0,this._selected=null,this._drag=null,this._pending=null,this._armedDelete=null,this._error=null,this._editing=!1}setConfig(t){if(typeof t.entity!="string"||!t.entity.startsWith("sensor."))throw new Error("entity: the Estia mode sensor (sensor.\u2026) is required");this._config=t}getCardSize(){return 6}static getStubConfig(t){let n=Object.values(t.entities).find(i=>i!==void 0&&i.platform===X&&i.entity_id.startsWith("sensor."));return n===void 0?{}:{entity:n.entity_id}}connectedCallback(){super.connectedCallback(),this._clock=window.setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._clock),window.clearTimeout(this._longPress),this._pending!==null&&window.clearTimeout(this._pending.timer)}shouldUpdate(t){return!(this._drag!==null&&t.size===1&&t.has("hass"))}async _call(t,n,i){if(this.hass!==void 0){this._error=null;try{await this.hass.callService(t,n,i)}catch(r){this._error=r instanceof Error?r.message:String(r)}}}_setSlot(t,n,i,r){return this._call(X,"set_slot",{config_entry_id:t.configEntryId,slot_id:n.id,start:E(i),setpoint:r})}_onHandleDown(t,n,i){t.stopPropagation(),t.preventDefault();let r=t.currentTarget.parentElement;if(r===null)return;t.currentTarget.setPointerCapture(t.pointerId);let o=ie(n.slots,i.id);this._drag={id:i.id,start:i.start,...o,bar:r.getBoundingClientRect()},this._selected=i.id}_onHandleMove(t){let n=this._drag;if(n===null)return;let i=(t.clientX-n.bar.left)/n.bar.width*H,r=se(i,n);r!==n.start&&(this._drag={...n,start:r})}async _onHandleUp(t){let n=this._drag;if(n===null)return;let i=t.slots.find(r=>r.id===n.id);i!==void 0&&n.start!==i.start&&await this._setSlot(t,i,n.start,i.setpoint),this._drag=null}_onSegmentDown(t){this._longPressed=!1,window.clearTimeout(this._longPress),this._longPress=window.setTimeout(()=>{this._longPressed=!0,this._selected=t.id,this._armedDelete=t.id},He)}_onSegmentUp(t){window.clearTimeout(this._longPress),!this._longPressed&&(this._armedDelete=null,this._selected=this._selected===t.id?null:t.id)}_shown(t){return this._pending?.id===t.id?this._pending.value:t.setpoint}_setPending(t,n,i){if(!Number.isFinite(i))return;let r=Math.round(i*10)/10,o=Math.min(t.setpointMax,Math.max(t.setpointMin,r));this._pending!==null&&window.clearTimeout(this._pending.timer);let a=window.setTimeout(async()=>{this._pending=null,await this._setSlot(t,n,n.start,o)},De);this._pending={id:n.id,value:o,timer:a}}_step(t,n,i){this._setPending(t,n,this._shown(n)+i*t.setpointStep)}_onWheel(t,n,i){t.preventDefault(),this._step(n,i,t.deltaY<0?1:-1)}async _onStartInput(t,n,i){let r=t.target.value;r!==""&&await this._setSlot(n,i,St(r.slice(0,5)),i.setpoint)}async _delete(t,n){if(this._armedDelete!==n.id){this._armedDelete=n.id;return}this._armedDelete=null,this._selected=null,await this._call(X,"remove_slot",{config_entry_id:t.configEntryId,slot_id:n.id})}async _add(t,n){let i=re(t.slots);if(i===null){this._error=M(this.hass?.language??"en").full;return}let r=Ie(n,"temperature")??t.target??t.setpointMin;await this._call(X,"add_slot",{config_entry_id:t.configEntryId,start:E(i),setpoint:r})}render(){if(this.hass===void 0||this._config===void 0)return c;let t=M(this.hass.language),n=this.hass.states[this._config.entity];if(n===void 0||n.state==="unavailable")return p`<ha-card><div class="message">${t.unavailable}: ${this._config.entity}</div></ha-card>`;let i;try{i=ee(n)}catch(l){return p`<ha-card><div class="message error">${this._config.entity}: ${String(l)}</div></ha-card>`}let r=this.hass.states[i.climate],o=this._withDrag(i.slots),a=this._editing?o.find(l=>l.id===this._selected):void 0;return p`
      <ha-card>
        ${this._renderHeader(i,r,t)} ${this._renderActions(i,t)}
        ${this._error===null?c:p`<div class="message error">${this._error}</div>`}
      </ha-card>
      <ha-card>
        <div class="settings-head">
          <span class="section">${t.settings}</span>
          <button class=${this._editing?"primary":""} @click=${()=>this._toggleEditing()}>
            ${this._editing?t.done:t.edit}
          </button>
        </div>
        ${this._renderTimeline(i,o,t)}
        ${a===void 0?c:this._renderEditor(i,a,t)}
        ${this._editing?c:this._renderSummary(i,t)}
      </ha-card>
      ${this._editing?this._renderControls(t):c}
    `}_toggleEditing(){this._editing=!this._editing,this._selected=null,this._armedDelete=null}_withDrag(t){let n=this._drag;return n===null?t:t.map(i=>i.id===n.id?{...i,start:n.start}:i)}_renderHeader(t,n,i){let r=this._config?.title??at(n,"friendly_name")??t.climate,o=t.mode;return p`
      <div class="header">
        <div class="title">${r}</div>
        ${o===null?c:p`<span class="badge" style="background:${Ne[o]}">${i.modes[o]}</span>`}
      </div>
      ${o==="boost"&&t.boostUntil!==null?p`<div class="hold"><span>${i.boostUntil(E(ot(t.boostUntil)))}</span></div>`:c}
      ${o==="manual"&&t.holdUntil!==null?p`<div class="hold">
            <span>${i.manualUntil(E(ot(t.holdUntil)))}</span>
            <button
              class="primary"
              @click=${()=>this._call(X,"resume",{config_entry_id:t.configEntryId})}
            >
              ${i.returnToSchedule}
            </button>
          </div>`:c}
      ${o==="paused"?p`<div class="hold"><span>${i.pausedInfo}</span></div>`:c}
      ${o==="off"?p`<div class="hold"><span>${i.offInfo}</span></div>`:c}
    `}_renderActions(t,n){if(this.hass===void 0||this._config===void 0)return c;let i=rt(this.hass,this._config.entity),r=t.mode,a=i.schedule!==null&&this.hass.states[i.schedule]?.state==="on"&&r!=="boost"&&r!=="off",l=r==="boost",d=r==="off",u=(h,g,f,$)=>p`<button class="action ${h?"active":""}" @click=${$}>
      <ha-icon .icon=${g}></ha-icon><span>${f}</span>
    </button>`;return p`<div class="actions">
      ${u(a,"mdi:calendar-clock",n.scheduled,async()=>{i.schedule!==null&&await this._call("switch",a?"turn_off":"turn_on",{entity_id:i.schedule})})}
      ${u(l,"mdi:fire",n.boost,async()=>{i.boost!==null&&await this._call("switch",l?"turn_off":"turn_on",{entity_id:i.boost})})}
      ${u(d,"mdi:power",n.allOff,async()=>{i.all_off===null||d||await this._call("button","press",{entity_id:i.all_off})})}
    </div>`}_renderTraveller(t,n){let i=this.hass;if(i===void 0)return c;let r=t.person===null?void 0:i.states[t.person],o=i.states[t.distance],a=i.states[t.direction]?.state,l=at(r,"friendly_name")??at(o,"friendly_name")??t.distance,d=ze(o),u,h;if(r?.state==="home"||a==="arrived"||d===0)u="\u{1F3E0}",h=n.travellerHome(l);else if(d===null)u="\u2754",h=n.travellerUnknown(l);else{u=a==="towards"?"\u{1F697}":a==="away_from"?"\u{1F3C3}":"\u{1F4CD}";let g=new Intl.NumberFormat(i.language,{maximumFractionDigits:1}).format(d/1e3),f=a===void 0?"":n.directions[a]??a;h=n.travellerAway(l,`${g} km`,f)}return p`<div class="traveller"><span class="emoji">${u}</span><span>${h}</span></div>`}_renderSummary(t,n){if(this.hass===void 0||this._config===void 0)return c;let i=this.hass,r=rt(i,this._config.entity),o=l=>l===null?"\u2014":i.states[l]?.state??"\u2014",a=r.preheat!==null&&i.states[r.preheat]?.state==="on";return p`<div class="summary">
      <div>${n.awaySummary(o(r.away_setpoint),o(r.away_delay))}</div>
      <div>${a?n.preheatSummary(o(r.preheat_radius)):n.preheatOff}</div>
      ${a?t.proximity.map(l=>this._renderTraveller(l,n)):c}
    </div>`}_renderTimeline(t,n,i){let r=this._editing,o=ot(new Date),a=Math.min(...n.map(d=>d.setpoint),16),l=Math.max(...n.map(d=>d.setpoint),23);return p`
      <div class="timeline ${this._editing?"editing":""}">
        <div class="bar">
          ${n.length===0?p`<div class="empty">${i.noSlots}</div>`:c}
          ${ne(n).map(d=>{let u=d.slot,h=u.id===t.activeSlot,g=this._shown(u);return p`<div
              class="segment ${h?"active":""} ${u.id===this._selected?"selected":""}"
              style="left:${G(d.from)};width:${G(d.to-d.from)};background:${oe(g,a,l)}"
              @pointerdown=${r?()=>this._onSegmentDown(u):c}
              @pointerup=${r?()=>this._onSegmentUp(u):c}
              @pointerleave=${r?()=>window.clearTimeout(this._longPress):c}
              @contextmenu=${r?f=>f.preventDefault():c}
            >
              ${d.to-d.from>=100?p`<span>${g.toFixed(1)}°</span>`:c}
            </div>`})}
          ${(this._editing?n:[]).map(d=>p`<div
              class="handle ${this._drag?.id===d.id?"dragging":""}"
              style="left:${G(d.start)}"
              title=${E(d.start)}
              @pointerdown=${u=>this._onHandleDown(u,t,d)}
              @pointermove=${u=>this._onHandleMove(u)}
              @pointerup=${()=>this._onHandleUp(t)}
              @pointercancel=${()=>this._drag=null}
            >
              ${this._drag?.id===d.id?p`<span class="tip">${E(d.start)}</span>`:c}
            </div>`)}
          <div class="now" style="left:${G(o)}"></div>
        </div>
        <div class="ticks">
          ${[0,6,12,18,24].map(d=>p`<span style="left:${G(d*60)}">${d}</span>`)}
        </div>
        ${this._editing?p`<button
              class="add"
              title=${i.addSlot}
              @click=${()=>this._add(t,this.hass?.states[t.climate])}
            >
              +
            </button>`:c}
      </div>
    `}_renderEditor(t,n,i){let r=this._shown(n),o=this._armedDelete===n.id;return p`
      <div class="editor">
        <label>
          <span class="label">${i.start}</span>
          <input
            type="time"
            step="900"
            .value=${E(n.start)}
            @change=${a=>this._onStartInput(a,t,n)}
          />
        </label>
        <div class="setpoint" @wheel=${a=>this._onWheel(a,t,n)}>
          <div class="stepper">
            <span class="label">${i.setpoint}</span>
            <button @click=${()=>this._step(t,n,-1)}>−</button>
            <input
              class="value"
              type="number"
              inputmode="decimal"
              min=${t.setpointMin}
              max=${t.setpointMax}
              step=${t.setpointStep}
              .value=${r.toFixed(1)}
              @change=${a=>this._setPending(t,n,Number(a.target.value))}
            />
            <span class="big">°</span>
            <button @click=${()=>this._step(t,n,1)}>+</button>
          </div>
          <input
            class="slider"
            type="range"
            min=${Oe}
            max=${Ue}
            step=${t.setpointStep}
            .value=${String(r)}
            @input=${a=>this._setPending(t,n,Number(a.target.value))}
          />
        </div>
        <button class="delete ${o?"armed":""}" @click=${()=>this._delete(t,n)}>
          ${o?i.confirmDelete:i.deleteSlot}
        </button>
      </div>
    `}_renderControls(t){if(this.hass===void 0||this._config===void 0)return c;let n=rt(this.hass,this._config.entity),i=(a,l)=>a===null?[]:[{entity:a,name:l}],r=[...i(n.away_setpoint,t.awaySetpoint),...i(n.away_delay,t.awayDelay),...i(n.preheat,t.preheat),...i(n.preheat_radius,t.preheatRadius).map(a=>n.preheat===null?a:{type:"conditional",conditions:[{condition:"state",entity:n.preheat,state:"on"}],row:a})],o=this._native.get({type:"entities",entities:r},this.hass);return o===null?c:p`<div class="controls">${o}</div>`}};J.properties={hass:{attribute:!1},_config:{state:!0},_selected:{state:!0},_drag:{state:!0},_pending:{state:!0},_armedDelete:{state:!0},_error:{state:!0},_editing:{state:!0}},J.styles=A`
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
      --estia-radius: var(--ha-card-border-radius, 12px);
    }
    ha-card {
      padding: 20px;
      color: var(--primary-text-color);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .title {
      font-size: 1.4em;
      font-weight: 500;
    }
    .badge {
      color: var(--text-primary-color, #fff);
      border-radius: 999px;
      padding: 6px 14px;
      font-size: 1em;
      font-weight: 500;
      white-space: nowrap;
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .label {
      color: var(--secondary-text-color);
      font-size: 0.95em;
    }
    .big {
      font-size: 2em;
      font-variant-numeric: tabular-nums;
    }
    .hold {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      margin-top: 16px;
      border-radius: var(--estia-radius);
      background: var(--secondary-background-color);
      font-size: 1.05em;
    }
    .timeline {
      position: relative;
      padding: 24px 0 4px 0;
    }
    .timeline.editing {
      padding-right: 60px;
    }
    .actions {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 16px;
    }
    .action {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      min-height: 72px;
      border-radius: 14px;
      font-size: 1em;
      font-weight: 500;
      border: 2px solid transparent;
    }
    .action.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .settings-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .section {
      font-size: 1.2em;
      font-weight: 500;
    }
    .summary {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 12px;
      font-size: 1em;
    }
    .secondary {
      color: var(--secondary-text-color);
    }
    .traveller {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .emoji {
      font-size: 1.3em;
      width: 1.4em;
      text-align: center;
    }
    .bar {
      position: relative;
      height: 72px;
      border-radius: 10px;
      background: var(--secondary-background-color);
    }
    .timeline.editing .bar {
      touch-action: none;
      user-select: none;
    }
    .segment {
      position: absolute;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1.05em;
      font-weight: 500;
      opacity: 0.8;
      box-sizing: border-box;
    }
    .timeline.editing .segment {
      cursor: pointer;
    }
    .segment.active {
      opacity: 1;
      box-shadow: inset 0 0 0 3px var(--primary-text-color);
    }
    .segment.selected {
      box-shadow: inset 0 0 0 4px var(--primary-color);
    }
    .handle {
      position: absolute;
      top: -10px;
      bottom: -10px;
      width: 28px;
      margin-left: -14px;
      cursor: ew-resize;
      z-index: 2;
    }
    .handle::after {
      content: "";
      position: absolute;
      left: 12px;
      top: 0;
      bottom: 0;
      width: 4px;
      border-radius: 2px;
      background: var(--card-background-color, #fff);
    }
    .handle.dragging::after {
      background: var(--primary-color);
    }
    .tip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 8px;
      border-radius: 6px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 0.95em;
      white-space: nowrap;
    }
    .now {
      position: absolute;
      top: -6px;
      bottom: -6px;
      width: 3px;
      margin-left: -1px;
      background: var(--error-color, #db4437);
      pointer-events: none;
      z-index: 3;
    }
    .ticks {
      position: relative;
      height: 20px;
      margin-top: 8px;
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .ticks span {
      position: absolute;
      transform: translateX(-50%);
    }
    .empty {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
    }
    button {
      font: inherit;
      min-height: 44px;
      border: none;
      border-radius: 999px;
      padding: 8px 18px;
      cursor: pointer;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    button.delete.armed {
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .add {
      position: absolute;
      right: 0;
      top: 24px;
      width: 48px;
      height: 72px;
      padding: 0;
      font-size: 1.8em;
      border-radius: 10px;
    }
    .editor {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px 28px;
      margin-top: 16px;
      padding: 16px;
      border-radius: var(--estia-radius);
      background: var(--secondary-background-color);
    }
    .editor label {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .setpoint {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1 1 280px;
    }
    .value {
      width: 4.2em;
      font-size: 1.6em;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
    .slider {
      width: 100%;
      min-height: 32px;
      padding: 0;
      border: none;
      background: none;
      accent-color: var(--primary-color);
    }
    .stepper button {
      width: 48px;
      height: 48px;
      padding: 0;
      font-size: 1.5em;
      background: var(--card-background-color);
    }
    input {
      font: inherit;
      font-size: 1.15em;
      min-height: 44px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 6px 10px;
    }
    .message {
      padding: 8px 0;
    }
    .error {
      color: var(--error-color, #db4437);
    }
  `;customElements.get("estia-card")===void 0&&customElements.define("estia-card",J);window.customCards=window.customCards??[];window.customCards.push({type:"estia-card",name:"Estia",description:"Heating schedule: 24 h timeline with drag-to-edit slots",preview:!1});export{J as EstiaCard};
