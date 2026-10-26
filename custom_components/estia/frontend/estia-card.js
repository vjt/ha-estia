var K=globalThis,Y=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Z=Symbol(),mt=new WeakMap,R=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Y&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=mt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&mt.set(e,t))}return t}toString(){return this.cssText}},ft=s=>new R(typeof s=="string"?s:s+"",void 0,Z),H=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,i,r)=>n+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new R(e,s,Z)},gt=(s,t)=>{if(Y)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),i=K.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=e.cssText,s.appendChild(n)}},Q=Y?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return ft(e)})(s):s;var{is:Wt,defineProperty:Ft,getOwnPropertyDescriptor:qt,getOwnPropertyNames:Vt,getOwnPropertySymbols:Kt,getPrototypeOf:Yt}=Object,X=globalThis,_t=X.trustedTypes,Xt=_t?_t.emptyScript:"",Jt=X.reactiveElementPolyfillSupport,O=(s,t)=>s,tt={toAttribute(s,t){switch(t){case Boolean:s=s?Xt:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},vt=(s,t)=>!Wt(s,t),yt={attribute:!0,type:String,converter:tt,reflect:!1,useDefault:!1,hasChanged:vt};Symbol.metadata??=Symbol("metadata"),X.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=yt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(t,n,e);i!==void 0&&Ft(this.prototype,t,i)}}static getPropertyDescriptor(t,e,n){let{get:i,set:r}=qt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let l=i?.call(this);r?.call(this,o),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??yt}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=Yt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,n=[...Vt(e),...Kt(e)];for(let i of n)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,i]of e)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let i=this._$Eu(e,n);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)e.unshift(Q(i))}else t!==void 0&&e.push(Q(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return gt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(i!==void 0&&n.reflect===!0){let r=(n.converter?.toAttribute!==void 0?n.converter:tt).toAttribute(e,n.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let n=this.constructor,i=n._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=n.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:tt;this._$Em=i;let l=o.fromAttribute(e,r.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,n,i=!1,r){if(t!==void 0){let o=this.constructor;if(i===!1&&(r=this[t]),n??=o.getPropertyOptions(t),!((n.hasChanged??vt)(r,e)||n.useDefault&&n.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:i,wrapped:r},o){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,r]of n){let{wrapped:o}=r,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,r,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[O("elementProperties")]=new Map,y[O("finalized")]=new Map,Jt?.({ReactiveElement:y}),(X.reactiveElementVersions??=[]).push("2.1.2");var at=globalThis,$t=s=>s,J=at.trustedTypes,bt=J?J.createPolicy("lit-html",{createHTML:s=>s}):void 0,Ct="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,Pt="?"+$,Gt=`<${Pt}>`,S=document,U=()=>S.createComment(""),N=s=>s===null||typeof s!="object"&&typeof s!="function",lt=Array.isArray,Zt=s=>lt(s)||typeof s?.[Symbol.iterator]=="function",et=`[ 	
\f\r]`,D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xt=/-->/g,wt=/>/g,x=RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),St=/'/g,At=/"/g,kt=/^(?:script|style|textarea|title)$/i,dt=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),p=dt(1),$e=dt(2),be=dt(3),A=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),Et=new WeakMap,w=S.createTreeWalker(S,129);function Tt(s,t){if(!lt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return bt!==void 0?bt.createHTML(t):t}var Qt=(s,t)=>{let e=s.length-1,n=[],i,r=t===2?"<svg>":t===3?"<math>":"",o=D;for(let l=0;l<e;l++){let a=s[l],c,h,u=-1,f=0;for(;f<a.length&&(o.lastIndex=f,h=o.exec(a),h!==null);)f=o.lastIndex,o===D?h[1]==="!--"?o=xt:h[1]!==void 0?o=wt:h[2]!==void 0?(kt.test(h[2])&&(i=RegExp("</"+h[2],"g")),o=x):h[3]!==void 0&&(o=x):o===x?h[0]===">"?(o=i??D,u=-1):h[1]===void 0?u=-2:(u=o.lastIndex-h[2].length,c=h[1],o=h[3]===void 0?x:h[3]==='"'?At:St):o===At||o===St?o=x:o===xt||o===wt?o=D:(o=x,i=void 0);let v=o===x&&s[l+1].startsWith("/>")?" ":"";r+=o===D?a+Gt:u>=0?(n.push(c),a.slice(0,u)+Ct+a.slice(u)+$+v):a+$+(u===-2?l:v)}return[Tt(s,r+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},I=class s{constructor({strings:t,_$litType$:e},n){let i;this.parts=[];let r=0,o=0,l=t.length-1,a=this.parts,[c,h]=Qt(t,e);if(this.el=s.createElement(c,n),w.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=w.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(Ct)){let f=h[o++],v=i.getAttribute(u).split($),V=/([.?@])?(.*)/.exec(f);a.push({type:1,index:r,name:V[2],strings:v,ctor:V[1]==="."?it:V[1]==="?"?st:V[1]==="@"?rt:T}),i.removeAttribute(u)}else u.startsWith($)&&(a.push({type:6,index:r}),i.removeAttribute(u));if(kt.test(i.tagName)){let u=i.textContent.split($),f=u.length-1;if(f>0){i.textContent=J?J.emptyScript:"";for(let v=0;v<f;v++)i.append(u[v],U()),w.nextNode(),a.push({type:2,index:++r});i.append(u[f],U())}}}else if(i.nodeType===8)if(i.data===Pt)a.push({type:2,index:r});else{let u=-1;for(;(u=i.data.indexOf($,u+1))!==-1;)a.push({type:7,index:r}),u+=$.length-1}r++}}static createElement(t,e){let n=S.createElement("template");return n.innerHTML=t,n}};function k(s,t,e=s,n){if(t===A)return t;let i=n!==void 0?e._$Co?.[n]:e._$Cl,r=N(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=i:e._$Cl=i),i!==void 0&&(t=k(s,i._$AS(s,t.values),i,n)),t}var nt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,i=(t?.creationScope??S).importNode(e,!0);w.currentNode=i;let r=w.nextNode(),o=0,l=0,a=n[0];for(;a!==void 0;){if(o===a.index){let c;a.type===2?c=new L(r,r.nextSibling,this,t):a.type===1?c=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(c=new ot(r,this,t)),this._$AV.push(c),a=n[++l]}o!==a?.index&&(r=w.nextNode(),o++)}return w.currentNode=S,i}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},L=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=k(this,t,e),N(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Zt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=I.createElement(Tt(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new nt(i,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=Et.get(t.strings);return e===void 0&&Et.set(t.strings,e=new I(t)),e}k(t){lt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,i=0;for(let r of t)i===e.length?e.push(n=new s(this.O(U()),this.O(U()),this,this.options)):n=e[i],n._$AI(r),i++;i<e.length&&(this._$AR(n&&n._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=$t(t).nextSibling;$t(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,i,r){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=d}_$AI(t,e=this,n,i){let r=this.strings,o=!1;if(r===void 0)t=k(this,t,e,0),o=!N(t)||t!==this._$AH&&t!==A,o&&(this._$AH=t);else{let l=t,a,c;for(t=r[0],a=0;a<r.length-1;a++)c=k(this,l[n+a],e,a),c===A&&(c=this._$AH[a]),o||=!N(c)||c!==this._$AH[a],c===d?t=d:t!==d&&(t+=(c??"")+r[a+1]),this._$AH[a]=c}o&&!i&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},it=class extends T{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},st=class extends T{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},rt=class extends T{constructor(t,e,n,i,r){super(t,e,n,i,r),this.type=5}_$AI(t,e=this){if((t=k(this,t,e,0)??d)===A)return;let n=this._$AH,i=t===d&&n!==d||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==d&&(n===d||i);i&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ot=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){k(this,t)}};var te=at.litHtmlPolyfillSupport;te?.(I,L),(at.litHtmlVersions??=[]).push("3.3.3");var Mt=(s,t,e)=>{let n=e?.renderBefore??t,i=n._$litPart$;if(i===void 0){let r=e?.renderBefore??null;n._$litPart$=i=new L(t.insertBefore(U(),r),r,void 0,e??{})}return i._$AI(s),i};var ct=globalThis,g=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Mt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};g._$litElement$=!0,g.finalized=!0,ct.litElementHydrateSupport?.({LitElement:g});var ee=ct.litElementPolyfillSupport;ee?.({LitElement:g});(ct.litElementVersions??=[]).push("4.2.2");var ne={modes:{home:"Home",away:"Away",preheat:"Preheat",manual:"Manual",paused:"Paused",off:"Off"},directions:{towards:"heading home",away_from:"moving away",stationary:"stationary",arrived:"arrived"},manualUntil:s=>`Manual until ${s}`,returnToSchedule:"Return to schedule",schedule:"Schedule",allOff:"All off",allOffAction:"Turn off",pausedInfo:"Schedule paused: Estia leaves the thermostat alone, the temperature is up to you. Slots, away and preheat are ignored until you resume it.",resumeSchedule:"Resume schedule",offInfo:"Heating off: the thermostat is off and Estia does not touch it.",turnBackOn:"Turn back on",confirmAllOff:"Stop the schedule and switch the heating off?",awaySection:"Away and coming home",history:"Temperature",periods:[{hours:24,label:"24 hours"},{hours:168,label:"7 days"},{hours:720,label:"30 days"}],preheat:"Preheat on the way home",awaySetpoint:"Away setpoint",awayDelay:"Away delay",preheatRadius:"Preheat radius",addSlot:"Add slot",deleteSlot:"Delete slot",confirmDelete:"Tap again to delete",start:"Start",setpoint:"Setpoint",current:"Now",target:"Target",noSlots:"No slots: add one with +",unavailable:"Schedule unavailable",full:"No free start time left"},ie={modes:{home:"In casa",away:"Fuori casa",preheat:"Preriscaldo",manual:"Manuale",paused:"Sospeso",off:"Spento"},directions:{towards:"sta tornando",away_from:"si allontana",stationary:"fermo",arrived:"arrivato"},manualUntil:s=>`Manuale fino alle ${s}`,returnToSchedule:"Ritorna al programma",schedule:"Programma",allOff:"Spegni tutto",allOffAction:"Spegni",pausedInfo:"Programma in pausa: Estia non tocca il termostato, la temperatura la decidi tu. Fasce, fuori casa e preriscaldo sono ignorati finch\xE9 non lo riattivi.",resumeSchedule:"Riattiva programma",offInfo:"Riscaldamento spento: il termostato \xE8 spento ed Estia non lo tocca.",turnBackOn:"Riaccendi",confirmAllOff:"Spegnere riscaldamento e programma?",awaySection:"Fuori casa e rientro",history:"Temperatura",periods:[{hours:24,label:"24 ore"},{hours:168,label:"7 giorni"},{hours:720,label:"30 giorni"}],preheat:"Preriscaldo al rientro",awaySetpoint:"Temperatura fuori casa",awayDelay:"Ritardo fuori casa",preheatRadius:"Raggio preriscaldo",addSlot:"Aggiungi fascia",deleteSlot:"Elimina fascia",confirmDelete:"Tocca ancora per eliminare",start:"Inizio",setpoint:"Temperatura",current:"Ora",target:"Obiettivo",noSlots:"Nessuna fascia: aggiungine una con +",unavailable:"Programma non disponibile",full:"Nessun orario libero"};function z(s){return s.split("-")[0]==="it"?ie:ne}var M=class{constructor(t){this.onReady=t;this.cards=new Map;this.helpers=null;this.loading=!1}get(t,e){let n=JSON.stringify(t),i=this.cards.get(n);if(i!==void 0)return i.hass=e,i;if(this.helpers===null)return this.load(),null;let r=this.helpers.createCardElement(t);return r.hass=e,this.cards.set(n,r),r}load(){this.loading||(this.loading=!0,se().then(t=>{t!==null&&(this.helpers=t,this.onReady())}))}};async function se(){if(window.loadCardHelpers===void 0){if(customElements.get("partial-panel-resolver")===void 0)return null;let s=document.createElement("partial-panel-resolver");s.hass={panels:[{url_path:"estia-lovelace",component_name:"lovelace"}]},s._updateRoutes(),await s.routerOptions.routes["estia-lovelace"].load()}return window.loadCardHelpers===void 0?null:window.loadCardHelpers()}var Rt="estia-panel-period";function re(s,t){for(let e of Object.values(s.states))if(e!==void 0&&e.entity_id.startsWith("sensor.")&&e.attributes.config_entry_id===t&&s.entities[e.entity_id]?.platform==="estia")return e.entity_id;return null}function oe(){try{let s=Number(window.localStorage.getItem(Rt));return s>0?s:24}catch{return 24}}function ae(s){try{window.localStorage.setItem(Rt,String(s))}catch{}}var B=class extends g{constructor(){super();this._card=null;this._entity=null;this._native=new M(()=>this.requestUpdate());this.hass=void 0,this.narrow=!1,this.panel=void 0,this._hours=oe()}_scheduleCard(e){return(this._card===null||this._entity!==e)&&(this._card=document.createElement("estia-card"),this._card.setConfig({type:"custom:estia-card",entity:e}),this._entity=e),this._card.hass=this.hass,this._card}_setPeriod(e){this._hours=e,ae(e)}render(){let e=this.hass;if(e===void 0||this.panel===void 0)return d;let n=z(e.language),i=re(e,this.panel.config.config_entry_id),r=i===null?void 0:e.states[i]?.attributes.climate_entity,o=typeof r=="string"?this._native.get({type:"thermostat",entity:r},e):null,l=typeof r=="string"?this._native.get({type:"history-graph",hours_to_show:this._hours,entities:[{entity:r,name:" "}]},e):null;return p`
      <div class="toolbar">
        <ha-menu-button .hass=${e} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">${this.panel.title??"Estia"}</div>
      </div>
      ${i===null?p`<div class="message">${n.unavailable}</div>`:p`<div class="layout">
            <div class="column">
              ${o===null?d:p`<div class="thermostat">${o}</div>`}
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
              ${l??d}
            </div>
          </div>`}
    `}};B.properties={hass:{attribute:!1},narrow:{attribute:!1},panel:{attribute:!1},_hours:{state:!0}},B.styles=H`
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
  `;customElements.get("estia-panel")===void 0&&customElements.define("estia-panel",B);var Ht=["home","away","preheat","manual","paused","off"];var C=24*60,b=15,_=class extends Error{};function m(s,t){if(!(t in s))throw new _(`missing attribute ${t}`);return s[t]}function E(s,t){if(typeof s!="string")throw new _(`${t} is not a string`);return s}function j(s,t){if(typeof s!="number")throw new _(`${t} is not a number`);return s}function Ot(s,t){return s===null?null:E(s,t)}function Dt(s,t){if(!Array.isArray(s))throw new _(`${t} is not a list`);return s}function Ut(s,t){if(typeof s!="object"||s===null||Array.isArray(s))throw new _(`${t} is not a mapping`);return s}function ut(s){let t=/^(\d{2}):(\d{2})$/.exec(s);if(t===null)throw new _(`bad time ${s}`);return Number(t[1])*60+Number(t[2])}function P(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`}function le(s){if(s==="unknown"||s==="unavailable")return null;let t=Ht.find(e=>e===s);if(t===void 0)throw new _(`unknown mode ${s}`);return t}function Nt(s){let t=s.attributes,e=Dt(m(t,"slots"),"slots").map((o,l)=>{let a=Ut(o,`slot ${l}`);return{id:E(m(a,"id"),"slot id"),start:ut(E(m(a,"start"),"slot start")),setpoint:j(m(a,"setpoint"),"slot setpoint")}}),n=Dt(m(t,"proximity"),"proximity").map((o,l)=>{let a=Ut(o,`proximity ${l}`);return{distance:E(m(a,"distance"),"distance sensor"),direction:E(m(a,"direction"),"direction sensor")}}),i=Ot(m(t,"hold_until"),"hold_until"),r=m(t,"target");return{mode:le(s.state),slots:e.sort((o,l)=>o.start-l.start),activeSlot:Ot(m(t,"active_slot"),"active_slot"),holdUntil:i===null?null:new Date(i),target:r===null?null:j(r,"target"),configEntryId:E(m(t,"config_entry_id"),"config_entry_id"),climate:E(m(t,"climate_entity"),"climate_entity"),proximity:n,setpointMin:j(m(t,"setpoint_min"),"setpoint_min"),setpointMax:j(m(t,"setpoint_max"),"setpoint_max"),setpointStep:j(m(t,"setpoint_step"),"setpoint_step")}}var de=["schedule","preheat","away_setpoint","away_delay","preheat_radius","resume","all_off"];function G(s,t){let e={schedule:null,preheat:null,away_setpoint:null,away_delay:null,preheat_radius:null,resume:null,all_off:null},n=s.entities[t]?.device_id??null;if(n===null)return e;for(let i of Object.values(s.entities)){if(i===void 0||i.platform!=="estia"||i.device_id!==n)continue;let r=de.find(o=>o===i.translation_key);r!==void 0&&(e[r]=i.entity_id)}return e}function It(s){if(s.length===0)return[];let t=[...s].sort((i,r)=>i.start-r.start),e=[],n=t[t.length-1];return t[0].start>0&&e.push({slot:n,from:0,to:t[0].start}),t.forEach((i,r)=>{let o=r+1<t.length?t[r+1].start:C;e.push({slot:i,from:i.start,to:o})}),e.filter(i=>i.to>i.from)}function Lt(s,t){let e=[...s].sort((o,l)=>o.start-l.start),n=e.findIndex(o=>o.id===t);if(n<0)throw new _(`no slot ${t}`);let i=n>0?e[n-1].start+b:0,r=n+1<e.length?e[n+1].start-b:C-b;return{min:i,max:r}}function zt(s,t){let e=Math.round(s/b)*b;return Math.min(t.max,Math.max(t.min,e))}function Bt(s){let t=new Set(s.map(r=>r.start));if(!t.has(12*60))return 12*60;let e=[...t].sort((r,o)=>r-o),n=0,i=null;for(let r=0;r<e.length;r++){let o=e[r],a=(r+1<e.length?e[r+1]:e[0]+C)-o,c=Math.round((o+a/2)/b)*b%C;a>b&&!t.has(c)&&a>n&&(n=a,i=c)}return i}function jt(s,t,e){return`hsl(${(210-210*Math.min(1,Math.max(0,(s-t)/(e-t)))).toFixed(0)}, 70%, 52%)`}function pt(s){return s.getHours()*60+s.getMinutes()}var ce=550,ue=900,pe=10,he=26,W="estia",me={home:"var(--success-color, #43a047)",away:"var(--info-color, #039be5)",preheat:"var(--warning-color, #ffa600)",manual:"var(--accent-color, #ff9800)",paused:"var(--disabled-text-color, #9e9e9e)",off:"var(--secondary-text-color, #727272)"};function ht(s,t){if(s===void 0)return null;let e=s.attributes[t];return typeof e=="number"?e:null}function fe(s,t){if(s===void 0)return null;let e=s.attributes[t];return typeof e=="string"?e:null}function F(s){return`${(s/C*100).toFixed(3)}%`}var q=class extends g{constructor(){super();this._native=new M(()=>this.requestUpdate());this._longPressed=!1;this.hass=void 0,this._config=void 0,this._selected=null,this._drag=null,this._pending=null,this._armedDelete=null,this._error=null}setConfig(e){if(typeof e.entity!="string"||!e.entity.startsWith("sensor."))throw new Error("entity: the Estia mode sensor (sensor.\u2026) is required");this._config=e}getCardSize(){return 6}static getStubConfig(e){let n=Object.values(e.entities).find(i=>i!==void 0&&i.platform===W&&i.entity_id.startsWith("sensor."));return n===void 0?{}:{entity:n.entity_id}}connectedCallback(){super.connectedCallback(),this._clock=window.setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._clock),window.clearTimeout(this._longPress),this._pending!==null&&window.clearTimeout(this._pending.timer)}shouldUpdate(e){return!(this._drag!==null&&e.size===1&&e.has("hass"))}async _call(e,n,i){if(this.hass!==void 0){this._error=null;try{await this.hass.callService(e,n,i)}catch(r){this._error=r instanceof Error?r.message:String(r)}}}_setSlot(e,n,i,r){return this._call(W,"set_slot",{config_entry_id:e.configEntryId,slot_id:n.id,start:P(i),setpoint:r})}_onHandleDown(e,n,i){e.stopPropagation(),e.preventDefault();let r=e.currentTarget.parentElement;if(r===null)return;e.currentTarget.setPointerCapture(e.pointerId);let o=Lt(n.slots,i.id);this._drag={id:i.id,start:i.start,...o,bar:r.getBoundingClientRect()},this._selected=i.id}_onHandleMove(e){let n=this._drag;if(n===null)return;let i=(e.clientX-n.bar.left)/n.bar.width*C,r=zt(i,n);r!==n.start&&(this._drag={...n,start:r})}async _onHandleUp(e){let n=this._drag;if(n===null)return;let i=e.slots.find(r=>r.id===n.id);i!==void 0&&n.start!==i.start&&await this._setSlot(e,i,n.start,i.setpoint),this._drag=null}_onSegmentDown(e){this._longPressed=!1,window.clearTimeout(this._longPress),this._longPress=window.setTimeout(()=>{this._longPressed=!0,this._selected=e.id,this._armedDelete=e.id},ce)}_onSegmentUp(e){window.clearTimeout(this._longPress),!this._longPressed&&(this._armedDelete=null,this._selected=this._selected===e.id?null:e.id)}_shown(e){return this._pending?.id===e.id?this._pending.value:e.setpoint}_setPending(e,n,i){if(!Number.isFinite(i))return;let r=Math.round(i*10)/10,o=Math.min(e.setpointMax,Math.max(e.setpointMin,r));this._pending!==null&&window.clearTimeout(this._pending.timer);let l=window.setTimeout(async()=>{this._pending=null,await this._setSlot(e,n,n.start,o)},ue);this._pending={id:n.id,value:o,timer:l}}_step(e,n,i){this._setPending(e,n,this._shown(n)+i*e.setpointStep)}_onWheel(e,n,i){e.preventDefault(),this._step(n,i,e.deltaY<0?1:-1)}async _onStartInput(e,n,i){let r=e.target.value;r!==""&&await this._setSlot(n,i,ut(r.slice(0,5)),i.setpoint)}async _delete(e,n){if(this._armedDelete!==n.id){this._armedDelete=n.id;return}this._armedDelete=null,this._selected=null,await this._call(W,"remove_slot",{config_entry_id:e.configEntryId,slot_id:n.id})}async _add(e,n){let i=Bt(e.slots);if(i===null){this._error=z(this.hass?.language??"en").full;return}let r=ht(n,"temperature")??e.target??e.setpointMin;await this._call(W,"add_slot",{config_entry_id:e.configEntryId,start:P(i),setpoint:r})}render(){if(this.hass===void 0||this._config===void 0)return d;let e=z(this.hass.language),n=this.hass.states[this._config.entity];if(n===void 0||n.state==="unavailable")return p`<ha-card><div class="message">${e.unavailable}: ${this._config.entity}</div></ha-card>`;let i;try{i=Nt(n)}catch(a){return p`<ha-card><div class="message error">${this._config.entity}: ${String(a)}</div></ha-card>`}let r=this.hass.states[i.climate],o=this._withDrag(i.slots),l=o.find(a=>a.id===this._selected);return p`
      <ha-card>
        ${this._renderHeader(i,r,e)} ${this._renderTimeline(i,o,e)}
        ${l===void 0?d:this._renderEditor(i,l,e)}
        ${this._error===null?d:p`<div class="message error">${this._error}</div>`}
      </ha-card>
      ${this._renderControls(i,e)}
    `}_withDrag(e){let n=this._drag;return n===null?e:e.map(i=>i.id===n.id?{...i,start:n.start}:i)}_renderHeader(e,n,i){let r=this._config?.title??fe(n,"friendly_name")??e.climate,o=ht(n,"current_temperature"),l=ht(n,"temperature"),a=e.mode;return p`
      <div class="header">
        <div class="title">${r}</div>
        ${a===null?d:p`<span class="badge" style="background:${me[a]}">${i.modes[a]}</span>`}
      </div>
      <div class="temps">
        <div><span class="label">${i.current}</span><span class="big">${o===null?"\u2014":`${o.toFixed(1)}\xB0`}</span></div>
        <div><span class="label">${i.target}</span><span class="big">${l===null?"\u2014":`${l.toFixed(1)}\xB0`}</span></div>
      </div>
      ${a==="manual"&&e.holdUntil!==null?p`<div class="hold">
            <span>${i.manualUntil(P(pt(e.holdUntil)))}</span>
            <button
              class="primary"
              @click=${()=>this._call(W,"resume",{config_entry_id:e.configEntryId})}
            >
              ${i.returnToSchedule}
            </button>
          </div>`:d}
      ${a==="paused"?this._notice(i.pausedInfo,i.resumeSchedule,()=>this._resumeSchedule()):d}
      ${a==="off"?this._notice(i.offInfo,i.turnBackOn,()=>this._turnBackOn(e)):d}
    `}_notice(e,n,i){return p`<div class="hold">
      <span>${e}</span>
      <button class="primary" @click=${i}>${n}</button>
    </div>`}async _resumeSchedule(){if(this.hass===void 0||this._config===void 0)return;let e=G(this.hass,this._config.entity).schedule;e!==null&&await this._call("switch","turn_on",{entity_id:e})}async _turnBackOn(e){if(this.hass===void 0||this._config===void 0)return;let n=G(this.hass,this._config.entity).schedule;n!==null&&this.hass.states[n]?.state==="off"?await this._call("switch","turn_on",{entity_id:n}):await this._call("climate","set_hvac_mode",{entity_id:e.climate,hvac_mode:"heat"})}_renderTimeline(e,n,i){let r=pt(new Date),o=Math.min(...n.map(a=>a.setpoint),16),l=Math.max(...n.map(a=>a.setpoint),23);return p`
      <div class="timeline">
        <div class="bar">
          ${n.length===0?p`<div class="empty">${i.noSlots}</div>`:d}
          ${It(n).map(a=>{let c=a.slot,h=c.id===e.activeSlot,u=this._shown(c);return p`<div
              class="segment ${h?"active":""} ${c.id===this._selected?"selected":""}"
              style="left:${F(a.from)};width:${F(a.to-a.from)};background:${jt(u,o,l)}"
              @pointerdown=${()=>this._onSegmentDown(c)}
              @pointerup=${()=>this._onSegmentUp(c)}
              @pointerleave=${()=>window.clearTimeout(this._longPress)}
              @contextmenu=${f=>f.preventDefault()}
            >
              ${a.to-a.from>=100?p`<span>${u.toFixed(1)}°</span>`:d}
            </div>`})}
          ${n.map(a=>p`<div
              class="handle ${this._drag?.id===a.id?"dragging":""}"
              style="left:${F(a.start)}"
              title=${P(a.start)}
              @pointerdown=${c=>this._onHandleDown(c,e,a)}
              @pointermove=${c=>this._onHandleMove(c)}
              @pointerup=${()=>this._onHandleUp(e)}
              @pointercancel=${()=>this._drag=null}
            >
              ${this._drag?.id===a.id?p`<span class="tip">${P(a.start)}</span>`:d}
            </div>`)}
          <div class="now" style="left:${F(r)}"></div>
        </div>
        <div class="ticks">
          ${[0,6,12,18,24].map(a=>p`<span style="left:${F(a*60)}">${a}</span>`)}
        </div>
        <button class="add" title=${i.addSlot} @click=${()=>this._add(e,this.hass?.states[e.climate])}>
          +
        </button>
      </div>
    `}_renderEditor(e,n,i){let r=this._shown(n),o=this._armedDelete===n.id;return p`
      <div class="editor">
        <label>
          <span class="label">${i.start}</span>
          <input
            type="time"
            step="900"
            .value=${P(n.start)}
            @change=${l=>this._onStartInput(l,e,n)}
          />
        </label>
        <div class="setpoint" @wheel=${l=>this._onWheel(l,e,n)}>
          <div class="stepper">
            <span class="label">${i.setpoint}</span>
            <button @click=${()=>this._step(e,n,-1)}>−</button>
            <input
              class="value"
              type="number"
              inputmode="decimal"
              min=${e.setpointMin}
              max=${e.setpointMax}
              step=${e.setpointStep}
              .value=${r.toFixed(1)}
              @change=${l=>this._setPending(e,n,Number(l.target.value))}
            />
            <span class="big">°</span>
            <button @click=${()=>this._step(e,n,1)}>+</button>
          </div>
          <input
            class="slider"
            type="range"
            min=${pe}
            max=${he}
            step=${e.setpointStep}
            .value=${String(r)}
            @input=${l=>this._setPending(e,n,Number(l.target.value))}
          />
        </div>
        <button class="delete ${o?"armed":""}" @click=${()=>this._delete(e,n)}>
          ${o?i.confirmDelete:i.deleteSlot}
        </button>
      </div>
    `}_renderControls(e,n){if(this.hass===void 0||this._config===void 0)return d;let i=G(this.hass,this._config.entity),r=(a,c)=>a===null?[]:[{entity:a,name:c}],o=[...r(i.schedule,n.schedule),...i.all_off===null?[]:[{type:"button",name:n.allOff,icon:"mdi:power",action_name:n.allOffAction,tap_action:{action:"perform-action",perform_action:"button.press",target:{entity_id:i.all_off},confirmation:{text:n.confirmAllOff}}}],{type:"section",label:n.awaySection},...r(i.away_setpoint,n.awaySetpoint),...r(i.away_delay,n.awayDelay),...r(i.preheat,n.preheat),...[...r(i.preheat_radius,n.preheatRadius),...e.proximity.flatMap(a=>[{entity:a.distance},{entity:a.direction}])].map(a=>i.preheat===null?a:{type:"conditional",conditions:[{condition:"state",entity:i.preheat,state:"on"}],row:a})],l=this._native.get({type:"entities",entities:o},this.hass);return l===null?d:p`<div class="controls">${l}</div>`}};q.properties={hass:{attribute:!1},_config:{state:!0},_selected:{state:!0},_drag:{state:!0},_pending:{state:!0},_armedDelete:{state:!0},_error:{state:!0}},q.styles=H`
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
    .temps {
      display: flex;
      gap: 32px;
      margin: 12px 0 16px;
    }
    .temps div {
      display: flex;
      align-items: baseline;
      gap: 8px;
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
      margin-bottom: 16px;
      border-radius: var(--estia-radius);
      background: var(--secondary-background-color);
      font-size: 1.05em;
    }
    .timeline {
      position: relative;
      padding: 24px 60px 4px 0;
    }
    .bar {
      position: relative;
      height: 72px;
      border-radius: 10px;
      background: var(--secondary-background-color);
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
      cursor: pointer;
      opacity: 0.8;
      box-sizing: border-box;
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
  `;customElements.get("estia-card")===void 0&&customElements.define("estia-card",q);window.customCards=window.customCards??[];window.customCards.push({type:"estia-card",name:"Estia",description:"Heating schedule: 24 h timeline with drag-to-edit slots",preview:!1});export{q as EstiaCard};
