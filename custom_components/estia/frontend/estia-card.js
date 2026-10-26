var K=globalThis,Y=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Z=Symbol(),ht=new WeakMap,R=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Y&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=ht.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&ht.set(e,t))}return t}toString(){return this.cssText}},gt=i=>new R(typeof i=="string"?i:i+"",void 0,Z),H=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((n,s,r)=>n+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[r+1],i[0]);return new R(e,i,Z)},mt=(i,t)=>{if(Y)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),s=K.litNonce;s!==void 0&&n.setAttribute("nonce",s),n.textContent=e.cssText,i.appendChild(n)}},Q=Y?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return gt(e)})(i):i;var{is:Bt,defineProperty:Wt,getOwnPropertyDescriptor:Ft,getOwnPropertyNames:Vt,getOwnPropertySymbols:qt,getPrototypeOf:Kt}=Object,X=globalThis,ft=X.trustedTypes,Yt=ft?ft.emptyScript:"",Xt=X.reactiveElementPolyfillSupport,D=(i,t)=>i,tt={toAttribute(i,t){switch(t){case Boolean:i=i?Yt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},yt=(i,t)=>!Bt(i,t),_t={attribute:!0,type:String,converter:tt,reflect:!1,useDefault:!1,hasChanged:yt};Symbol.metadata??=Symbol("metadata"),X.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_t){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),s=this.getPropertyDescriptor(t,n,e);s!==void 0&&Wt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,n){let{get:s,set:r}=Ft(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let l=s?.call(this);r?.call(this,o),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_t}static _$Ei(){if(this.hasOwnProperty(D("elementProperties")))return;let t=Kt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(D("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(D("properties"))){let e=this.properties,n=[...Vt(e),...qt(e)];for(let s of n)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,s]of e)this.elementProperties.set(n,s)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let s=this._$Eu(e,n);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let s of n)e.unshift(Q(s))}else t!==void 0&&e.push(Q(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return mt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,n);if(s!==void 0&&n.reflect===!0){let r=(n.converter?.toAttribute!==void 0?n.converter:tt).toAttribute(e,n.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){let n=this.constructor,s=n._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let r=n.getPropertyOptions(s),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:tt;this._$Em=s;let l=o.fromAttribute(e,r.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,n,s=!1,r){if(t!==void 0){let o=this.constructor;if(s===!1&&(r=this[t]),n??=o.getPropertyOptions(t),!((n.hasChanged??yt)(r,e)||n.useDefault&&n.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:s,wrapped:r},o){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[s,r]of n){let{wrapped:o}=r,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,r,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[D("elementProperties")]=new Map,y[D("finalized")]=new Map,Xt?.({ReactiveElement:y}),(X.reactiveElementVersions??=[]).push("2.1.2");var at=globalThis,$t=i=>i,G=at.trustedTypes,vt=G?G.createPolicy("lit-html",{createHTML:i=>i}):void 0,Et="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,Ct="?"+v,Gt=`<${Ct}>`,w=document,N=()=>w.createComment(""),O=i=>i===null||typeof i!="object"&&typeof i!="function",lt=Array.isArray,Jt=i=>lt(i)||typeof i?.[Symbol.iterator]=="function",et=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bt=/-->/g,xt=/>/g,x=RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),St=/'/g,wt=/"/g,Tt=/^(?:script|style|textarea|title)$/i,dt=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),u=dt(1),he=dt(2),ge=dt(3),A=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),At=new WeakMap,S=w.createTreeWalker(w,129);function Pt(i,t){if(!lt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return vt!==void 0?vt.createHTML(t):t}var Zt=(i,t)=>{let e=i.length-1,n=[],s,r=t===2?"<svg>":t===3?"<math>":"",o=U;for(let l=0;l<e;l++){let a=i[l],d,h,p=-1,m=0;for(;m<a.length&&(o.lastIndex=m,h=o.exec(a),h!==null);)m=o.lastIndex,o===U?h[1]==="!--"?o=bt:h[1]!==void 0?o=xt:h[2]!==void 0?(Tt.test(h[2])&&(s=RegExp("</"+h[2],"g")),o=x):h[3]!==void 0&&(o=x):o===x?h[0]===">"?(o=s??U,p=-1):h[1]===void 0?p=-2:(p=o.lastIndex-h[2].length,d=h[1],o=h[3]===void 0?x:h[3]==='"'?wt:St):o===wt||o===St?o=x:o===bt||o===xt?o=U:(o=x,s=void 0);let $=o===x&&i[l+1].startsWith("/>")?" ":"";r+=o===U?a+Gt:p>=0?(n.push(d),a.slice(0,p)+Et+a.slice(p)+v+$):a+v+(p===-2?l:$)}return[Pt(i,r+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},z=class i{constructor({strings:t,_$litType$:e},n){let s;this.parts=[];let r=0,o=0,l=t.length-1,a=this.parts,[d,h]=Zt(t,e);if(this.el=i.createElement(d,n),S.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=S.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let p of s.getAttributeNames())if(p.endsWith(Et)){let m=h[o++],$=s.getAttribute(p).split(v),q=/([.?@])?(.*)/.exec(m);a.push({type:1,index:r,name:q[2],strings:$,ctor:q[1]==="."?st:q[1]==="?"?it:q[1]==="@"?rt:M}),s.removeAttribute(p)}else p.startsWith(v)&&(a.push({type:6,index:r}),s.removeAttribute(p));if(Tt.test(s.tagName)){let p=s.textContent.split(v),m=p.length-1;if(m>0){s.textContent=G?G.emptyScript:"";for(let $=0;$<m;$++)s.append(p[$],N()),S.nextNode(),a.push({type:2,index:++r});s.append(p[m],N())}}}else if(s.nodeType===8)if(s.data===Ct)a.push({type:2,index:r});else{let p=-1;for(;(p=s.data.indexOf(v,p+1))!==-1;)a.push({type:7,index:r}),p+=v.length-1}r++}}static createElement(t,e){let n=w.createElement("template");return n.innerHTML=t,n}};function P(i,t,e=i,n){if(t===A)return t;let s=n!==void 0?e._$Co?.[n]:e._$Cl,r=O(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(i),s._$AT(i,e,n)),n!==void 0?(e._$Co??=[])[n]=s:e._$Cl=s),s!==void 0&&(t=P(i,s._$AS(i,t.values),s,n)),t}var nt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,s=(t?.creationScope??w).importNode(e,!0);S.currentNode=s;let r=S.nextNode(),o=0,l=0,a=n[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new I(r,r.nextSibling,this,t):a.type===1?d=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(d=new ot(r,this,t)),this._$AV.push(d),a=n[++l]}o!==a?.index&&(r=S.nextNode(),o++)}return S.currentNode=w,s}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},I=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=P(this,t,e),O(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Jt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,s=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=z.createElement(Pt(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===s)this._$AH.p(e);else{let r=new nt(s,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=At.get(t.strings);return e===void 0&&At.set(t.strings,e=new z(t)),e}k(t){lt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,s=0;for(let r of t)s===e.length?e.push(n=new i(this.O(N()),this.O(N()),this,this.options)):n=e[s],n._$AI(r),s++;s<e.length&&(this._$AR(n&&n._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=$t(t).nextSibling;$t(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,s,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=c}_$AI(t,e=this,n,s){let r=this.strings,o=!1;if(r===void 0)t=P(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==A,o&&(this._$AH=t);else{let l=t,a,d;for(t=r[0],a=0;a<r.length-1;a++)d=P(this,l[n+a],e,a),d===A&&(d=this._$AH[a]),o||=!O(d)||d!==this._$AH[a],d===c?t=c:t!==c&&(t+=(d??"")+r[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},st=class extends M{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},it=class extends M{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},rt=class extends M{constructor(t,e,n,s,r){super(t,e,n,s,r),this.type=5}_$AI(t,e=this){if((t=P(this,t,e,0)??c)===A)return;let n=this._$AH,s=t===c&&n!==c||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==c&&(n===c||s);s&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ot=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}};var Qt=at.litHtmlPolyfillSupport;Qt?.(z,I),(at.litHtmlVersions??=[]).push("3.3.3");var Mt=(i,t,e)=>{let n=e?.renderBefore??t,s=n._$litPart$;if(s===void 0){let r=e?.renderBefore??null;n._$litPart$=s=new I(t.insertBefore(N(),r),r,void 0,e??{})}return s._$AI(i),s};var ct=globalThis,f=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Mt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};f._$litElement$=!0,f.finalized=!0,ct.litElementHydrateSupport?.({LitElement:f});var te=ct.litElementPolyfillSupport;te?.({LitElement:f});(ct.litElementVersions??=[]).push("4.2.2");var ee={modes:{home:"Home",away:"Away",preheat:"Preheat",manual:"Manual",paused:"Paused",off:"Off"},directions:{towards:"heading home",away_from:"moving away",stationary:"stationary",arrived:"arrived"},manualUntil:i=>`Manual until ${i}`,returnToSchedule:"Return to schedule",schedule:"Schedule",allOff:"All off",preheat:"Preheat on the way home",awaySetpoint:"Away setpoint",awayDelay:"Away delay",preheatRadius:"Preheat radius",addSlot:"Add slot",deleteSlot:"Delete slot",confirmDelete:"Tap again to delete",start:"Start",setpoint:"Setpoint",current:"Now",target:"Target",noSlots:"No slots: add one with +",unavailable:"Schedule unavailable",full:"No free start time left"},ne={modes:{home:"In casa",away:"Fuori casa",preheat:"Preriscaldo",manual:"Manuale",paused:"Sospeso",off:"Spento"},directions:{towards:"sta tornando",away_from:"si allontana",stationary:"fermo",arrived:"arrivato"},manualUntil:i=>`Manuale fino alle ${i}`,returnToSchedule:"Ritorna al programma",schedule:"Programma",allOff:"Spegni tutto",preheat:"Preriscaldo al rientro",awaySetpoint:"Temperatura fuori casa",awayDelay:"Ritardo fuori casa",preheatRadius:"Raggio preriscaldo",addSlot:"Aggiungi fascia",deleteSlot:"Elimina fascia",confirmDelete:"Tocca ancora per eliminare",start:"Inizio",setpoint:"Temperatura",current:"Ora",target:"Obiettivo",noSlots:"Nessuna fascia: aggiungine una con +",unavailable:"Programma non disponibile",full:"Nessun orario libero"};function L(i){return i.split("-")[0]==="it"?ne:ee}function se(i,t){for(let e of Object.values(i.states))if(e!==void 0&&e.entity_id.startsWith("sensor.")&&e.attributes.config_entry_id===t&&i.entities[e.entity_id]?.platform==="estia")return e.entity_id;return null}var j=class extends f{constructor(){super();this._card=null;this._entity=null;this.hass=void 0,this.narrow=!1,this.panel=void 0}_cardFor(e){return(this._card===null||this._entity!==e)&&(this._card=document.createElement("estia-card"),this._card.setConfig({type:"custom:estia-card",entity:e}),this._entity=e),this._card.hass=this.hass,this._card}render(){if(this.hass===void 0||this.panel===void 0)return c;let e=se(this.hass,this.panel.config.config_entry_id);return u`
      <div class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">${this.panel.title??"Estia"}</div>
      </div>
      <div class="content">
        ${e===null?u`<div class="message">${L(this.hass.language).unavailable}</div>`:this._cardFor(e)}
      </div>
    `}};j.properties={hass:{attribute:!1},narrow:{attribute:!1},panel:{attribute:!1}},j.styles=H`
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
    .content {
      max-width: 720px;
      margin: 0 auto;
      padding: 16px;
    }
    .message {
      padding: 16px;
    }
  `;customElements.get("estia-panel")===void 0&&customElements.define("estia-panel",j);var kt=["home","away","preheat","manual","paused","off"];var C=24*60,b=15,_=class extends Error{};function g(i,t){if(!(t in i))throw new _(`missing attribute ${t}`);return i[t]}function E(i,t){if(typeof i!="string")throw new _(`${t} is not a string`);return i}function B(i,t){if(typeof i!="number")throw new _(`${t} is not a number`);return i}function Rt(i,t){return i===null?null:E(i,t)}function Ht(i,t){if(!Array.isArray(i))throw new _(`${t} is not a list`);return i}function Dt(i,t){if(typeof i!="object"||i===null||Array.isArray(i))throw new _(`${t} is not a mapping`);return i}function pt(i){let t=/^(\d{2}):(\d{2})$/.exec(i);if(t===null)throw new _(`bad time ${i}`);return Number(t[1])*60+Number(t[2])}function T(i){let t=Math.floor(i/60)%24,e=i%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`}function ie(i){if(i==="unknown"||i==="unavailable")return null;let t=kt.find(e=>e===i);if(t===void 0)throw new _(`unknown mode ${i}`);return t}function Ut(i){let t=i.attributes,e=Ht(g(t,"slots"),"slots").map((o,l)=>{let a=Dt(o,`slot ${l}`);return{id:E(g(a,"id"),"slot id"),start:pt(E(g(a,"start"),"slot start")),setpoint:B(g(a,"setpoint"),"slot setpoint")}}),n=Ht(g(t,"proximity"),"proximity").map((o,l)=>{let a=Dt(o,`proximity ${l}`);return{distance:E(g(a,"distance"),"distance sensor"),direction:E(g(a,"direction"),"direction sensor")}}),s=Rt(g(t,"hold_until"),"hold_until"),r=g(t,"target");return{mode:ie(i.state),slots:e.sort((o,l)=>o.start-l.start),activeSlot:Rt(g(t,"active_slot"),"active_slot"),holdUntil:s===null?null:new Date(s),target:r===null?null:B(r,"target"),configEntryId:E(g(t,"config_entry_id"),"config_entry_id"),climate:E(g(t,"climate_entity"),"climate_entity"),proximity:n,setpointMin:B(g(t,"setpoint_min"),"setpoint_min"),setpointMax:B(g(t,"setpoint_max"),"setpoint_max"),setpointStep:B(g(t,"setpoint_step"),"setpoint_step")}}var re=["schedule","preheat","away_setpoint","away_delay","preheat_radius","resume","all_off"];function Nt(i,t){let e={schedule:null,preheat:null,away_setpoint:null,away_delay:null,preheat_radius:null,resume:null,all_off:null},n=i.entities[t]?.device_id??null;if(n===null)return e;for(let s of Object.values(i.entities)){if(s===void 0||s.platform!=="estia"||s.device_id!==n)continue;let r=re.find(o=>o===s.translation_key);r!==void 0&&(e[r]=s.entity_id)}return e}function Ot(i){if(i.length===0)return[];let t=[...i].sort((s,r)=>s.start-r.start),e=[],n=t[t.length-1];return t[0].start>0&&e.push({slot:n,from:0,to:t[0].start}),t.forEach((s,r)=>{let o=r+1<t.length?t[r+1].start:C;e.push({slot:s,from:s.start,to:o})}),e.filter(s=>s.to>s.from)}function zt(i,t){let e=[...i].sort((o,l)=>o.start-l.start),n=e.findIndex(o=>o.id===t);if(n<0)throw new _(`no slot ${t}`);let s=n>0?e[n-1].start+b:0,r=n+1<e.length?e[n+1].start-b:C-b;return{min:s,max:r}}function It(i,t){let e=Math.round(i/b)*b;return Math.min(t.max,Math.max(t.min,e))}function Lt(i){let t=new Set(i.map(r=>r.start));if(!t.has(12*60))return 12*60;let e=[...t].sort((r,o)=>r-o),n=0,s=null;for(let r=0;r<e.length;r++){let o=e[r],a=(r+1<e.length?e[r+1]:e[0]+C)-o,d=Math.round((o+a/2)/b)*b%C;a>b&&!t.has(d)&&a>n&&(n=a,s=d)}return s}function jt(i,t,e){return`hsl(${(210-210*Math.min(1,Math.max(0,(i-t)/(e-t)))).toFixed(0)}, 70%, 52%)`}function ut(i){return i.getHours()*60+i.getMinutes()}var oe=550,ae=900,W="estia",le={home:"var(--success-color, #43a047)",away:"var(--info-color, #039be5)",preheat:"var(--warning-color, #ffa600)",manual:"var(--accent-color, #ff9800)",paused:"var(--disabled-text-color, #9e9e9e)",off:"var(--secondary-text-color, #727272)"};function k(i,t){if(i===void 0)return null;let e=i.attributes[t];return typeof e=="number"?e:null}function J(i,t){if(i===void 0)return null;let e=i.attributes[t];return typeof e=="string"?e:null}function F(i){return`${(i/C*100).toFixed(3)}%`}var V=class extends f{constructor(){super();this._longPressed=!1;this.hass=void 0,this._config=void 0,this._selected=null,this._drag=null,this._pending=null,this._armedDelete=null,this._error=null}setConfig(e){if(typeof e.entity!="string"||!e.entity.startsWith("sensor."))throw new Error("entity: the Estia mode sensor (sensor.\u2026) is required");this._config=e}getCardSize(){return 6}static getStubConfig(e){let n=Object.values(e.entities).find(s=>s!==void 0&&s.platform===W&&s.entity_id.startsWith("sensor."));return n===void 0?{}:{entity:n.entity_id}}connectedCallback(){super.connectedCallback(),this._clock=window.setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._clock),window.clearTimeout(this._longPress),this._pending!==null&&window.clearTimeout(this._pending.timer)}shouldUpdate(e){return!(this._drag!==null&&e.size===1&&e.has("hass"))}async _call(e,n,s){if(this.hass!==void 0){this._error=null;try{await this.hass.callService(e,n,s)}catch(r){this._error=r instanceof Error?r.message:String(r)}}}_setSlot(e,n,s,r){return this._call(W,"set_slot",{config_entry_id:e.configEntryId,slot_id:n.id,start:T(s),setpoint:r})}_onHandleDown(e,n,s){e.stopPropagation(),e.preventDefault();let r=e.currentTarget.parentElement;if(r===null)return;e.currentTarget.setPointerCapture(e.pointerId);let o=zt(n.slots,s.id);this._drag={id:s.id,start:s.start,...o,bar:r.getBoundingClientRect()},this._selected=s.id}_onHandleMove(e){let n=this._drag;if(n===null)return;let s=(e.clientX-n.bar.left)/n.bar.width*C,r=It(s,n);r!==n.start&&(this._drag={...n,start:r})}async _onHandleUp(e){let n=this._drag;if(n===null)return;let s=e.slots.find(r=>r.id===n.id);s!==void 0&&n.start!==s.start&&await this._setSlot(e,s,n.start,s.setpoint),this._drag=null}_onSegmentDown(e){this._longPressed=!1,window.clearTimeout(this._longPress),this._longPress=window.setTimeout(()=>{this._longPressed=!0,this._selected=e.id,this._armedDelete=e.id},oe)}_onSegmentUp(e){window.clearTimeout(this._longPress),!this._longPressed&&(this._armedDelete=null,this._selected=this._selected===e.id?null:e.id)}_step(e,n,s){let r=this._pending?.id===n.id?this._pending.value:n.setpoint,o=Math.round((r+s*e.setpointStep)*10)/10,l=Math.min(e.setpointMax,Math.max(e.setpointMin,o));this._pending!==null&&window.clearTimeout(this._pending.timer);let a=window.setTimeout(async()=>{this._pending=null,await this._setSlot(e,n,n.start,l)},ae);this._pending={id:n.id,value:l,timer:a}}async _onStartInput(e,n,s){let r=e.target.value;r!==""&&await this._setSlot(n,s,pt(r.slice(0,5)),s.setpoint)}async _delete(e,n){if(this._armedDelete!==n.id){this._armedDelete=n.id;return}this._armedDelete=null,this._selected=null,await this._call(W,"remove_slot",{config_entry_id:e.configEntryId,slot_id:n.id})}async _add(e,n){let s=Lt(e.slots);if(s===null){this._error=L(this.hass?.language??"en").full;return}let r=k(n,"temperature")??e.target??e.setpointMin;await this._call(W,"add_slot",{config_entry_id:e.configEntryId,start:T(s),setpoint:r})}render(){if(this.hass===void 0||this._config===void 0)return c;let e=L(this.hass.language),n=this.hass.states[this._config.entity];if(n===void 0||n.state==="unavailable")return u`<ha-card><div class="message">${e.unavailable}: ${this._config.entity}</div></ha-card>`;let s;try{s=Ut(n)}catch(a){return u`<ha-card><div class="message error">${this._config.entity}: ${String(a)}</div></ha-card>`}let r=this.hass.states[s.climate],o=this._withDrag(s.slots),l=o.find(a=>a.id===this._selected);return u`
      <ha-card>
        ${this._renderHeader(s,r,e)} ${this._renderTimeline(s,o,e)}
        ${l===void 0?c:this._renderEditor(s,l,e)}
        ${this._error===null?c:u`<div class="message error">${this._error}</div>`}
        ${this._renderControls(s,e)}
      </ha-card>
    `}_withDrag(e){let n=this._drag;return n===null?e:e.map(s=>s.id===n.id?{...s,start:n.start}:s)}_renderHeader(e,n,s){let r=this._config?.title??J(n,"friendly_name")??e.climate,o=k(n,"current_temperature"),l=k(n,"temperature"),a=e.mode;return u`
      <div class="header">
        <div class="title">${r}</div>
        ${a===null?c:u`<span class="badge" style="background:${le[a]}">${s.modes[a]}</span>`}
      </div>
      <div class="temps">
        <div><span class="label">${s.current}</span><span class="big">${o===null?"\u2014":`${o.toFixed(1)}\xB0`}</span></div>
        <div><span class="label">${s.target}</span><span class="big">${l===null?"\u2014":`${l.toFixed(1)}\xB0`}</span></div>
      </div>
      ${a==="manual"&&e.holdUntil!==null?u`<div class="hold">
            <span>${s.manualUntil(T(ut(e.holdUntil)))}</span>
            <button
              class="primary"
              @click=${()=>this._call(W,"resume",{config_entry_id:e.configEntryId})}
            >
              ${s.returnToSchedule}
            </button>
          </div>`:c}
    `}_renderTimeline(e,n,s){let r=ut(new Date),o=Math.min(...n.map(a=>a.setpoint),16),l=Math.max(...n.map(a=>a.setpoint),23);return u`
      <div class="timeline">
        <div class="bar">
          ${n.length===0?u`<div class="empty">${s.noSlots}</div>`:c}
          ${Ot(n).map(a=>{let d=a.slot,h=d.id===e.activeSlot,p=this._pending?.id===d.id?this._pending.value:d.setpoint;return u`<div
              class="segment ${h?"active":""} ${d.id===this._selected?"selected":""}"
              style="left:${F(a.from)};width:${F(a.to-a.from)};background:${jt(p,o,l)}"
              @pointerdown=${()=>this._onSegmentDown(d)}
              @pointerup=${()=>this._onSegmentUp(d)}
              @pointerleave=${()=>window.clearTimeout(this._longPress)}
              @contextmenu=${m=>m.preventDefault()}
            >
              ${a.to-a.from>=120?u`<span>${p.toFixed(1)}°</span>`:c}
            </div>`})}
          ${n.map(a=>u`<div
              class="handle ${this._drag?.id===a.id?"dragging":""}"
              style="left:${F(a.start)}"
              title=${T(a.start)}
              @pointerdown=${d=>this._onHandleDown(d,e,a)}
              @pointermove=${d=>this._onHandleMove(d)}
              @pointerup=${()=>this._onHandleUp(e)}
              @pointercancel=${()=>this._drag=null}
            >
              ${this._drag?.id===a.id?u`<span class="tip">${T(a.start)}</span>`:c}
            </div>`)}
          <div class="now" style="left:${F(r)}"></div>
        </div>
        <div class="ticks">
          ${[0,6,12,18,24].map(a=>u`<span style="left:${F(a*60)}">${a}</span>`)}
        </div>
        <button class="add" title=${s.addSlot} @click=${()=>this._add(e,this.hass?.states[e.climate])}>
          +
        </button>
      </div>
    `}_renderEditor(e,n,s){let r=this._pending?.id===n.id?this._pending.value:n.setpoint,o=this._armedDelete===n.id;return u`
      <div class="editor">
        <label>
          <span class="label">${s.start}</span>
          <input
            type="time"
            step="900"
            .value=${T(n.start)}
            @change=${l=>this._onStartInput(l,e,n)}
          />
        </label>
        <div class="stepper">
          <span class="label">${s.setpoint}</span>
          <button @click=${()=>this._step(e,n,-1)}>−</button>
          <span class="big">${r.toFixed(1)}°</span>
          <button @click=${()=>this._step(e,n,1)}>+</button>
        </div>
        <button class="delete ${o?"armed":""}" @click=${()=>this._delete(e,n)}>
          ${o?s.confirmDelete:s.deleteSlot}
        </button>
      </div>
    `}_renderControls(e,n){if(this.hass===void 0||this._config===void 0)return u``;let s=Nt(this.hass,this._config.entity);return u`
      <div class="controls">
        <div class="row">
          ${this._renderToggle(s.schedule,n.schedule)}
          ${s.all_off===null?c:u`<button
                class="danger"
                @click=${()=>this._call("button","press",{entity_id:s.all_off})}
              >
                ${n.allOff}
              </button>`}
        </div>
        <div class="row">${this._renderToggle(s.preheat,n.preheat)}</div>
        ${this._renderNumber(s.away_setpoint,n.awaySetpoint)}
        ${this._renderNumber(s.away_delay,n.awayDelay)}
        ${this._renderNumber(s.preheat_radius,n.preheatRadius)}
        ${e.proximity.map(r=>this._renderTraveller(r.distance,r.direction,n))}
      </div>
    `}_renderToggle(e,n){if(e===null||this.hass===void 0)return c;let s=this.hass.states[e]?.state==="on";return u`<label class="toggle">
      <input
        type="checkbox"
        role="switch"
        .checked=${s}
        @change=${r=>this._call("switch",r.target.checked?"turn_on":"turn_off",{entity_id:e})}
      />
      <span>${n}</span>
    </label>`}_renderNumber(e,n){if(e===null||this.hass===void 0)return c;let s=this.hass.states[e];if(s===void 0)return c;let r=J(s,"unit_of_measurement")??"";return u`<label class="number">
      <span>${n}</span>
      <span>
        <input
          type="number"
          .value=${s.state}
          min=${k(s,"min")??0}
          max=${k(s,"max")??100}
          step=${k(s,"step")??1}
          @change=${o=>this._call("number","set_value",{entity_id:e,value:Number(o.target.value)})}
        />
        ${r}
      </span>
    </label>`}_renderTraveller(e,n,s){let r=this.hass?.states[e],o=this.hass?.states[n],l=J(r,"friendly_name")??e,a=J(r,"unit_of_measurement")??"",d=o===void 0?"":s.directions[o.state]??o.state;return u`<div class="traveller">
      <span>${l}</span>
      <span class="secondary">${r===void 0?"\u2014":`${r.state} ${a}`} · ${d}</span>
    </div>`}};V.properties={hass:{attribute:!1},_config:{state:!0},_selected:{state:!0},_drag:{state:!0},_pending:{state:!0},_armedDelete:{state:!0},_error:{state:!0}},V.styles=H`
    :host {
      --estia-radius: var(--ha-card-border-radius, 12px);
    }
    ha-card {
      padding: 16px;
      color: var(--primary-text-color);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .title {
      font-size: 1.2em;
      font-weight: 500;
    }
    .badge {
      color: var(--text-primary-color, #fff);
      border-radius: 999px;
      padding: 2px 10px;
      font-size: 0.85em;
      white-space: nowrap;
    }
    .temps {
      display: flex;
      gap: 24px;
      margin: 8px 0;
    }
    .temps div,
    .stepper {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .label,
    .secondary {
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
    .big {
      font-size: 1.5em;
      font-variant-numeric: tabular-nums;
    }
    .hold {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 8px 12px;
      margin-bottom: 8px;
      border-radius: var(--estia-radius);
      background: var(--secondary-background-color);
    }
    .timeline {
      position: relative;
      padding: 18px 40px 4px 0;
    }
    .bar {
      position: relative;
      height: 48px;
      border-radius: 8px;
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
      font-size: 0.85em;
      cursor: pointer;
      opacity: 0.8;
      box-sizing: border-box;
    }
    .segment.active {
      opacity: 1;
      box-shadow: inset 0 0 0 2px var(--primary-text-color);
    }
    .segment.selected {
      box-shadow: inset 0 0 0 3px var(--primary-color);
    }
    .segment:first-of-type {
      border-radius: 8px 0 0 8px;
    }
    .handle {
      position: absolute;
      top: -6px;
      bottom: -6px;
      width: 16px;
      margin-left: -8px;
      cursor: ew-resize;
      z-index: 2;
    }
    .handle::after {
      content: "";
      position: absolute;
      left: 7px;
      top: 0;
      bottom: 0;
      width: 2px;
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
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 0.8em;
    }
    .now {
      position: absolute;
      top: -4px;
      bottom: -4px;
      width: 2px;
      margin-left: -1px;
      background: var(--error-color, #db4437);
      pointer-events: none;
      z-index: 3;
    }
    .ticks {
      position: relative;
      height: 16px;
      margin-top: 6px;
      color: var(--secondary-text-color);
      font-size: 0.75em;
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
      border: none;
      border-radius: 999px;
      padding: 6px 14px;
      cursor: pointer;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    button.danger,
    button.delete.armed {
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .add {
      position: absolute;
      right: 0;
      top: 18px;
      width: 32px;
      height: 48px;
      padding: 0;
      font-size: 1.4em;
      border-radius: 8px;
    }
    .editor {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px 20px;
      margin-top: 12px;
      padding: 12px;
      border-radius: var(--estia-radius);
      background: var(--secondary-background-color);
    }
    .editor label {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .stepper button {
      width: 36px;
      height: 36px;
      padding: 0;
      font-size: 1.2em;
      background: var(--card-background-color);
    }
    input {
      font: inherit;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 4px 6px;
    }
    input[type="number"] {
      width: 5em;
    }
    .controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .row,
    .number,
    .traveller {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    .toggle input {
      accent-color: var(--primary-color);
      width: 18px;
      height: 18px;
    }
    .message {
      padding: 8px 0;
    }
    .error {
      color: var(--error-color, #db4437);
    }
  `;customElements.get("estia-card")===void 0&&customElements.define("estia-card",V);window.customCards=window.customCards??[];window.customCards.push({type:"estia-card",name:"Estia",description:"Heating schedule: 24 h timeline with drag-to-edit slots",preview:!1});export{V as EstiaCard};
