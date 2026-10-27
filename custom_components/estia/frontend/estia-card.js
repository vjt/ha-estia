var Q=globalThis,tt=Q.ShadowRoot&&(Q.ShadyCSS===void 0||Q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pt=Symbol(),Rt=new WeakMap,z=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==pt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(tt&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=Rt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&Rt.set(t,e))}return e}toString(){return this.cssText}},Ht=r=>new z(typeof r=="string"?r:r+"",void 0,pt),k=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((n,i,s)=>n+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[s+1],r[0]);return new z(t,r,pt)},Dt=(r,e)=>{if(tt)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let n=document.createElement("style"),i=Q.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=t.cssText,r.appendChild(n)}},ht=tt?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let n of e.cssRules)t+=n.cssText;return Ht(t)})(r):r;var{is:ue,defineProperty:pe,getOwnPropertyDescriptor:he,getOwnPropertyNames:me,getOwnPropertySymbols:fe,getPrototypeOf:ge}=Object,et=globalThis,Ut=et.trustedTypes,_e=Ut?Ut.emptyScript:"",ye=et.reactiveElementPolyfillSupport,L=(r,e)=>r,mt={toAttribute(r,e){switch(e){case Boolean:r=r?_e:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Ot=(r,e)=>!ue(r,e),Nt={attribute:!0,type:String,converter:mt,reflect:!1,useDefault:!1,hasChanged:Ot};Symbol.metadata??=Symbol("metadata"),et.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Nt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(e,n,t);i!==void 0&&pe(this.prototype,e,i)}}static getPropertyDescriptor(e,t,n){let{get:i,set:s}=he(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let a=i?.call(this);s?.call(this,o),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Nt}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let e=ge(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let t=this.properties,n=[...me(t),...fe(t)];for(let i of n)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[n,i]of t)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[t,n]of this.elementProperties){let i=this._$Eu(t,n);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let i of n)t.unshift(ht(i))}else e!==void 0&&t.push(ht(e));return t}static _$Eu(e,t){let n=t.attribute;return n===!1?void 0:typeof n=="string"?n:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Dt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,n);if(i!==void 0&&n.reflect===!0){let s=(n.converter?.toAttribute!==void 0?n.converter:mt).toAttribute(t,n.type);this._$Em=e,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(e,t){let n=this.constructor,i=n._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let s=n.getPropertyOptions(i),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:mt;this._$Em=i;let a=o.fromAttribute(t,s.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(e,t,n,i=!1,s){if(e!==void 0){let o=this.constructor;if(i===!1&&(s=this[e]),n??=o.getPropertyOptions(e),!((n.hasChanged??Ot)(s,t)||n.useDefault&&n.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,n))))return;this.C(e,t,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:i,wrapped:s},o){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),s!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,s]of n){let{wrapped:o}=s,a=this[i];o!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,s,a)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[L("elementProperties")]=new Map,x[L("finalized")]=new Map,ye?.({ReactiveElement:x}),(et.reactiveElementVersions??=[]).push("2.1.2");var $t=globalThis,It=r=>r,nt=$t.trustedTypes,zt=nt?nt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Vt="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,qt="?"+E,ve=`<${qt}>`,M=document,B=()=>M.createComment(""),W=r=>r===null||typeof r!="object"&&typeof r!="function",wt=Array.isArray,be=r=>wt(r)||typeof r?.[Symbol.iterator]=="function",ft=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Lt=/-->/g,jt=/>/g,C=RegExp(`>|${ft}(?:([^\\s"'>=/]+)(${ft}*=${ft}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Bt=/'/g,Wt=/"/g,Kt=/^(?:script|style|textarea|title)$/i,xt=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),h=xt(1),q=xt(2),Ve=xt(3),R=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Ft=new WeakMap,T=M.createTreeWalker(M,129);function Yt(r,e){if(!wt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return zt!==void 0?zt.createHTML(e):e}var $e=(r,e)=>{let t=r.length-1,n=[],i,s=e===2?"<svg>":e===3?"<math>":"",o=j;for(let a=0;a<t;a++){let l=r[a],u,d,c=-1,f=0;for(;f<l.length&&(o.lastIndex=f,d=o.exec(l),d!==null);)f=o.lastIndex,o===j?d[1]==="!--"?o=Lt:d[1]!==void 0?o=jt:d[2]!==void 0?(Kt.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=C):d[3]!==void 0&&(o=C):o===C?d[0]===">"?(o=i??j,c=-1):d[1]===void 0?c=-2:(c=o.lastIndex-d[2].length,u=d[1],o=d[3]===void 0?C:d[3]==='"'?Wt:Bt):o===Wt||o===Bt?o=C:o===Lt||o===jt?o=j:(o=C,i=void 0);let g=o===C&&r[a+1].startsWith("/>")?" ":"";s+=o===j?l+ve:c>=0?(n.push(u),l.slice(0,c)+Vt+l.slice(c)+E+g):l+E+(c===-2?a:g)}return[Yt(r,s+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]},F=class r{constructor({strings:e,_$litType$:t},n){let i;this.parts=[];let s=0,o=0,a=e.length-1,l=this.parts,[u,d]=$e(e,t);if(this.el=r.createElement(u,n),T.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=T.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(Vt)){let f=d[o++],g=i.getAttribute(c).split(E),y=/([.?@])?(.*)/.exec(f);l.push({type:1,index:s,name:y[2],strings:g,ctor:y[1]==="."?_t:y[1]==="?"?yt:y[1]==="@"?vt:N}),i.removeAttribute(c)}else c.startsWith(E)&&(l.push({type:6,index:s}),i.removeAttribute(c));if(Kt.test(i.tagName)){let c=i.textContent.split(E),f=c.length-1;if(f>0){i.textContent=nt?nt.emptyScript:"";for(let g=0;g<f;g++)i.append(c[g],B()),T.nextNode(),l.push({type:2,index:++s});i.append(c[f],B())}}}else if(i.nodeType===8)if(i.data===qt)l.push({type:2,index:s});else{let c=-1;for(;(c=i.data.indexOf(E,c+1))!==-1;)l.push({type:7,index:s}),c+=E.length-1}s++}}static createElement(e,t){let n=M.createElement("template");return n.innerHTML=e,n}};function U(r,e,t=r,n){if(e===R)return e;let i=n!==void 0?t._$Co?.[n]:t._$Cl,s=W(e)?void 0:e._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(r),i._$AT(r,t,n)),n!==void 0?(t._$Co??=[])[n]=i:t._$Cl=i),i!==void 0&&(e=U(r,i._$AS(r,e.values),i,n)),e}var gt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,i=(e?.creationScope??M).importNode(t,!0);T.currentNode=i;let s=T.nextNode(),o=0,a=0,l=n[0];for(;l!==void 0;){if(o===l.index){let u;l.type===2?u=new V(s,s.nextSibling,this,e):l.type===1?u=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(u=new bt(s,this,e)),this._$AV.push(u),l=n[++a]}o!==l?.index&&(s=T.nextNode(),o++)}return T.currentNode=M,i}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}},V=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=U(this,e,t),W(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==R&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):be(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&W(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,i=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=F.createElement(Yt(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(t);else{let s=new gt(i,this),o=s.u(this.options);s.p(t),this.T(o),this._$AH=s}}_$AC(e){let t=Ft.get(e.strings);return t===void 0&&Ft.set(e.strings,t=new F(e)),t}k(e){wt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,n,i=0;for(let s of e)i===t.length?t.push(n=new r(this.O(B()),this.O(B()),this,this.options)):n=t[i],n._$AI(s),i++;i<t.length&&(this._$AR(n&&n._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let n=It(e).nextSibling;It(e).remove(),e=n}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},N=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,i,s){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=p}_$AI(e,t=this,n,i){let s=this.strings,o=!1;if(s===void 0)e=U(this,e,t,0),o=!W(e)||e!==this._$AH&&e!==R,o&&(this._$AH=e);else{let a=e,l,u;for(e=s[0],l=0;l<s.length-1;l++)u=U(this,a[n+l],t,l),u===R&&(u=this._$AH[l]),o||=!W(u)||u!==this._$AH[l],u===p?e=p:e!==p&&(e+=(u??"")+s[l+1]),this._$AH[l]=u}o&&!i&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},_t=class extends N{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},yt=class extends N{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},vt=class extends N{constructor(e,t,n,i,s){super(e,t,n,i,s),this.type=5}_$AI(e,t=this){if((e=U(this,e,t,0)??p)===R)return;let n=this._$AH,i=e===p&&n!==p||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,s=e!==p&&(n===p||i);i&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},bt=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){U(this,e)}};var we=$t.litHtmlPolyfillSupport;we?.(F,V),($t.litHtmlVersions??=[]).push("3.3.3");var Gt=(r,e,t)=>{let n=t?.renderBefore??e,i=n._$litPart$;if(i===void 0){let s=t?.renderBefore??null;n._$litPart$=i=new V(e.insertBefore(B(),s),s,void 0,t??{})}return i._$AI(r),i};var St=globalThis,b=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Gt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return R}};b._$litElement$=!0,b.finalized=!0,St.litElementHydrateSupport?.({LitElement:b});var xe=St.litElementPolyfillSupport;xe?.({LitElement:b});(St.litElementVersions??=[]).push("4.2.2");function Xt(r){return typeof r=="number"&&Number.isFinite(r)?r:null}function Jt(r){let e=null,t=null;return r.map(n=>(n.a!==void 0&&(e=Xt(n.a.current_temperature)??("current_temperature"in n.a?null:e),t=Xt(n.a.temperature)??("temperature"in n.a?null:t)),{t:n.lu*1e3,current:e,target:t,heat:n.s==="heat"}))}function Se(r){return r.heat&&r.current!==null&&r.target!==null&&r.target>r.current}function Zt(r,e,t){let n=[];return r.forEach((i,s)=>{if(!Se(i))return;let o=Math.max(i.t,e),a=Math.min(s+1<r.length?r[s+1].t:t,t);if(a<=o)return;let l=n[n.length-1];l!==void 0&&l.to===o?l.to=a:n.push({from:o,to:a})}),n}function Qt(r,e,t){let n=(e-r)/t,i=10**Math.floor(Math.log10(n)),s=[1,2,2.5,5,10].map(a=>a*i).find(a=>a>=n)??n,o=[];for(let a=Math.ceil(r/s)*s;a<=e+1e-9;a+=s)o.push(Math.round(a*100)/100);return o}var Ee={modes:{home:"Home",away:"Away",preheat:"Preheat",manual:"Manual",boost:"Boost",paused:"Manual (no expiry)",off:"Off"},directions:{towards:"heading home",away_from:"moving away",stationary:"not moving",arrived:"arrived"},travellerHome:r=>`${r} is home`,travellerAway:(r,e,t)=>`${r} is ${e} away, ${t}`,travellerUnknown:r=>`${r}: position unknown`,manualUntil:r=>`Manual until ${r}`,returnToSchedule:"Return to schedule",schedule:"Schedule",allOff:"All off",pausedInfo:"Schedule off: Estia leaves the thermostat alone and keeps the temperature you set, with no end. Slots, away and preheat are ignored until you choose Scheduled again.",offInfo:"Heating off: the thermostat is off and Estia does not touch it.",scheduled:"Scheduled",boost:"Boost",boostUntil:r=>`Boost: maximum until ${r}, then back to before`,settings:"Schedule",edit:"Edit",done:"Done",awaySummary:(r,e)=>`Away: ${r} \xB0C after ${e} min with nobody home`,preheatSummary:r=>`Preheat: within ${r} km when someone is heading home`,preheatOff:"Preheat off",history:"Temperature",roomTemperature:"Room",targetTemperature:"Target",heatingEstimate:"Heating (estimated)",periods:[{hours:24,label:"24 hours"},{hours:168,label:"7 days"},{hours:720,label:"30 days"}],preheat:"Preheat on the way home",awaySetpoint:"Away setpoint",awayDelay:"Away delay",preheatRadius:"Preheat radius",addSlot:"Add slot",deleteSlot:"Delete slot",confirmDelete:"Tap again to delete",start:"Start",setpoint:"Setpoint",noSlots:"No slots: add one with +",unavailable:"Schedule unavailable",full:"No free start time left",profiles:"Profile",days:"Days",addProfile:"Add profile",renameProfile:"Rename",deleteProfile:"Delete profile",profileInUse:"Assign its days to another profile first",profileName:"Profile name",save:"Save",cancel:"Cancel",today:"today"},Ae={modes:{home:"In casa",away:"Fuori casa",preheat:"Preriscaldo",manual:"Manuale",boost:"Massimo",paused:"Manuale (senza scadenza)",off:"Spento"},directions:{towards:"sta tornando",away_from:"si allontana",stationary:"non si muove",arrived:"arrivato"},travellerHome:r=>`${r} \xE8 a casa`,travellerAway:(r,e,t)=>`${r} \xE8 a ${e}, ${t}`,travellerUnknown:r=>`${r}: posizione sconosciuta`,manualUntil:r=>`Manuale fino alle ${r}`,returnToSchedule:"Ritorna al programma",schedule:"Programma",allOff:"Spegni tutto",pausedInfo:"Programma spento: Estia non tocca il termostato e tiene la temperatura che hai impostato, senza scadenza. Fasce, fuori casa e preriscaldo sono ignorati finch\xE9 non scegli di nuovo Pianificato.",offInfo:"Riscaldamento spento: il termostato \xE8 spento ed Estia non lo tocca.",scheduled:"Pianificato",boost:"Massimo",boostUntil:r=>`Massimo fino alle ${r}, poi torna com'era`,settings:"Programma",edit:"Modifica",done:"Fatto",awaySummary:(r,e)=>`Fuori casa: ${r} \xB0C dopo ${e} min senza nessuno`,preheatSummary:r=>`Preriscaldo: entro ${r} km se qualcuno sta tornando`,preheatOff:"Preriscaldo spento",history:"Temperatura",roomTemperature:"Ambiente",targetTemperature:"Obiettivo",heatingEstimate:"Riscaldamento (stima)",periods:[{hours:24,label:"24 ore"},{hours:168,label:"7 giorni"},{hours:720,label:"30 giorni"}],preheat:"Preriscaldo al rientro",awaySetpoint:"Temperatura fuori casa",awayDelay:"Ritardo fuori casa",preheatRadius:"Raggio preriscaldo",addSlot:"Aggiungi fascia",deleteSlot:"Elimina fascia",confirmDelete:"Tocca ancora per eliminare",start:"Inizio",setpoint:"Temperatura",noSlots:"Nessuna fascia: aggiungine una con +",unavailable:"Programma non disponibile",full:"Nessun orario libero",profiles:"Profilo",days:"Giorni",addProfile:"Aggiungi profilo",renameProfile:"Rinomina",deleteProfile:"Elimina profilo",profileInUse:"Assegna prima i suoi giorni a un altro profilo",profileName:"Nome del profilo",save:"Salva",cancel:"Annulla",today:"oggi"};function H(r){return r.split("-")[0]==="it"?Ae:Ee}var it=240,v={left:36,right:12,top:12,bottom:28},Pe=5*6e4,K=class extends b{constructor(){super();this._resize=null;this._loaded="";this.hass=void 0,this.entity=void 0,this.hours=24,this._points=null,this._width=0,this._hover=null,this._error=null}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>void this._load(),Pe),this._resize=new ResizeObserver(t=>{let n=t[0]?.contentRect.width??0;Math.abs(n-this._width)>1&&(this._width=n)}),this._resize.observe(this)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer),this._resize?.disconnect()}updated(t){let n=`${this.entity??""}:${this.hours}`;(t.has("hours")||t.has("entity")||t.has("hass"))&&n!==this._loaded&&(this._loaded=n,this._load())}async _load(){if(this.hass===void 0||this.entity===void 0)return;let t=new Date(Date.now()-this.hours*36e5);try{let n=await this.hass.callWS({type:"history/history_during_period",start_time:t.toISOString(),entity_ids:[this.entity],minimal_response:!1,no_attributes:!1,significant_changes_only:!1});this._points=Jt(n[this.entity]??[]),this._error=null}catch(n){this._error=n instanceof Error?n.message:String(n)}}render(){if(this.hass===void 0)return p;let t=H(this.hass.language);if(this._error!==null)return h`<ha-card><div class="message">${this._error}</div></ha-card>`;let n=this._points,i=this._width;if(n===null||i===0)return h`<ha-card><div class="placeholder"></div></ha-card>`;let s=Date.now(),o=s-this.hours*36e5,a=n.flatMap(m=>[m.current,m.target]).filter(m=>m!==null),l=Math.floor(Math.min(...a,18)-.5),u=Math.ceil(Math.max(...a,20)+.5),d=i-v.left-v.right,c=it-v.top-v.bottom,f=m=>v.left+(m-o)/(s-o)*d,g=m=>v.top+(1-(m-l)/(u-l))*c,y=m=>{let ct="",ut=null;return n.forEach((Tt,ce)=>{let Z=m(Tt),Mt=f(Math.max(Tt.t,o));if(Z===null){ut=null;return}ct+=ut===null?`M${Mt},${g(Z)}`:`H${Mt}V${g(Z)}`,ut=Z,ce===n.length-1&&(ct+=`H${f(s)}`)}),ct},le=Zt(n,o,s),de=this._timeTicks(o,s),I=this._hover===null?null:this._sampleAt(n,this._hover),kt=this.hass.language,Ct=m=>m===null?"\u2014":`${new Intl.NumberFormat(kt,{maximumFractionDigits:1}).format(m)} \xB0C`;return h`<ha-card>
      <svg
        width=${i}
        height=${it}
        @pointermove=${m=>this._onMove(m,o,s,d)}
        @pointerleave=${()=>this._hover=null}
      >
        ${le.map(m=>q`<rect class="band" x=${f(m.from)} y=${v.top} width=${f(m.to)-f(m.from)} height=${c}></rect>`)}
        ${Qt(l,u,5).map(m=>q`<line class="grid" x1=${v.left} x2=${i-v.right} y1=${g(m)} y2=${g(m)}></line>
            <text class="axis" x=${v.left-6} y=${g(m)+4} text-anchor="end">${m}</text>`)}
        ${de.map(m=>q`<text class="axis" x=${f(m.t)} y=${it-8} text-anchor="middle">${m.label}</text>`)}
        <path class="target" d=${y(m=>m.target)}></path>
        <path class="current" d=${y(m=>m.current)}></path>
        ${I===null||this._hover===null?p:q`<line class="cursor" x1=${f(this._hover)} x2=${f(this._hover)} y1=${v.top} y2=${v.top+c}></line>`}
      </svg>
      <div class="legend">
        ${I===null?h`<span><i class="swatch current"></i>${t.roomTemperature}</span>
              <span><i class="swatch target"></i>${t.targetTemperature}</span>
              <span><i class="swatch band"></i>${t.heatingEstimate}</span>`:h`<span>${new Date(I.t).toLocaleString(kt,{weekday:"short",hour:"2-digit",minute:"2-digit"})}</span>
              <span><i class="swatch current"></i>${Ct(I.current)}</span>
              <span><i class="swatch target"></i>${Ct(I.target)}</span>`}
      </div>
    </ha-card>`}_sampleAt(t,n){let i=null;for(let s of t){if(s.t>n)break;i=s}return i}_onMove(t,n,i,s){let o=t.currentTarget.getBoundingClientRect(),a=(t.clientX-o.left-v.left)/s;this._hover=a<0||a>1?null:n+a*(i-n)}_timeTicks(t,n){let i=(n-t)/36e5,s=this.hass?.language??"en",o=i<=24?4:i<=168?24:24*7,a=new Date(t);a.setMinutes(0,0,0),o>=24&&a.setHours(0);let l=[];for(let u=a.getTime();u<=n;u+=o*36e5){if(u<t)continue;let d=new Date(u),c=o<24?d.toLocaleTimeString(s,{hour:"2-digit",minute:"2-digit"}):d.toLocaleDateString(s,{day:"numeric",month:"short"});l.push({t:u,label:c})}return l}};K.properties={hass:{attribute:!1},entity:{attribute:!1},hours:{attribute:!1},_points:{state:!0},_width:{state:!0},_hover:{state:!0},_error:{state:!0}},K.styles=k`
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
  `;customElements.get("estia-history")===void 0&&customElements.define("estia-history",K);var O=class{constructor(e){this.onReady=e;this.cards=new Map;this.helpers=null;this.loading=!1}get(e,t){let n=JSON.stringify(e),i=this.cards.get(n);if(i!==void 0)return i.hass=t,i;if(this.helpers===null)return this.load(),null;let s=this.helpers.createCardElement(e);return s.hass=t,this.cards.set(n,s),s}load(){this.loading||(this.loading=!0,ke().then(e=>{e!==null&&(this.helpers=e,this.onReady())}))}};async function ke(){if(window.loadCardHelpers===void 0){if(customElements.get("partial-panel-resolver")===void 0)return null;let r=document.createElement("partial-panel-resolver");r.hass={panels:[{url_path:"estia-lovelace",component_name:"lovelace"}]},r._updateRoutes(),await r.routerOptions.routes["estia-lovelace"].load()}return window.loadCardHelpers===void 0?null:window.loadCardHelpers()}var te="estia-panel-period",Et=new CSSStyleSheet;Et.replaceSync("ha-icon-button.more-info { display: none !important; }");function Ce(r,e){for(let t of Object.values(r.states))if(t!==void 0&&t.entity_id.startsWith("sensor.")&&t.attributes.config_entry_id===e&&r.entities[t.entity_id]?.platform==="estia")return t.entity_id;return null}function Te(){try{let r=Number(window.localStorage.getItem(te));return r>0?r:24}catch{return 24}}function Me(r){try{window.localStorage.setItem(te,String(r))}catch{}}var Y=class extends b{constructor(){super();this._card=null;this._entity=null;this._native=new O(()=>this.requestUpdate());this.hass=void 0,this.narrow=!1,this.panel=void 0,this._hours=Te()}_scheduleCard(t){return(this._card===null||this._entity!==t)&&(this._card=document.createElement("estia-card"),this._card.setConfig({type:"custom:estia-card",entity:t}),this._entity=t),this._card.hass=this.hass,this._card}updated(){let t=this.shadowRoot?.querySelector(".thermostat > *")?.shadowRoot;t!=null&&!t.adoptedStyleSheets.includes(Et)&&(t.adoptedStyleSheets=[...t.adoptedStyleSheets,Et])}_setPeriod(t){this._hours=t,Me(t)}render(){let t=this.hass;if(t===void 0||this.panel===void 0)return p;let n=H(t.language),i=Ce(t,this.panel.config.config_entry_id),s=i===null?void 0:t.states[i]?.attributes.climate_entity,o=typeof s=="string"?this._native.get({type:"thermostat",entity:s},t):null;return h`
      <div class="toolbar">
        <ha-menu-button .hass=${t} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">${this.panel.title??"Estia"}</div>
      </div>
      ${i===null?h`<div class="message">${n.unavailable}</div>`:h`<div class="layout">
            <div class="column">
              ${o===null?p:h`<div class="thermostat">${o}</div>`}
              ${this._scheduleCard(i)}
            </div>
            <div class="column">
              <div class="periods">
                <span class="heading">${n.history}</span>
                ${n.periods.map(a=>h`<button
                    class=${a.hours===this._hours?"selected":""}
                    @click=${()=>this._setPeriod(a.hours)}
                  >
                    ${a.label}
                  </button>`)}
              </div>
              ${typeof s=="string"?h`<estia-history .hass=${t} .entity=${s} .hours=${this._hours}></estia-history>`:p}
            </div>
          </div>`}
    `}};Y.properties={hass:{attribute:!1},narrow:{attribute:!1},panel:{attribute:!1},_hours:{state:!0}},Y.styles=k`
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
  `;customElements.get("estia-panel")===void 0&&customElements.define("estia-panel",Y);var ee=["home","away","preheat","manual","boost","paused","off"],rt=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];var D=24*60,A=15,$=class extends Error{};function _(r,e){if(!(e in r))throw new $(`missing attribute ${e}`);return r[e]}function w(r,e){if(typeof r!="string")throw new $(`${e} is not a string`);return r}function G(r,e){if(typeof r!="number")throw new $(`${e} is not a number`);return r}function st(r,e){return r===null?null:w(r,e)}function ot(r,e){if(!Array.isArray(r))throw new $(`${e} is not a list`);return r}function At(r,e){if(typeof r!="object"||r===null||Array.isArray(r))throw new $(`${e} is not a mapping`);return r}function Pt(r){let e=/^(\d{2}):(\d{2})$/.exec(r);if(e===null)throw new $(`bad time ${r}`);return Number(e[1])*60+Number(e[2])}function P(r){let e=Math.floor(r/60)%24,t=r%60;return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}`}function Re(r){if(r==="unknown"||r==="unavailable")return null;let e=ee.find(t=>t===r);if(e===void 0)throw new $(`unknown mode ${r}`);return e}function ne(r){let e=r.attributes,t=ot(_(e,"profiles"),"profiles").map((u,d)=>{let c=At(u,`profile ${d}`),f=ot(_(c,"slots"),`profile ${d} slots`).map(g=>{let y=At(g,`profile ${d} slot`);return{id:w(_(y,"id"),"slot id"),start:Pt(w(_(y,"start"),"slot start")),setpoint:G(_(y,"setpoint"),"slot setpoint")}});return{id:w(_(c,"id"),"profile id"),name:w(_(c,"name"),"profile name"),slots:f.sort((g,y)=>g.start-y.start)}}),n=ot(_(e,"week"),"week").map(u=>w(u,"week entry"));if(n.length!==rt.length)throw new $(`week has ${n.length} days`);let i=w(_(e,"today_profile"),"today_profile");for(let u of[...n,i])if(!t.some(d=>d.id===u))throw new $(`unknown profile ${u}`);let s=ot(_(e,"proximity"),"proximity").map((u,d)=>{let c=At(u,`proximity ${d}`);return{distance:w(_(c,"distance"),"distance sensor"),direction:w(_(c,"direction"),"direction sensor"),person:st(_(c,"person"),"tracked person")}}),o=st(_(e,"hold_until"),"hold_until"),a=st(_(e,"boost_until"),"boost_until"),l=_(e,"target");return{mode:Re(r.state),profiles:t,week:n,todayProfile:i,activeSlot:st(_(e,"active_slot"),"active_slot"),holdUntil:o===null?null:new Date(o),boostUntil:a===null?null:new Date(a),target:l===null?null:G(l,"target"),configEntryId:w(_(e,"config_entry_id"),"config_entry_id"),climate:w(_(e,"climate_entity"),"climate_entity"),proximity:s,setpointMin:G(_(e,"setpoint_min"),"setpoint_min"),setpointMax:G(_(e,"setpoint_max"),"setpoint_max"),setpointStep:G(_(e,"setpoint_step"),"setpoint_step")}}var He=["schedule","boost","preheat","away_setpoint","away_delay","preheat_radius","resume","all_off"];function at(r,e){let t={schedule:null,boost:null,preheat:null,away_setpoint:null,away_delay:null,preheat_radius:null,resume:null,all_off:null},n=r.entities[e]?.device_id??null;if(n===null)return t;for(let i of Object.values(r.entities)){if(i===void 0||i.platform!=="estia"||i.device_id!==n)continue;let s=He.find(o=>o===i.translation_key);s!==void 0&&(t[s]=i.entity_id)}return t}function ie(r){if(r.length===0)return[];let e=[...r].sort((i,s)=>i.start-s.start),t=[],n=e[e.length-1];return e[0].start>0&&t.push({slot:n,from:0,to:e[0].start}),e.forEach((i,s)=>{let o=s+1<e.length?e[s+1].start:D;t.push({slot:i,from:i.start,to:o})}),t.filter(i=>i.to>i.from)}function re(r,e){let t=[...r].sort((o,a)=>o.start-a.start),n=t.findIndex(o=>o.id===e);if(n<0)throw new $(`no slot ${e}`);let i=n>0?t[n-1].start+A:0,s=n+1<t.length?t[n+1].start-A:D-A;return{min:i,max:s}}function se(r,e){let t=Math.round(r/A)*A;return Math.min(e.max,Math.max(e.min,t))}function oe(r){let e=new Set(r.map(s=>s.start));if(!e.has(12*60))return 12*60;let t=[...e].sort((s,o)=>s-o),n=0,i=null;for(let s=0;s<t.length;s++){let o=t[s],l=(s+1<t.length?t[s+1]:t[0]+D)-o,u=Math.round((o+l/2)/A)*A%D;l>A&&!e.has(u)&&l>n&&(n=l,i=u)}return i}function ae(r,e,t){return`hsl(${(210-210*Math.min(1,Math.max(0,(r-e)/(t-e)))).toFixed(0)}, 70%, 52%)`}function lt(r){return r.getHours()*60+r.getMinutes()}var De=550,Ue=900,Ne=10,Oe=26,S="estia",Ie={home:"var(--success-color, #43a047)",away:"var(--info-color, #039be5)",preheat:"var(--warning-color, #ffa600)",manual:"var(--accent-color, #ff9800)",boost:"var(--error-color, #db4437)",paused:"var(--disabled-text-color, #9e9e9e)",off:"var(--secondary-text-color, #727272)"};function ze(r,e){if(r===void 0)return null;let t=r.attributes[e];return typeof t=="number"?t:null}function dt(r,e){if(r===void 0)return null;let t=r.attributes[e];return typeof t=="string"?t:null}function Le(r){if(r===void 0)return null;let e=Number(r.state);if(r.state===""||!Number.isFinite(e))return null;let t={m:1,km:1e3,mi:1609.344,ft:.3048,yd:.9144},n=dt(r,"unit_of_measurement");return n===null||!(n in t)?null:e*t[n]}function X(r){return`${(r/D*100).toFixed(3)}%`}var J=class extends b{constructor(){super();this._native=new O(()=>this.requestUpdate());this._longPressed=!1;this.hass=void 0,this._config=void 0,this._selected=null,this._drag=null,this._pending=null,this._armedDelete=null,this._error=null,this._editing=!1,this._profile=null,this._naming=null,this._armedProfile=!1}setConfig(t){if(typeof t.entity!="string"||!t.entity.startsWith("sensor."))throw new Error("entity: the Estia mode sensor (sensor.\u2026) is required");this._config=t}getCardSize(){return 6}static getStubConfig(t){let n=Object.values(t.entities).find(i=>i!==void 0&&i.platform===S&&i.entity_id.startsWith("sensor."));return n===void 0?{}:{entity:n.entity_id}}connectedCallback(){super.connectedCallback(),this._clock=window.setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._clock),window.clearTimeout(this._longPress),this._pending!==null&&window.clearTimeout(this._pending.timer)}shouldUpdate(t){return!(this._drag!==null&&t.size===1&&t.has("hass"))}updated(t){t.has("_naming")&&t.get("_naming")===null&&this._naming!==null&&this.renderRoot.querySelector(".profile-tools input")?.focus()}async _call(t,n,i){if(this.hass!==void 0){this._error=null;try{await this.hass.callService(t,n,i)}catch(s){this._error=s instanceof Error?s.message:String(s)}}}_shownProfile(t){let n=this._profile??t.todayProfile,i=t.profiles.find(s=>s.id===n)??t.profiles.find(s=>s.id===t.todayProfile);if(i===void 0)throw new Error(`unknown profile ${t.todayProfile}`);return i}_setSlot(t,n,i,s){return this._call(S,"set_slot",{config_entry_id:t.configEntryId,profile_id:this._shownProfile(t).id,slot_id:n.id,start:P(i),setpoint:s})}_onHandleDown(t,n,i){t.stopPropagation(),t.preventDefault();let s=t.currentTarget.parentElement;if(s===null)return;t.currentTarget.setPointerCapture(t.pointerId);let o=re(this._shownProfile(n).slots,i.id);this._drag={id:i.id,start:i.start,...o,bar:s.getBoundingClientRect()},this._selected=i.id}_onHandleMove(t){let n=this._drag;if(n===null)return;let i=(t.clientX-n.bar.left)/n.bar.width*D,s=se(i,n);s!==n.start&&(this._drag={...n,start:s})}async _onHandleUp(t){let n=this._drag;if(n===null)return;let i=this._shownProfile(t).slots.find(s=>s.id===n.id);i!==void 0&&n.start!==i.start&&await this._setSlot(t,i,n.start,i.setpoint),this._drag=null}_onSegmentDown(t){this._longPressed=!1,window.clearTimeout(this._longPress),this._longPress=window.setTimeout(()=>{this._longPressed=!0,this._selected=t.id,this._armedDelete=t.id},De)}_onSegmentUp(t){window.clearTimeout(this._longPress),!this._longPressed&&(this._armedDelete=null,this._selected=this._selected===t.id?null:t.id)}_shown(t){return this._pending?.id===t.id?this._pending.value:t.setpoint}_setPending(t,n,i){if(!Number.isFinite(i))return;let s=Math.round(i*10)/10,o=Math.min(t.setpointMax,Math.max(t.setpointMin,s));this._pending!==null&&window.clearTimeout(this._pending.timer);let a=window.setTimeout(async()=>{this._pending=null,await this._setSlot(t,n,n.start,o)},Ue);this._pending={id:n.id,value:o,timer:a}}_step(t,n,i){this._setPending(t,n,this._shown(n)+i*t.setpointStep)}_onWheel(t,n,i){t.preventDefault(),this._step(n,i,t.deltaY<0?1:-1)}async _onStartInput(t,n,i){let s=t.target.value;s!==""&&await this._setSlot(n,i,Pt(s.slice(0,5)),i.setpoint)}async _delete(t,n){if(this._armedDelete!==n.id){this._armedDelete=n.id;return}this._armedDelete=null,this._selected=null,await this._call(S,"remove_slot",{config_entry_id:t.configEntryId,profile_id:this._shownProfile(t).id,slot_id:n.id})}async _add(t,n){let i=oe(this._shownProfile(t).slots);if(i===null){this._error=H(this.hass?.language??"en").full;return}let s=ze(n,"temperature")??t.target??t.setpointMin;await this._call(S,"add_slot",{config_entry_id:t.configEntryId,profile_id:this._shownProfile(t).id,start:P(i),setpoint:s})}_pickProfile(t){this._profile=t,this._selected=null,this._armedDelete=null,this._armedProfile=!1,this._naming=null}async _assignDay(t,n){await this._call(S,"assign_day",{config_entry_id:t.configEntryId,profile_id:this._shownProfile(t).id,day:n})}async _saveName(t){let n=this._naming;if(n===null)return;let i=n.value.trim();if(i==="")return;let s=this._shownProfile(t);if(this._naming=null,n.kind==="rename"){await this._call(S,"rename_profile",{config_entry_id:t.configEntryId,profile_id:s.id,name:i});return}await this._call(S,"add_profile",{config_entry_id:t.configEntryId,name:i,copy_from:s.id})}async _deleteProfile(t){if(!this._armedProfile){this._armedProfile=!0;return}let n=this._shownProfile(t).id;this._armedProfile=!1,this._profile=null,this._selected=null,await this._call(S,"remove_profile",{config_entry_id:t.configEntryId,profile_id:n})}render(){if(this.hass===void 0||this._config===void 0)return p;let t=H(this.hass.language),n=this.hass.states[this._config.entity];if(n===void 0||n.state==="unavailable")return h`<ha-card><div class="message">${t.unavailable}: ${this._config.entity}</div></ha-card>`;let i;try{i=ne(n)}catch(u){return h`<ha-card><div class="message error">${this._config.entity}: ${String(u)}</div></ha-card>`}let s=this.hass.states[i.climate],o=this._shownProfile(i),a=this._withDrag(o.slots),l=this._editing?a.find(u=>u.id===this._selected):void 0;return h`
      <ha-card>
        ${this._renderHeader(i,s,t)} ${this._renderActions(i,t)}
        ${this._error===null?p:h`<div class="message error">${this._error}</div>`}
      </ha-card>
      <ha-card>
        <div class="settings-head">
          <span class="section">${t.settings}</span>
          <button class=${this._editing?"primary":""} @click=${()=>this._toggleEditing()}>
            ${this._editing?t.done:t.edit}
          </button>
        </div>
        ${this._renderProfiles(i,o,t)} ${this._renderWeek(i,o,t)}
        ${this._renderTimeline(i,a,o.id===i.todayProfile,t)}
        ${l===void 0?p:this._renderEditor(i,l,t)}
        ${this._editing?p:this._renderSummary(i,t)}
      </ha-card>
      ${this._editing?this._renderControls(t):p}
    `}_toggleEditing(){this._editing=!this._editing,this._selected=null,this._armedDelete=null,this._armedProfile=!1,this._naming=null}_withDrag(t){let n=this._drag;return n===null?t:t.map(i=>i.id===n.id?{...i,start:n.start}:i)}_renderHeader(t,n,i){let s=this._config?.title??dt(n,"friendly_name")??t.climate,o=t.mode;return h`
      <div class="header">
        <div class="title">${s}</div>
        ${o===null?p:h`<span class="badge" style="background:${Ie[o]}">${i.modes[o]}</span>`}
      </div>
      ${o==="boost"&&t.boostUntil!==null?h`<div class="hold"><span>${i.boostUntil(P(lt(t.boostUntil)))}</span></div>`:p}
      ${o==="manual"&&t.holdUntil!==null?h`<div class="hold">
            <span>${i.manualUntil(P(lt(t.holdUntil)))}</span>
            <button
              class="primary"
              @click=${()=>this._call(S,"resume",{config_entry_id:t.configEntryId})}
            >
              ${i.returnToSchedule}
            </button>
          </div>`:p}
      ${o==="paused"?h`<div class="hold"><span>${i.pausedInfo}</span></div>`:p}
      ${o==="off"?h`<div class="hold"><span>${i.offInfo}</span></div>`:p}
    `}_renderActions(t,n){if(this.hass===void 0||this._config===void 0)return p;let i=at(this.hass,this._config.entity),s=t.mode,a=i.schedule!==null&&this.hass.states[i.schedule]?.state==="on"&&s!=="boost"&&s!=="off",l=s==="boost",u=s==="off",d=(c,f,g,y)=>h`<button class="action ${c?"active":""}" @click=${y}>
      <ha-icon .icon=${f}></ha-icon><span>${g}</span>
    </button>`;return h`<div class="actions">
      ${d(a,"mdi:calendar-clock",n.scheduled,async()=>{i.schedule!==null&&await this._call("switch",a?"turn_off":"turn_on",{entity_id:i.schedule})})}
      ${d(l,"mdi:fire",n.boost,async()=>{i.boost!==null&&await this._call("switch",l?"turn_off":"turn_on",{entity_id:i.boost})})}
      ${d(u,"mdi:power",n.allOff,async()=>{i.all_off===null||u||await this._call("button","press",{entity_id:i.all_off})})}
    </div>`}_renderTraveller(t,n){let i=this.hass;if(i===void 0)return p;let s=t.person===null?void 0:i.states[t.person],o=i.states[t.distance],a=i.states[t.direction]?.state,l=dt(s,"friendly_name")??dt(o,"friendly_name")??t.distance,u=Le(o),d,c;if(s?.state==="home"||a==="arrived"||u===0)d="\u{1F3E0}",c=n.travellerHome(l);else if(u===null)d="\u2754",c=n.travellerUnknown(l);else{d=a==="towards"?"\u{1F697}":a==="away_from"?"\u{1F3C3}":"\u{1F4CD}";let f=new Intl.NumberFormat(i.language,{maximumFractionDigits:1}).format(u/1e3),g=a===void 0?"":n.directions[a]??a;c=n.travellerAway(l,`${f} km`,g)}return h`<div class="traveller"><span class="emoji">${d}</span><span>${c}</span></div>`}_renderSummary(t,n){if(this.hass===void 0||this._config===void 0)return p;let i=this.hass,s=at(i,this._config.entity),o=l=>l===null?"\u2014":i.states[l]?.state??"\u2014",a=s.preheat!==null&&i.states[s.preheat]?.state==="on";return h`<div class="summary">
      <div>${n.awaySummary(o(s.away_setpoint),o(s.away_delay))}</div>
      <div>${a?n.preheatSummary(o(s.preheat_radius)):n.preheatOff}</div>
      ${a?t.proximity.map(l=>this._renderTraveller(l,n)):p}
    </div>`}_renderProfiles(t,n,i){let s=t.week.includes(n.id),o=t.profiles.length===1,a=this._naming;return h`
      <div class="chips" role="group" aria-label=${i.profiles}>
        ${t.profiles.map(l=>h`<button
            class="chip ${l.id===n.id?"active":""}"
            @click=${()=>this._pickProfile(l.id)}
          >
            ${l.name}${l.id===t.todayProfile?h` <span class="dot">●</span>`:p}
          </button>`)}
      </div>
      ${this._editing?a===null?h`<div class="profile-tools">
              <button @click=${()=>this._naming={kind:"add",value:""}}>${i.addProfile}</button>
              <button @click=${()=>this._naming={kind:"rename",value:n.name}}>
                ${i.renameProfile}
              </button>
              <button
                class="delete ${this._armedProfile?"armed":""}"
                ?disabled=${s||o}
                title=${s||o?i.profileInUse:i.deleteProfile}
                @click=${()=>this._deleteProfile(t)}
              >
                ${this._armedProfile?i.confirmDelete:i.deleteProfile}
              </button>
            </div>`:h`<div class="profile-tools">
              <input
                type="text"
                placeholder=${i.profileName}
                .value=${a.value}
                @input=${l=>this._naming={kind:a.kind,value:l.target.value}}
                @keydown=${l=>{l.key==="Enter"?this._saveName(t):l.key==="Escape"&&(this._naming=null)}}
              />
              <button class="primary" @click=${()=>this._saveName(t)}>${i.save}</button>
              <button @click=${()=>this._naming=null}>${i.cancel}</button>
            </div>`:p}
    `}_renderWeek(t,n,i){let s=this.hass?.language??"en",o=new Intl.DateTimeFormat(s,{weekday:"short"}),a=(new Date().getDay()+6)%7;return h`<div class="chips week" role="group" aria-label=${i.days}>
      ${rt.map((l,u)=>{let d=t.week[u],c=t.profiles.find(g=>g.id===d);if(c===void 0)throw new Error(`unknown profile ${d}`);let f=o.format(new Date(2026,9,26+u));return h`<button
          class="chip day ${d===n.id?"active":""} ${u===a?"today":""}"
          ?disabled=${!this._editing}
          title=${u===a?`${f} (${i.today})`:f}
          @click=${this._editing?()=>this._assignDay(t,l):p}
        >
          <span class="day-name">${f}</span>
          <span class="day-profile">${c.name}</span>
        </button>`})}
    </div>`}_renderTimeline(t,n,i,s){let o=this._editing,a=lt(new Date),l=Math.min(...n.map(d=>d.setpoint),16),u=Math.max(...n.map(d=>d.setpoint),23);return h`
      <div class="timeline ${this._editing?"editing":""}">
        <div class="bar">
          ${n.length===0?h`<div class="empty">${s.noSlots}</div>`:p}
          ${ie(n).map(d=>{let c=d.slot,f=i&&c.id===t.activeSlot,g=this._shown(c);return h`<div
              class="segment ${f?"active":""} ${c.id===this._selected?"selected":""}"
              style="left:${X(d.from)};width:${X(d.to-d.from)};background:${ae(g,l,u)}"
              @pointerdown=${o?()=>this._onSegmentDown(c):p}
              @pointerup=${o?()=>this._onSegmentUp(c):p}
              @pointerleave=${o?()=>window.clearTimeout(this._longPress):p}
              @contextmenu=${o?y=>y.preventDefault():p}
            >
              ${d.to-d.from>=100?h`<span>${g.toFixed(1)}°</span>`:p}
            </div>`})}
          ${(this._editing?n:[]).map(d=>h`<div
              class="handle ${this._drag?.id===d.id?"dragging":""}"
              style="left:${X(d.start)}"
              title=${P(d.start)}
              @pointerdown=${c=>this._onHandleDown(c,t,d)}
              @pointermove=${c=>this._onHandleMove(c)}
              @pointerup=${()=>this._onHandleUp(t)}
              @pointercancel=${()=>this._drag=null}
            >
              ${this._drag?.id===d.id?h`<span class="tip">${P(d.start)}</span>`:p}
            </div>`)}
          ${i?h`<div class="now" style="left:${X(a)}"></div>`:p}
        </div>
        <div class="ticks">
          ${[0,6,12,18,24].map(d=>h`<span style="left:${X(d*60)}">${d}</span>`)}
        </div>
        ${this._editing?h`<button
              class="add"
              title=${s.addSlot}
              @click=${()=>this._add(t,this.hass?.states[t.climate])}
            >
              +
            </button>`:p}
      </div>
    `}_renderEditor(t,n,i){let s=this._shown(n),o=this._armedDelete===n.id;return h`
      <div class="editor">
        <label>
          <span class="label">${i.start}</span>
          <input
            type="time"
            step="900"
            .value=${P(n.start)}
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
              .value=${s.toFixed(1)}
              @change=${a=>this._setPending(t,n,Number(a.target.value))}
            />
            <span class="big">°</span>
            <button @click=${()=>this._step(t,n,1)}>+</button>
          </div>
          <input
            class="slider"
            type="range"
            min=${Ne}
            max=${Oe}
            step=${t.setpointStep}
            .value=${String(s)}
            @input=${a=>this._setPending(t,n,Number(a.target.value))}
          />
        </div>
        <button class="delete ${o?"armed":""}" @click=${()=>this._delete(t,n)}>
          ${o?i.confirmDelete:i.deleteSlot}
        </button>
      </div>
    `}_renderControls(t){if(this.hass===void 0||this._config===void 0)return p;let n=at(this.hass,this._config.entity),i=(a,l)=>a===null?[]:[{entity:a,name:l}],s=[...i(n.away_setpoint,t.awaySetpoint),...i(n.away_delay,t.awayDelay),...i(n.preheat,t.preheat),...i(n.preheat_radius,t.preheatRadius).map(a=>n.preheat===null?a:{type:"conditional",conditions:[{condition:"state",entity:n.preheat,state:"on"}],row:a})],o=this._native.get({type:"entities",entities:s},this.hass);return o===null?p:h`<div class="controls">${o}</div>`}};J.properties={hass:{attribute:!1},_config:{state:!0},_selected:{state:!0},_drag:{state:!0},_pending:{state:!0},_armedDelete:{state:!0},_error:{state:!0},_editing:{state:!0},_profile:{state:!0},_naming:{state:!0},_armedProfile:{state:!0}},J.styles=k`
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
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .chip {
      min-height: 40px;
      border: 2px solid transparent;
    }
    .chip.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .chip .dot {
      font-size: 0.6em;
      vertical-align: middle;
    }
    .week {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
    }
    .day {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6px 2px;
      border-radius: 12px;
      min-width: 0;
    }
    .day:disabled {
      cursor: default;
      opacity: 1;
    }
    .day.today .day-name {
      text-decoration: underline;
    }
    .day-name {
      font-weight: 500;
    }
    .day-profile {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.8em;
    }
    .profile-tools {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
    }
    .profile-tools input {
      flex: 1 1 160px;
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
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
