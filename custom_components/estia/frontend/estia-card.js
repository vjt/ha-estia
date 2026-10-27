var K=globalThis,Y=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,et=Symbol(),ft=new WeakMap,R=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==et)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Y&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=ft.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&ft.set(e,t))}return t}toString(){return this.cssText}},gt=s=>new R(typeof s=="string"?s:s+"",void 0,et),U=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((n,i,r)=>n+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new R(e,s,et)},_t=(s,t)=>{if(Y)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),i=K.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=e.cssText,s.appendChild(n)}},nt=Y?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return gt(e)})(s):s;var{is:Wt,defineProperty:Ft,getOwnPropertyDescriptor:qt,getOwnPropertyNames:Vt,getOwnPropertySymbols:Kt,getPrototypeOf:Yt}=Object,X=globalThis,yt=X.trustedTypes,Xt=yt?yt.emptyScript:"",Jt=X.reactiveElementPolyfillSupport,D=(s,t)=>s,it={toAttribute(s,t){switch(t){case Boolean:s=s?Xt:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},$t=(s,t)=>!Wt(s,t),vt={attribute:!0,type:String,converter:it,reflect:!1,useDefault:!1,hasChanged:$t};Symbol.metadata??=Symbol("metadata"),X.litPropertyMetadata??=new WeakMap;var v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=vt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(t,n,e);i!==void 0&&Ft(this.prototype,t,i)}}static getPropertyDescriptor(t,e,n){let{get:i,set:r}=qt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let l=i?.call(this);r?.call(this,o),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??vt}static _$Ei(){if(this.hasOwnProperty(D("elementProperties")))return;let t=Yt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(D("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(D("properties"))){let e=this.properties,n=[...Vt(e),...Kt(e)];for(let i of n)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,i]of e)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let i=this._$Eu(e,n);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)e.unshift(nt(i))}else t!==void 0&&e.push(nt(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _t(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(i!==void 0&&n.reflect===!0){let r=(n.converter?.toAttribute!==void 0?n.converter:it).toAttribute(e,n.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let n=this.constructor,i=n._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=n.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:it;this._$Em=i;let l=o.fromAttribute(e,r.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,n,i=!1,r){if(t!==void 0){let o=this.constructor;if(i===!1&&(r=this[t]),n??=o.getPropertyOptions(t),!((n.hasChanged??$t)(r,e)||n.useDefault&&n.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:i,wrapped:r},o){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,r]of n){let{wrapped:o}=r,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,r,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[D("elementProperties")]=new Map,v[D("finalized")]=new Map,Jt?.({ReactiveElement:v}),(X.reactiveElementVersions??=[]).push("2.1.2");var ct=globalThis,bt=s=>s,J=ct.trustedTypes,wt=J?J.createPolicy("lit-html",{createHTML:s=>s}):void 0,Pt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,kt="?"+$,Gt=`<${kt}>`,A=document,N=()=>A.createComment(""),I=s=>s===null||typeof s!="object"&&typeof s!="function",ut=Array.isArray,Zt=s=>ut(s)||typeof s?.[Symbol.iterator]=="function",st=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xt=/-->/g,St=/>/g,x=RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),At=/'/g,Et=/"/g,Tt=/^(?:script|style|textarea|title)$/i,pt=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),p=pt(1),be=pt(2),we=pt(3),E=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Ct=new WeakMap,S=A.createTreeWalker(A,129);function Mt(s,t){if(!ut(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return wt!==void 0?wt.createHTML(t):t}var Qt=(s,t)=>{let e=s.length-1,n=[],i,r=t===2?"<svg>":t===3?"<math>":"",o=O;for(let l=0;l<e;l++){let a=s[l],d,h,u=-1,f=0;for(;f<a.length&&(o.lastIndex=f,h=o.exec(a),h!==null);)f=o.lastIndex,o===O?h[1]==="!--"?o=xt:h[1]!==void 0?o=St:h[2]!==void 0?(Tt.test(h[2])&&(i=RegExp("</"+h[2],"g")),o=x):h[3]!==void 0&&(o=x):o===x?h[0]===">"?(o=i??O,u=-1):h[1]===void 0?u=-2:(u=o.lastIndex-h[2].length,d=h[1],o=h[3]===void 0?x:h[3]==='"'?Et:At):o===Et||o===At?o=x:o===xt||o===St?o=O:(o=x,i=void 0);let g=o===x&&s[l+1].startsWith("/>")?" ":"";r+=o===O?a+Gt:u>=0?(n.push(d),a.slice(0,u)+Pt+a.slice(u)+$+g):a+$+(u===-2?l:g)}return[Mt(s,r+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},z=class s{constructor({strings:t,_$litType$:e},n){let i;this.parts=[];let r=0,o=0,l=t.length-1,a=this.parts,[d,h]=Qt(t,e);if(this.el=s.createElement(d,n),S.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=S.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(Pt)){let f=h[o++],g=i.getAttribute(u).split($),k=/([.?@])?(.*)/.exec(f);a.push({type:1,index:r,name:k[2],strings:g,ctor:k[1]==="."?ot:k[1]==="?"?at:k[1]==="@"?lt:M}),i.removeAttribute(u)}else u.startsWith($)&&(a.push({type:6,index:r}),i.removeAttribute(u));if(Tt.test(i.tagName)){let u=i.textContent.split($),f=u.length-1;if(f>0){i.textContent=J?J.emptyScript:"";for(let g=0;g<f;g++)i.append(u[g],N()),S.nextNode(),a.push({type:2,index:++r});i.append(u[f],N())}}}else if(i.nodeType===8)if(i.data===kt)a.push({type:2,index:r});else{let u=-1;for(;(u=i.data.indexOf($,u+1))!==-1;)a.push({type:7,index:r}),u+=$.length-1}r++}}static createElement(t,e){let n=A.createElement("template");return n.innerHTML=t,n}};function T(s,t,e=s,n){if(t===E)return t;let i=n!==void 0?e._$Co?.[n]:e._$Cl,r=I(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,e,n)),n!==void 0?(e._$Co??=[])[n]=i:e._$Cl=i),i!==void 0&&(t=T(s,i._$AS(s,t.values),i,n)),t}var rt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,i=(t?.creationScope??A).importNode(e,!0);S.currentNode=i;let r=S.nextNode(),o=0,l=0,a=n[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new L(r,r.nextSibling,this,t):a.type===1?d=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(d=new dt(r,this,t)),this._$AV.push(d),a=n[++l]}o!==a?.index&&(r=S.nextNode(),o++)}return S.currentNode=A,i}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},L=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=T(this,t,e),I(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==E&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Zt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=z.createElement(Mt(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new rt(i,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=Ct.get(t.strings);return e===void 0&&Ct.set(t.strings,e=new z(t)),e}k(t){ut(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,i=0;for(let r of t)i===e.length?e.push(n=new s(this.O(N()),this.O(N()),this,this.options)):n=e[i],n._$AI(r),i++;i<e.length&&(this._$AR(n&&n._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=bt(t).nextSibling;bt(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,i,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=c}_$AI(t,e=this,n,i){let r=this.strings,o=!1;if(r===void 0)t=T(this,t,e,0),o=!I(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{let l=t,a,d;for(t=r[0],a=0;a<r.length-1;a++)d=T(this,l[n+a],e,a),d===E&&(d=this._$AH[a]),o||=!I(d)||d!==this._$AH[a],d===c?t=c:t!==c&&(t+=(d??"")+r[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ot=class extends M{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},at=class extends M{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},lt=class extends M{constructor(t,e,n,i,r){super(t,e,n,i,r),this.type=5}_$AI(t,e=this){if((t=T(this,t,e,0)??c)===E)return;let n=this._$AH,i=t===c&&n!==c||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==c&&(n===c||i);i&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},dt=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){T(this,t)}};var te=ct.litHtmlPolyfillSupport;te?.(z,L),(ct.litHtmlVersions??=[]).push("3.3.3");var Ht=(s,t,e)=>{let n=e?.renderBefore??t,i=n._$litPart$;if(i===void 0){let r=e?.renderBefore??null;n._$litPart$=i=new L(t.insertBefore(N(),r),r,void 0,e??{})}return i._$AI(s),i};var ht=globalThis,_=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ht(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};_._$litElement$=!0,_.finalized=!0,ht.litElementHydrateSupport?.({LitElement:_});var ee=ht.litElementPolyfillSupport;ee?.({LitElement:_});(ht.litElementVersions??=[]).push("4.2.2");var ne={modes:{home:"Home",away:"Away",preheat:"Preheat",manual:"Manual",boost:"Boost",paused:"Manual (no expiry)",off:"Off"},directions:{towards:"heading home",away_from:"moving away",stationary:"not moving",arrived:"arrived"},travellerHome:s=>`${s} is home`,travellerAway:(s,t,e)=>`${s} is ${t} away, ${e}`,travellerUnknown:s=>`${s}: position unknown`,manualUntil:s=>`Manual until ${s}`,returnToSchedule:"Return to schedule",schedule:"Schedule",allOff:"All off",pausedInfo:"Schedule off: Estia leaves the thermostat alone and keeps the temperature you set, with no end. Slots, away and preheat are ignored until you choose Scheduled again.",offInfo:"Heating off: the thermostat is off and Estia does not touch it.",scheduled:"Scheduled",boost:"Boost",boostUntil:s=>`Boost: maximum until ${s}, then back to before`,settings:"Schedule",edit:"Edit",done:"Done",awaySummary:(s,t)=>`Away: ${s} \xB0C after ${t} min with nobody home`,preheatSummary:s=>`Preheat: within ${s} km when someone is heading home`,preheatOff:"Preheat off",history:"Temperature",periods:[{hours:24,label:"24 hours"},{hours:168,label:"7 days"},{hours:720,label:"30 days"}],preheat:"Preheat on the way home",awaySetpoint:"Away setpoint",awayDelay:"Away delay",preheatRadius:"Preheat radius",addSlot:"Add slot",deleteSlot:"Delete slot",confirmDelete:"Tap again to delete",start:"Start",setpoint:"Setpoint",noSlots:"No slots: add one with +",unavailable:"Schedule unavailable",full:"No free start time left"},ie={modes:{home:"In casa",away:"Fuori casa",preheat:"Preriscaldo",manual:"Manuale",boost:"Massimo",paused:"Manuale (senza scadenza)",off:"Spento"},directions:{towards:"sta tornando",away_from:"si allontana",stationary:"non si muove",arrived:"arrivato"},travellerHome:s=>`${s} \xE8 a casa`,travellerAway:(s,t,e)=>`${s} \xE8 a ${t}, ${e}`,travellerUnknown:s=>`${s}: posizione sconosciuta`,manualUntil:s=>`Manuale fino alle ${s}`,returnToSchedule:"Ritorna al programma",schedule:"Programma",allOff:"Spegni tutto",pausedInfo:"Programma spento: Estia non tocca il termostato e tiene la temperatura che hai impostato, senza scadenza. Fasce, fuori casa e preriscaldo sono ignorati finch\xE9 non scegli di nuovo Pianificato.",offInfo:"Riscaldamento spento: il termostato \xE8 spento ed Estia non lo tocca.",scheduled:"Pianificato",boost:"Massimo",boostUntil:s=>`Massimo fino alle ${s}, poi torna com'era`,settings:"Programma",edit:"Modifica",done:"Fatto",awaySummary:(s,t)=>`Fuori casa: ${s} \xB0C dopo ${t} min senza nessuno`,preheatSummary:s=>`Preriscaldo: entro ${s} km se qualcuno sta tornando`,preheatOff:"Preriscaldo spento",history:"Temperatura",periods:[{hours:24,label:"24 ore"},{hours:168,label:"7 giorni"},{hours:720,label:"30 giorni"}],preheat:"Preriscaldo al rientro",awaySetpoint:"Temperatura fuori casa",awayDelay:"Ritardo fuori casa",preheatRadius:"Raggio preriscaldo",addSlot:"Aggiungi fascia",deleteSlot:"Elimina fascia",confirmDelete:"Tocca ancora per eliminare",start:"Inizio",setpoint:"Temperatura",noSlots:"Nessuna fascia: aggiungine una con +",unavailable:"Programma non disponibile",full:"Nessun orario libero"};function j(s){return s.split("-")[0]==="it"?ie:ne}var H=class{constructor(t){this.onReady=t;this.cards=new Map;this.helpers=null;this.loading=!1}get(t,e){let n=JSON.stringify(t),i=this.cards.get(n);if(i!==void 0)return i.hass=e,i;if(this.helpers===null)return this.load(),null;let r=this.helpers.createCardElement(t);return r.hass=e,this.cards.set(n,r),r}load(){this.loading||(this.loading=!0,se().then(t=>{t!==null&&(this.helpers=t,this.onReady())}))}};async function se(){if(window.loadCardHelpers===void 0){if(customElements.get("partial-panel-resolver")===void 0)return null;let s=document.createElement("partial-panel-resolver");s.hass={panels:[{url_path:"estia-lovelace",component_name:"lovelace"}]},s._updateRoutes(),await s.routerOptions.routes["estia-lovelace"].load()}return window.loadCardHelpers===void 0?null:window.loadCardHelpers()}var Rt="estia-panel-period";function re(s,t){for(let e of Object.values(s.states))if(e!==void 0&&e.entity_id.startsWith("sensor.")&&e.attributes.config_entry_id===t&&s.entities[e.entity_id]?.platform==="estia")return e.entity_id;return null}function oe(){try{let s=Number(window.localStorage.getItem(Rt));return s>0?s:24}catch{return 24}}function ae(s){try{window.localStorage.setItem(Rt,String(s))}catch{}}var B=class extends _{constructor(){super();this._card=null;this._entity=null;this._native=new H(()=>this.requestUpdate());this.hass=void 0,this.narrow=!1,this.panel=void 0,this._hours=oe()}_scheduleCard(e){return(this._card===null||this._entity!==e)&&(this._card=document.createElement("estia-card"),this._card.setConfig({type:"custom:estia-card",entity:e}),this._entity=e),this._card.hass=this.hass,this._card}_setPeriod(e){this._hours=e,ae(e)}render(){let e=this.hass;if(e===void 0||this.panel===void 0)return c;let n=j(e.language),i=re(e,this.panel.config.config_entry_id),r=i===null?void 0:e.states[i]?.attributes.climate_entity,o=typeof r=="string"?this._native.get({type:"thermostat",entity:r},e):null,l=typeof r=="string"?this._native.get({type:"history-graph",hours_to_show:this._hours,entities:[{entity:r,name:" "}]},e):null;return p`
      <div class="toolbar">
        <ha-menu-button .hass=${e} .narrow=${this.narrow}></ha-menu-button>
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
              ${l??c}
            </div>
          </div>`}
    `}};B.properties={hass:{attribute:!1},narrow:{attribute:!1},panel:{attribute:!1},_hours:{state:!0}},B.styles=U`
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
  `;customElements.get("estia-panel")===void 0&&customElements.define("estia-panel",B);var Ut=["home","away","preheat","manual","boost","paused","off"];var P=24*60,b=15,y=class extends Error{};function m(s,t){if(!(t in s))throw new y(`missing attribute ${t}`);return s[t]}function C(s,t){if(typeof s!="string")throw new y(`${t} is not a string`);return s}function W(s,t){if(typeof s!="number")throw new y(`${t} is not a number`);return s}function G(s,t){return s===null?null:C(s,t)}function Dt(s,t){if(!Array.isArray(s))throw new y(`${t} is not a list`);return s}function Ot(s,t){if(typeof s!="object"||s===null||Array.isArray(s))throw new y(`${t} is not a mapping`);return s}function mt(s){let t=/^(\d{2}):(\d{2})$/.exec(s);if(t===null)throw new y(`bad time ${s}`);return Number(t[1])*60+Number(t[2])}function w(s){let t=Math.floor(s/60)%24,e=s%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`}function le(s){if(s==="unknown"||s==="unavailable")return null;let t=Ut.find(e=>e===s);if(t===void 0)throw new y(`unknown mode ${s}`);return t}function Nt(s){let t=s.attributes,e=Dt(m(t,"slots"),"slots").map((l,a)=>{let d=Ot(l,`slot ${a}`);return{id:C(m(d,"id"),"slot id"),start:mt(C(m(d,"start"),"slot start")),setpoint:W(m(d,"setpoint"),"slot setpoint")}}),n=Dt(m(t,"proximity"),"proximity").map((l,a)=>{let d=Ot(l,`proximity ${a}`);return{distance:C(m(d,"distance"),"distance sensor"),direction:C(m(d,"direction"),"direction sensor"),person:G(m(d,"person"),"tracked person")}}),i=G(m(t,"hold_until"),"hold_until"),r=G(m(t,"boost_until"),"boost_until"),o=m(t,"target");return{mode:le(s.state),slots:e.sort((l,a)=>l.start-a.start),activeSlot:G(m(t,"active_slot"),"active_slot"),holdUntil:i===null?null:new Date(i),boostUntil:r===null?null:new Date(r),target:o===null?null:W(o,"target"),configEntryId:C(m(t,"config_entry_id"),"config_entry_id"),climate:C(m(t,"climate_entity"),"climate_entity"),proximity:n,setpointMin:W(m(t,"setpoint_min"),"setpoint_min"),setpointMax:W(m(t,"setpoint_max"),"setpoint_max"),setpointStep:W(m(t,"setpoint_step"),"setpoint_step")}}var de=["schedule","boost","preheat","away_setpoint","away_delay","preheat_radius","resume","all_off"];function Z(s,t){let e={schedule:null,boost:null,preheat:null,away_setpoint:null,away_delay:null,preheat_radius:null,resume:null,all_off:null},n=s.entities[t]?.device_id??null;if(n===null)return e;for(let i of Object.values(s.entities)){if(i===void 0||i.platform!=="estia"||i.device_id!==n)continue;let r=de.find(o=>o===i.translation_key);r!==void 0&&(e[r]=i.entity_id)}return e}function It(s){if(s.length===0)return[];let t=[...s].sort((i,r)=>i.start-r.start),e=[],n=t[t.length-1];return t[0].start>0&&e.push({slot:n,from:0,to:t[0].start}),t.forEach((i,r)=>{let o=r+1<t.length?t[r+1].start:P;e.push({slot:i,from:i.start,to:o})}),e.filter(i=>i.to>i.from)}function zt(s,t){let e=[...s].sort((o,l)=>o.start-l.start),n=e.findIndex(o=>o.id===t);if(n<0)throw new y(`no slot ${t}`);let i=n>0?e[n-1].start+b:0,r=n+1<e.length?e[n+1].start-b:P-b;return{min:i,max:r}}function Lt(s,t){let e=Math.round(s/b)*b;return Math.min(t.max,Math.max(t.min,e))}function jt(s){let t=new Set(s.map(r=>r.start));if(!t.has(12*60))return 12*60;let e=[...t].sort((r,o)=>r-o),n=0,i=null;for(let r=0;r<e.length;r++){let o=e[r],a=(r+1<e.length?e[r+1]:e[0]+P)-o,d=Math.round((o+a/2)/b)*b%P;a>b&&!t.has(d)&&a>n&&(n=a,i=d)}return i}function Bt(s,t,e){return`hsl(${(210-210*Math.min(1,Math.max(0,(s-t)/(e-t)))).toFixed(0)}, 70%, 52%)`}function Q(s){return s.getHours()*60+s.getMinutes()}var ce=550,ue=900,pe=10,he=26,F="estia",me={home:"var(--success-color, #43a047)",away:"var(--info-color, #039be5)",preheat:"var(--warning-color, #ffa600)",manual:"var(--accent-color, #ff9800)",boost:"var(--error-color, #db4437)",paused:"var(--disabled-text-color, #9e9e9e)",off:"var(--secondary-text-color, #727272)"};function fe(s,t){if(s===void 0)return null;let e=s.attributes[t];return typeof e=="number"?e:null}function tt(s,t){if(s===void 0)return null;let e=s.attributes[t];return typeof e=="string"?e:null}function ge(s){if(s===void 0)return null;let t=Number(s.state);if(s.state===""||!Number.isFinite(t))return null;let e={m:1,km:1e3,mi:1609.344,ft:.3048,yd:.9144},n=tt(s,"unit_of_measurement");return n===null||!(n in e)?null:t*e[n]}function q(s){return`${(s/P*100).toFixed(3)}%`}var V=class extends _{constructor(){super();this._native=new H(()=>this.requestUpdate());this._longPressed=!1;this.hass=void 0,this._config=void 0,this._selected=null,this._drag=null,this._pending=null,this._armedDelete=null,this._error=null,this._editing=!1}setConfig(e){if(typeof e.entity!="string"||!e.entity.startsWith("sensor."))throw new Error("entity: the Estia mode sensor (sensor.\u2026) is required");this._config=e}getCardSize(){return 6}static getStubConfig(e){let n=Object.values(e.entities).find(i=>i!==void 0&&i.platform===F&&i.entity_id.startsWith("sensor."));return n===void 0?{}:{entity:n.entity_id}}connectedCallback(){super.connectedCallback(),this._clock=window.setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._clock),window.clearTimeout(this._longPress),this._pending!==null&&window.clearTimeout(this._pending.timer)}shouldUpdate(e){return!(this._drag!==null&&e.size===1&&e.has("hass"))}async _call(e,n,i){if(this.hass!==void 0){this._error=null;try{await this.hass.callService(e,n,i)}catch(r){this._error=r instanceof Error?r.message:String(r)}}}_setSlot(e,n,i,r){return this._call(F,"set_slot",{config_entry_id:e.configEntryId,slot_id:n.id,start:w(i),setpoint:r})}_onHandleDown(e,n,i){e.stopPropagation(),e.preventDefault();let r=e.currentTarget.parentElement;if(r===null)return;e.currentTarget.setPointerCapture(e.pointerId);let o=zt(n.slots,i.id);this._drag={id:i.id,start:i.start,...o,bar:r.getBoundingClientRect()},this._selected=i.id}_onHandleMove(e){let n=this._drag;if(n===null)return;let i=(e.clientX-n.bar.left)/n.bar.width*P,r=Lt(i,n);r!==n.start&&(this._drag={...n,start:r})}async _onHandleUp(e){let n=this._drag;if(n===null)return;let i=e.slots.find(r=>r.id===n.id);i!==void 0&&n.start!==i.start&&await this._setSlot(e,i,n.start,i.setpoint),this._drag=null}_onSegmentDown(e){this._longPressed=!1,window.clearTimeout(this._longPress),this._longPress=window.setTimeout(()=>{this._longPressed=!0,this._selected=e.id,this._armedDelete=e.id},ce)}_onSegmentUp(e){window.clearTimeout(this._longPress),!this._longPressed&&(this._armedDelete=null,this._selected=this._selected===e.id?null:e.id)}_shown(e){return this._pending?.id===e.id?this._pending.value:e.setpoint}_setPending(e,n,i){if(!Number.isFinite(i))return;let r=Math.round(i*10)/10,o=Math.min(e.setpointMax,Math.max(e.setpointMin,r));this._pending!==null&&window.clearTimeout(this._pending.timer);let l=window.setTimeout(async()=>{this._pending=null,await this._setSlot(e,n,n.start,o)},ue);this._pending={id:n.id,value:o,timer:l}}_step(e,n,i){this._setPending(e,n,this._shown(n)+i*e.setpointStep)}_onWheel(e,n,i){e.preventDefault(),this._step(n,i,e.deltaY<0?1:-1)}async _onStartInput(e,n,i){let r=e.target.value;r!==""&&await this._setSlot(n,i,mt(r.slice(0,5)),i.setpoint)}async _delete(e,n){if(this._armedDelete!==n.id){this._armedDelete=n.id;return}this._armedDelete=null,this._selected=null,await this._call(F,"remove_slot",{config_entry_id:e.configEntryId,slot_id:n.id})}async _add(e,n){let i=jt(e.slots);if(i===null){this._error=j(this.hass?.language??"en").full;return}let r=fe(n,"temperature")??e.target??e.setpointMin;await this._call(F,"add_slot",{config_entry_id:e.configEntryId,start:w(i),setpoint:r})}render(){if(this.hass===void 0||this._config===void 0)return c;let e=j(this.hass.language),n=this.hass.states[this._config.entity];if(n===void 0||n.state==="unavailable")return p`<ha-card><div class="message">${e.unavailable}: ${this._config.entity}</div></ha-card>`;let i;try{i=Nt(n)}catch(a){return p`<ha-card><div class="message error">${this._config.entity}: ${String(a)}</div></ha-card>`}let r=this.hass.states[i.climate],o=this._withDrag(i.slots),l=this._editing?o.find(a=>a.id===this._selected):void 0;return p`
      <ha-card>
        ${this._renderHeader(i,r,e)} ${this._renderActions(i,e)}
        ${this._error===null?c:p`<div class="message error">${this._error}</div>`}
      </ha-card>
      <ha-card>
        <div class="settings-head">
          <span class="section">${e.settings}</span>
          <button class=${this._editing?"primary":""} @click=${()=>this._toggleEditing()}>
            ${this._editing?e.done:e.edit}
          </button>
        </div>
        ${this._renderTimeline(i,o,e)}
        ${l===void 0?c:this._renderEditor(i,l,e)}
        ${this._editing?c:this._renderSummary(i,e)}
      </ha-card>
      ${this._editing?this._renderControls(e):c}
    `}_toggleEditing(){this._editing=!this._editing,this._selected=null,this._armedDelete=null}_withDrag(e){let n=this._drag;return n===null?e:e.map(i=>i.id===n.id?{...i,start:n.start}:i)}_renderHeader(e,n,i){let r=this._config?.title??tt(n,"friendly_name")??e.climate,o=e.mode;return p`
      <div class="header">
        <div class="title">${r}</div>
        ${o===null?c:p`<span class="badge" style="background:${me[o]}">${i.modes[o]}</span>`}
      </div>
      ${o==="boost"&&e.boostUntil!==null?p`<div class="hold"><span>${i.boostUntil(w(Q(e.boostUntil)))}</span></div>`:c}
      ${o==="manual"&&e.holdUntil!==null?p`<div class="hold">
            <span>${i.manualUntil(w(Q(e.holdUntil)))}</span>
            <button
              class="primary"
              @click=${()=>this._call(F,"resume",{config_entry_id:e.configEntryId})}
            >
              ${i.returnToSchedule}
            </button>
          </div>`:c}
      ${o==="paused"?p`<div class="hold"><span>${i.pausedInfo}</span></div>`:c}
      ${o==="off"?p`<div class="hold"><span>${i.offInfo}</span></div>`:c}
    `}_renderActions(e,n){if(this.hass===void 0||this._config===void 0)return c;let i=Z(this.hass,this._config.entity),r=e.mode,l=i.schedule!==null&&this.hass.states[i.schedule]?.state==="on"&&r!=="boost"&&r!=="off",a=r==="boost",d=r==="off",h=(u,f,g,k)=>p`<button class="action ${u?"active":""}" @click=${k}>
      <ha-icon .icon=${f}></ha-icon><span>${g}</span>
    </button>`;return p`<div class="actions">
      ${h(l,"mdi:calendar-clock",n.scheduled,async()=>{i.schedule!==null&&await this._call("switch",l?"turn_off":"turn_on",{entity_id:i.schedule})})}
      ${h(a,"mdi:fire",n.boost,async()=>{i.boost!==null&&await this._call("switch",a?"turn_off":"turn_on",{entity_id:i.boost})})}
      ${h(d,"mdi:power",n.allOff,async()=>{i.all_off===null||d||await this._call("button","press",{entity_id:i.all_off})})}
    </div>`}_renderTraveller(e,n){let i=this.hass;if(i===void 0)return c;let r=e.person===null?void 0:i.states[e.person],o=i.states[e.distance],l=i.states[e.direction]?.state,a=tt(r,"friendly_name")??tt(o,"friendly_name")??e.distance,d=ge(o),h,u;if(r?.state==="home"||l==="arrived"||d===0)h="\u{1F3E0}",u=n.travellerHome(a);else if(d===null)h="\u2754",u=n.travellerUnknown(a);else{h=l==="towards"?"\u{1F697}":l==="away_from"?"\u{1F3C3}":"\u{1F4CD}";let f=new Intl.NumberFormat(i.language,{maximumFractionDigits:1}).format(d/1e3),g=l===void 0?"":n.directions[l]??l;u=n.travellerAway(a,`${f} km`,g)}return p`<div class="traveller"><span class="emoji">${h}</span><span>${u}</span></div>`}_renderSummary(e,n){if(this.hass===void 0||this._config===void 0)return c;let i=this.hass,r=Z(i,this._config.entity),o=a=>a===null?"\u2014":i.states[a]?.state??"\u2014",l=r.preheat!==null&&i.states[r.preheat]?.state==="on";return p`<div class="summary">
      <div>${n.awaySummary(o(r.away_setpoint),o(r.away_delay))}</div>
      <div>${l?n.preheatSummary(o(r.preheat_radius)):n.preheatOff}</div>
      ${l?e.proximity.map(a=>this._renderTraveller(a,n)):c}
    </div>`}_renderTimeline(e,n,i){let r=Q(new Date),o=Math.min(...n.map(a=>a.setpoint),16),l=Math.max(...n.map(a=>a.setpoint),23);return p`
      <div class="timeline ${this._editing?"editing":""}">
        <div class="bar">
          ${n.length===0?p`<div class="empty">${i.noSlots}</div>`:c}
          ${It(n).map(a=>{let d=a.slot,h=d.id===e.activeSlot,u=this._shown(d);return p`<div
              class="segment ${h?"active":""} ${d.id===this._selected?"selected":""}"
              style="left:${q(a.from)};width:${q(a.to-a.from)};background:${Bt(u,o,l)}"
              @pointerdown=${()=>this._editing&&this._onSegmentDown(d)}
              @pointerup=${()=>this._editing&&this._onSegmentUp(d)}
              @pointerleave=${()=>window.clearTimeout(this._longPress)}
              @contextmenu=${f=>f.preventDefault()}
            >
              ${a.to-a.from>=100?p`<span>${u.toFixed(1)}°</span>`:c}
            </div>`})}
          ${(this._editing?n:[]).map(a=>p`<div
              class="handle ${this._drag?.id===a.id?"dragging":""}"
              style="left:${q(a.start)}"
              title=${w(a.start)}
              @pointerdown=${d=>this._onHandleDown(d,e,a)}
              @pointermove=${d=>this._onHandleMove(d)}
              @pointerup=${()=>this._onHandleUp(e)}
              @pointercancel=${()=>this._drag=null}
            >
              ${this._drag?.id===a.id?p`<span class="tip">${w(a.start)}</span>`:c}
            </div>`)}
          <div class="now" style="left:${q(r)}"></div>
        </div>
        <div class="ticks">
          ${[0,6,12,18,24].map(a=>p`<span style="left:${q(a*60)}">${a}</span>`)}
        </div>
        ${this._editing?p`<button
              class="add"
              title=${i.addSlot}
              @click=${()=>this._add(e,this.hass?.states[e.climate])}
            >
              +
            </button>`:c}
      </div>
    `}_renderEditor(e,n,i){let r=this._shown(n),o=this._armedDelete===n.id;return p`
      <div class="editor">
        <label>
          <span class="label">${i.start}</span>
          <input
            type="time"
            step="900"
            .value=${w(n.start)}
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
    `}_renderControls(e){if(this.hass===void 0||this._config===void 0)return c;let n=Z(this.hass,this._config.entity),i=(l,a)=>l===null?[]:[{entity:l,name:a}],r=[...i(n.away_setpoint,e.awaySetpoint),...i(n.away_delay,e.awayDelay),...i(n.preheat,e.preheat),...i(n.preheat_radius,e.preheatRadius).map(l=>n.preheat===null?l:{type:"conditional",conditions:[{condition:"state",entity:n.preheat,state:"on"}],row:l})],o=this._native.get({type:"entities",entities:r},this.hass);return o===null?c:p`<div class="controls">${o}</div>`}};V.properties={hass:{attribute:!1},_config:{state:!0},_selected:{state:!0},_drag:{state:!0},_pending:{state:!0},_armedDelete:{state:!0},_error:{state:!0},_editing:{state:!0}},V.styles=U`
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
  `;customElements.get("estia-card")===void 0&&customElements.define("estia-card",V);window.customCards=window.customCards??[];window.customCards.push({type:"estia-card",name:"Estia",description:"Heating schedule: 24 h timeline with drag-to-edit slots",preview:!1});export{V as EstiaCard};
