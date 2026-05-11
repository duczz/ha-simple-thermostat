!function(){const e={DEBUG:!1,BUILD_TIME:"11.05.2026, 11:23"};try{if(process)return process.env=Object.assign({},process.env),void Object.assign(process.env,e)}catch(e){}globalThis.process={env:e}}();var e="simple-thermostat",t="2.3.1";const i=globalThis,s=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),o=new WeakMap;let a=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(t,e))}return e}toString(){return this.cssText}};const r=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,f=globalThis,g=f.trustedTypes,m=g?g.emptyScript:"",v=f.reactiveElementPolyfillSupport,y=(e,t)=>e,_={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},$=(e,t)=>!l(e,t),b={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=b){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:n}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const o=s?.call(this);n?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??b}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const e=this.properties,t=[...d(e),...u(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(r(e))}else void 0!==e&&t.push(r(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(s)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of t){const t=document.createElement("style"),n=i.litNonce;void 0!==n&&t.setAttribute("nonce",n),t.textContent=s.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(t,i.type);this._$Em=e,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:_;this._$Em=s;const o=n.fromAttribute(t,e.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,i,s=!1,n){if(void 0!==e){const o=this.constructor;if(!1===s&&(n=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??$)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==n||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[y("elementProperties")]=new Map,x[y("finalized")]=new Map,v?.({ReactiveElement:x}),(f.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=e=>e,E=w.trustedTypes,S=E?E.createPolicy("lit-html",{createHTML:e=>e}):void 0,k="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+T,O=`<${C}>`,z=document,P=()=>z.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,j=Array.isArray,U="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,V=/>/g,I=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),M=/'/g,D=/"/g,F=/^(?:script|style|textarea|title)$/i,L=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),B=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,J=z.createTreeWalker(z,129);function Y(e,t){if(!j(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const G=(e,t)=>{const i=e.length-1,s=[];let n,o=2===t?"<svg>":3===t?"<math>":"",a=H;for(let t=0;t<i;t++){const i=e[t];let r,l,c=-1,h=0;for(;h<i.length&&(a.lastIndex=h,l=a.exec(i),null!==l);)h=a.lastIndex,a===H?"!--"===l[1]?a=R:void 0!==l[1]?a=V:void 0!==l[2]?(F.test(l[2])&&(n=RegExp("</"+l[2],"g")),a=I):void 0!==l[3]&&(a=I):a===I?">"===l[0]?(a=n??H,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?I:'"'===l[3]?D:M):a===D||a===M?a=I:a===R||a===V?a=H:(a=I,n=void 0);const d=a===I&&e[t+1].startsWith("/>")?" ":"";o+=a===H?i+O:c>=0?(s.push(r),i.slice(0,c)+k+i.slice(c)+T+d):i+T+(-2===c?t:d)}return[Y(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class K{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,o=0;const a=e.length-1,r=this.parts,[l,c]=G(e,t);if(this.el=K.createElement(l,i),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=J.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(k)){const t=c[o++],i=s.getAttribute(e).split(T),a=/([.?@])?(.*)/.exec(t);r.push({type:1,index:n,name:a[2],strings:i,ctor:"."===a[1]?te:"?"===a[1]?ie:"@"===a[1]?se:ee}),s.removeAttribute(e)}else e.startsWith(T)&&(r.push({type:6,index:n}),s.removeAttribute(e));if(F.test(s.tagName)){const e=s.textContent.split(T),t=e.length-1;if(t>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],P()),J.nextNode(),r.push({type:2,index:++n});s.append(e[t],P())}}}else if(8===s.nodeType)if(s.data===C)r.push({type:2,index:n});else{let e=-1;for(;-1!==(e=s.data.indexOf(T,e+1));)r.push({type:7,index:n}),e+=T.length-1}n++}}static createElement(e,t){const i=z.createElement("template");return i.innerHTML=e,i}}function Z(e,t,i=e,s){if(t===B)return t;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=N(t)?void 0:t._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(e),n._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(t=Z(e,n._$AS(e,t.values),n,s)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??z).importNode(t,!0);J.currentNode=s;let n=J.nextNode(),o=0,a=0,r=i[0];for(;void 0!==r;){if(o===r.index){let t;2===r.type?t=new X(n,n.nextSibling,this,e):1===r.type?t=new r.ctor(n,r.name,r.strings,this,e):6===r.type&&(t=new ne(n,this,e)),this._$AV.push(t),r=i[++a]}o!==r?.index&&(n=J.nextNode(),o++)}return J.currentNode=z,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),N(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>j(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(z.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=K.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Q(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new K(e)),t}k(e){j(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const n of e)s===t.length?t.push(i=new X(this.O(P()),this.O(P()),this,this.options)):i=t[s],i._$AI(n),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(e,t=this,i,s){const n=this.strings;let o=!1;if(void 0===n)e=Z(this,e,t,0),o=!N(e)||e!==this._$AH&&e!==B,o&&(this._$AH=e);else{const s=e;let a,r;for(e=n[0],a=0;a<n.length-1;a++)r=Z(this,s[i+a],t,a),r===B&&(r=this._$AH[a]),o||=!N(r)||r!==this._$AH[a],r===W?e=W:e!==W&&(e+=(r??"")+n[a+1]),this._$AH[a]=r}o&&!s&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class se extends ee{constructor(e,t,i,s,n){super(e,t,i,s,n),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??W)===B)return;const i=this._$AH,s=e===W&&i!==W||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const oe=w.litHtmlPolyfillSupport;oe?.(K,X),(w.litHtmlVersions??=[]).push("3.3.2");const ae=globalThis;let re=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let n=s._$litPart$;if(void 0===n){const e=i?.renderBefore??null;s._$litPart$=n=new X(t.insertBefore(P(),e),e,void 0,i??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}};re._$litElement$=!0,re.finalized=!0,ae.litElementHydrateSupport?.({LitElement:re});const le=ae.litElementPolyfillSupport;le?.({LitElement:re}),(ae.litElementVersions??=[]).push("4.2.2");var ce=((e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new a(i,e,n)})`:host {
  --st-default-spacing: 4px;
  --st-default-mode-radius: var(--ha-card-border-radius, 4px);
  --st-default-mode-transition: 200ms ease;
  --st-default-icon-color: var(--state-icon-color, var(--secondary-text-color));
}
ha-card {
  font-size: 14px;
  font-size: var(--ha-font-size-m, var(--body-font-size, 14px));
  line-height: 20px;
  line-height: var(--ha-line-height-normal, var(--body-line-height, 20px));
  -webkit-font-smoothing: antialiased;
  -webkit-font-smoothing: var(--ha-font-smoothing, antialiased);

  padding-left: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
  padding-right: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
  padding-bottom: calc(var(--st-spacing, var(--st-default-spacing)) * 2);

  --auto-color: green;
  --heat_cool-color: springgreen;
  --cool-color: #2b9af9;
  --heat-color: #ff8100;
  --off-color: #8a8a8a;
  --fan_only-color: #8a8a8a;
  --dry-color: #efbd07;
}

ha-card.no-header {
  padding: calc(var(--st-spacing, var(--st-default-spacing)) * 4) 0;
}
ha-card.unavailable,
ha-card.unknown {
  opacity: 0.6;
  pointer-events: none;
}
ha-card.loading {
  min-height: 80px;
  background: linear-gradient(
    90deg,
    var(--card-background-color) 0%,
    var(--secondary-background-color) 50%,
    var(--card-background-color) 100%
  );
  background-size: 200% 100%;
  animation: st-shimmer 1.4s infinite linear;
}
@keyframes st-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

ha-icon-button ha-icon {
  display: flex;
}

.body {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, auto);
  align-items: center;
  justify-items: center;
  place-items: center;
  padding: 0 calc(var(--st-spacing, var(--st-default-spacing)) * 4);
  padding-bottom: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
}

.toggle-label {
  color: var(--st-toggle-label-color, var(--primary-text-color));
  margin-right: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
  font-size: 16px;
  font-size: var(--st-font-size-toggle-label, var(--ha-font-size-l, 16px));
}
.toggle-icon {
  margin-right: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
  color: var(--state-icon-color, var(--secondary-text-color));
  --mdc-icon-size: 20px;
}

.faults {
  display: flex;
  flex-direction: row;
  margin-left: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
}
.fault-icon {
  padding: 2px;
  cursor: pointer;
  color: var(--st-fault-inactive-color, var(--secondary-background-color));
}
.fault-icon.active {
    color: var(--st-fault-active-color, var(--accent-color));
  }
.fault-icon.hide {
    display: none;
  }

.sensors {
  display: grid;
  grid-gap: 0 var(--st-spacing, var(--st-default-spacing));
  gap: 0 var(--st-spacing, var(--st-default-spacing));
  font-size: 16px;
  font-size: var(--st-font-size-sensors, var(--ha-font-size-l, 16px));
  line-height: 1.4;
}
.sensors.as-list {
  grid-auto-flow: column;
  grid-template-columns: min-content;
}

.sensors.as-table.without-labels {
    grid: auto-flow / 100%;
    align-items: start;
    justify-items: start;
    place-items: start;
  }

.sensors.as-table.with-labels {
    grid: auto-flow / auto auto;
    align-items: start;
    justify-items: start;
    place-items: start;
  }

.sensor-value {
  display: flex;
  align-items: center;
}
.sensor-heading {
  font-weight: 300;
  padding-right: 8px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.sensors:empty {
  display: none;
}
header {
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: calc(var(--st-spacing, var(--st-default-spacing)) * 4)
    calc(var(--st-spacing, var(--st-default-spacing)) * 4)
    calc(var(--st-spacing, var(--st-default-spacing)) * 3);
}
.header__clickable {
  display: flex;
}
.header__toggle {
  margin-left: auto;
}
.header__icon {
  margin-right: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
  color: #44739e;
  color: var(--st-header-icon-color, var(--state-icon-color, #44739e));
}
.header__title {
  font-size: 24px;
  font-size: var(--st-font-size-title, var(--ha-card-header-font-size, 24px));
  line-height: 24px;
  line-height: var(--st-font-size-title, var(--ha-card-header-font-size, 24px));
  font-weight: normal;
  margin: 0;
  align-self: flex-start;
}
.current-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  flex-wrap: wrap;
}
.current-wrapper.row {
    flex-direction: row-reverse;
  }
.current--value {
  display: flex;
  align-items: center;
  margin: 0;
  font-weight: 400;
  line-height: max(28px, min(6vw, 34px));
  line-height: var(--st-font-size-l, max(28px, min(6vw, 34px)));
  font-size: max(28px, min(6vw, 34px));
  font-size: var(--st-font-size-l, max(28px, min(6vw, 34px)));
  cursor: pointer;
  transition: color 200ms ease;
}
@media (min-width: 768px) {
.current--value {
    font-size: max(34px, min(5vw, 45px));
    font-size: var(--st-font-size-xl, max(34px, min(5vw, 45px)));
    line-height: max(34px, min(5vw, 45px));
    line-height: var(--st-font-size-xl, max(34px, min(5vw, 45px)));
}
  }
.current--value.updating {
    color: var(--error-color);
  }
.current--value:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 4px;
  }
.current--unit {
  font-size: 20px;
  font-size: var(--st-font-size-m, 20px);
}
.thermostat-trigger {
  padding: 0;
}
.clickable {
  cursor: pointer;
}
.modes {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  grid-gap: 4px;
  gap: 4px;
  margin-top: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
  padding: var(--st-spacing, var(--st-default-spacing))
    calc(var(--st-spacing, var(--st-default-spacing)) * 4);
  box-sizing: border-box;
}
.modes.heading {
    grid-template-columns: min-content;
  }
.mode-title {
  padding: 0 16px;
  align-self: center;
  justify-self: center;
  place-self: center;
  font-size: 16px;
  font-size: var(--st-font-size-sensors, var(--ha-font-size-l, 16px));
  font-weight: 300;
  white-space: nowrap;
}
.mode-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: center;
  gap: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
  min-height: 24px;
  padding: calc(var(--st-spacing, var(--st-default-spacing)) * 2)
    calc(var(--st-spacing, var(--st-default-spacing)) * 3);
  text-transform: capitalize;
  background: var(--st-mode-background, var(--secondary-background-color));
  color: var(--st-mode-color, var(--secondary-text-color));
  cursor: pointer;
  border-radius: var(--st-mode-border-radius, var(--st-default-mode-radius));
  transition:
    background-color var(--st-mode-transition, var(--st-default-mode-transition)), color var(--st-mode-transition, var(--st-default-mode-transition)), transform 100ms ease;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.mode-item:hover {
    color: var(--st-mode-active-color, var(--primary-text-color));
  }
.mode-item:active {
    transform: scale(0.97);
  }
.mode-item:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
.mode-item.active,.mode-item.active:hover {
    background: var(--st-mode-active-background, var(--primary-color));
    color: var(--st-mode-active-color, var(--text-primary-color));
  }
.mode-item.active.off {
    background: var(--st-mode-active-background, var(--off-color));
  }
.mode-item.active.heat {
    background: var(--st-mode-active-background, var(--heat-color));
  }
.mode-item.active.cool {
    background: var(--st-mode-active-background, var(--cool-color));
  }
.mode-item.active.heat_cool {
    background: var(--st-mode-active-background, var(--heat_cool-color));
  }
.mode-item.active.auto {
    background: var(--st-mode-active-background, var(--auto-color));
  }
.mode-item.active.dry {
    background: var(--st-mode-active-background, var(--dry-color));
  }
.mode-item.active.fan_only {
    background: var(--st-mode-active-background, var(--fan_only-color));
  }
.mode-icon {
  --mdc-icon-size: 24px;
  --ha-icon-display: block;
  display: block;
}
.card-config ha-switch {
  padding: 16px 6px;
}
.side-by-side {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 8px;
}
.side-by-side > * {
  flex: 1;
  min-width: 0;
}
.card-config {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card-config > ha-selector {
  margin-bottom: 4px;
}
.panel-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 8px 12px;
}
.editor-switches {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0 16px;
}
.editor-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0 4px;
  flex-wrap: wrap;
  border-top: 1px solid #e0e0e0;
  border-top: 1px solid var(--divider-color, #e0e0e0);
  margin-top: 8px;
}
.editor-footer__hint {
  font-size: 12px;
  font-size: var(--ha-font-size-s, 12px);
  color: var(--secondary-text-color);
}
.editor-footer__version {
  font-size: 12px;
  font-size: var(--ha-font-size-s, 12px);
  color: var(--disabled-text-color);
  margin-left: auto;
}
.section-label {
  font-size: 12px;
  font-size: var(--ha-font-size-s, 12px);
  font-weight: 500;
  color: var(--secondary-text-color);
  margin: 12px 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.styles-hint {
  font-size: 12px;
  font-size: var(--ha-font-size-s, 12px);
  color: var(--secondary-text-color);
  margin: 4px 0 8px;
}
.styles-hint code {
  font-family: monospace;
  font-family: var(--code-font-family, monospace);
  background: var(--secondary-background-color);
  padding: 1px 4px;
  border-radius: 3px;
}
.styles-editor {
  border: 1px solid #e0e0e0;
  border: 1px solid var(--divider-color, #e0e0e0);
  border-radius: 4px;
  overflow: hidden;
  background: var(--code-editor-background-color, var(--card-background-color));
}
.styles-editor ha-code-editor {
  display: block;
  min-height: 140px;
  --code-mirror-max-height: 360px;
}
`;function he(e,t,i,s={}){i=null==i?{}:i;const n=new Event(t,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return n.detail=i,e.dispatchEvent(n),n}!function(e,t){void 0===t&&(t={});var i=t.insertAt;if(e&&"undefined"!=typeof document){var s=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css","top"===i&&s.firstChild?s.insertBefore(n,s.firstChild):s.appendChild(n),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e))}}(ce);const de=process.env.BUILD_TIME;const ue=["decimals","step_size"],pe={header:{},layout:{mode:{}}},fe=e=>JSON.parse(JSON.stringify(e));function ge(e,t,i,s){var n,o=arguments.length,a=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,s);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(a=(o<3?n(a):o>3?n(t,i,a):n(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a}"function"==typeof SuppressedError&&SuppressedError;const me={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:$},ve=(e=me,t,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,n,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];t.call(this,i),this.requestUpdate(s,n,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ye(e){return function(e){return(t,i)=>"object"==typeof i?ve(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}({...e,state:!0,attribute:!1})}const _e=(e,t,i,s)=>{if("length"===i||"prototype"===i)return;if("arguments"===i||"caller"===i)return;const n=Object.getOwnPropertyDescriptor(e,i),o=Object.getOwnPropertyDescriptor(t,i);!$e(n,o)&&s||Object.defineProperty(e,i,o)},$e=function(e,t){return void 0===e||e.configurable||e.writable===t.writable&&e.enumerable===t.enumerable&&e.configurable===t.configurable&&(e.writable||e.value===t.value)},be=(e,t)=>`/* Wrapped ${e}*/\n${t}`,xe=Object.getOwnPropertyDescriptor(Function.prototype,"toString"),we=Object.getOwnPropertyDescriptor(Function.prototype.toString,"name");function Ae(e,t,{ignoreNonConfigurable:i=!1}={}){const{name:s}=e;for(const s of Reflect.ownKeys(t))_e(e,t,s,i);return((e,t)=>{const i=Object.getPrototypeOf(t);i!==Object.getPrototypeOf(e)&&Object.setPrototypeOf(e,i)})(e,t),((e,t,i)=>{const s=""===i?"":`with ${i.trim()}() `,n=be.bind(null,s,t.toString());Object.defineProperty(n,"name",we);const{writable:o,enumerable:a,configurable:r}=xe;Object.defineProperty(e,"toString",{value:n,writable:o,enumerable:a,configurable:r})})(e,t,s),e}const Ee=(e,t={})=>{if("function"!=typeof e)throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);const{wait:i=0,maxWait:s=Number.POSITIVE_INFINITY,before:n=!1,after:o=!0}=t;if(i<0||s<0)throw new RangeError("`wait` and `maxWait` must not be negative.");if(!n&&!o)throw new Error("Both `before` and `after` are false, function wouldn't be called.");let a,r,l;const c=function(...t){const c=this,h=()=>{r=void 0,a&&(clearTimeout(a),a=void 0),o&&(l=e.apply(c,t))},d=n&&!a;return clearTimeout(a),a=setTimeout(()=>{a=void 0,r&&(clearTimeout(r),r=void 0),o&&(l=e.apply(c,t))},i),s>0&&s!==Number.POSITIVE_INFINITY&&!r&&(r=setTimeout(h,s)),d&&(l=e.apply(c,t)),l};return Ae(c,e),c.cancel=()=>{a&&(clearTimeout(a),a=void 0),r&&(clearTimeout(r),r=void 0)},c};function Se(e,{decimals:t=1,fallback:i="N/A",locale:s}={}){if(null===e||""===e||["boolean","undefined"].includes(typeof e))return i;const n=Number(e);return Number.isNaN(n)?i:s?"decimal_comma"===s.number_format||"space_comma"===s.number_format?n.toFixed(t).replace(".",","):"comma_decimal"===s.number_format||"none"===s.number_format?n.toFixed(t):new Intl.NumberFormat("system"===s.number_format?void 0:s.language,{minimumFractionDigits:t,maximumFractionDigits:t}).format(n):n.toFixed(t)}function ke({header:e,toggleEntityChanged:t,entity:i,openEntityPopover:s}){if(!1===e)return W;const n=i.attributes.hvac_action||i.state;let o=e.icon;"object"==typeof e.icon&&(o=o?.[n]??!1);const a=e?.name??!1;return L`
    <header>
      <div
        class="clickable header__clickable"
        @click=${()=>s()}
      >
        ${function(e){return e?L` <ha-icon class="header__icon" .icon=${e}></ha-icon> `:W}(o)} ${function(e){return e?L`<h2 class="header__title">${e}</h2>`:W}(a)}
      </div>
      ${function(e,t){if(!e?.length)return W;const i=e.map(({icon:e,hide_inactive:i,state:s})=>L` <ha-icon
      class="fault-icon ${"on"===s?.state?"active":i?"hide":""}"
      .icon=${e||s?.attributes?.icon}
      @click="${()=>t(s?.entity_id)}"
    ></ha-icon>`);return L` <div class="faults">${i}</div>`}(e.faults,s)}
      ${function(e,t,i){return e?L`
    <div class="header__toggle">
      ${!1!==e.icon?L`<ha-icon class="toggle-icon" .icon=${e.icon}></ha-icon>`:W}
      <span
        class="clickable toggle-label"
        @click=${()=>t(e.entity?.entity_id)}
        >${e.label}
      </span>
      <ha-switch
        .checked=${"on"===e.entity?.state}
        @change=${i}
      ></ha-switch>
    </div>
  `:W}(e.toggle,s,t)}
    </header>
  `}var Te,Ce={exports:{}};function Oe(){return Te||(Te=1,function(e){function t(e){var i,s,n=new Error(e);return i=n,s=t.prototype,Object.setPrototypeOf?Object.setPrototypeOf(i,s):i.__proto__=s,n}function i(e,i,s){var n=i.slice(0,s).split(/\n/),o=n.length,a=n[o-1].length+1;throw t(e+=" at line "+o+" col "+a+":\n\n  "+i.split(/\n/)[o-1]+"\n  "+Array(a).join(" ")+"^")}t.prototype=Object.create(Error.prototype,{name:{value:"Squirrelly Error",enumerable:!1}});var s=new Function("return this")().Promise,n=!1;try{n=new Function("return (async function(){}).constructor")()}catch(e){if(!(e instanceof SyntaxError))throw e}function o(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function a(e,t,i){for(var s in t)o(t,s)&&(null==t[s]||"object"!=typeof t[s]||"storage"!==s&&"prefixes"!==s||i?e[s]=t[s]:e[s]=a({},t[s]));return e}var r=/^async +/,l=/`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g,c=/'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g,h=/"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g,d=/[.*+\-?^${}()|[\]\\]/g;function u(e){return d.test(e)?e.replace(d,"\\$&"):e}function p(e,s){s.rmWhitespace&&(e=e.replace(/[\r\n]+/g,"\n").replace(/^\s+|\s+$/gm,"")),l.lastIndex=0,c.lastIndex=0,h.lastIndex=0;var n=s.prefixes,o=[n.h,n.b,n.i,n.r,n.c,n.e].reduce(function(e,t){return e&&t?e+"|"+u(t):t?u(t):e},""),a=new RegExp("([|()]|=>)|('|\"|`|\\/\\*)|\\s*((\\/)?(-|_)?"+u(s.tags[1])+")","g"),d=new RegExp("([^]*?)"+u(s.tags[0])+"(-|_)?\\s*("+o+")?\\s*","g"),p=0,f=!1;function g(t,n){var o,u={f:[]},g=0,m="c";function v(t){var n=e.slice(p,t),o=n.trim();if("f"===m)"safe"===o?u.raw=!0:s.async&&r.test(o)?(o=o.replace(r,""),u.f.push([o,"",!0])):u.f.push([o,""]);else if("fp"===m)u.f[u.f.length-1][1]+=o;else if("err"===m){if(o){var a=n.search(/\S/);i("invalid syntax",e,p+a)}}else u[m]=o;p=t+1}for("h"===n||"b"===n||"c"===n?m="n":"r"===n&&(u.raw=!0,n="i"),a.lastIndex=p;null!==(o=a.exec(e));){var y=o[1],_=o[2],$=o[3],b=o[4],x=o[5],w=o.index;if(y)"("===y?(0===g&&("n"===m?(v(w),m="p"):"f"===m&&(v(w),m="fp")),g++):")"===y?0===--g&&"c"!==m&&(v(w),m="err"):0===g&&"|"===y?(v(w),m="f"):"=>"===y&&(v(w),p+=1,m="res");else if(_)if("/*"===_){var A=e.indexOf("*/",a.lastIndex);-1===A&&i("unclosed comment",e,o.index),a.lastIndex=A+2}else"'"===_?(c.lastIndex=o.index,c.exec(e)?a.lastIndex=c.lastIndex:i("unclosed string",e,o.index)):'"'===_?(h.lastIndex=o.index,h.exec(e)?a.lastIndex=h.lastIndex:i("unclosed string",e,o.index)):"`"===_&&(l.lastIndex=o.index,l.exec(e)?a.lastIndex=l.lastIndex:i("unclosed string",e,o.index));else if($)return v(w),p=w+o[0].length,d.lastIndex=p,f=x,b&&"h"===n&&(n="s"),u.t=n,u}return i("unclosed tag",e,t),u}var m=function o(a,l){a.b=[],a.d=[];var c,h=!1,u=[];function m(e,t){e&&(e=function(e,t,i,s){var n,o;return"string"==typeof t.autoTrim?n=o=t.autoTrim:Array.isArray(t.autoTrim)&&(n=t.autoTrim[1],o=t.autoTrim[0]),(i||!1===i)&&(n=i),(s||!1===s)&&(o=s),"slurp"===n&&"slurp"===o?e.trim():("_"===n||"slurp"===n?e=String.prototype.trimLeft?e.trimLeft():e.replace(/^[\s\uFEFF\xA0]+/,""):"-"!==n&&"nl"!==n||(e=e.replace(/^(?:\n|\r|\r\n)/,"")),"_"===o||"slurp"===o?e=String.prototype.trimRight?e.trimRight():e.replace(/[\s\uFEFF\xA0]+$/,""):"-"!==o&&"nl"!==o||(e=e.replace(/(?:\n|\r|\r\n)$/,"")),e)}(e,s,f,t))&&(e=e.replace(/\\|'/g,"\\$&").replace(/\r\n|\n|\r/g,"\\n"),u.push(e))}for(;null!==(c=d.exec(e));){var v,y=c[1],_=c[2],$=c[3]||"";for(var b in n)if(n[b]===$){v=b;break}m(y,_),p=c.index+c[0].length,v||i("unrecognized tag type: "+$,e,p);var x=g(c.index,v),w=x.t;if("h"===w){var A=x.n||"";s.async&&r.test(A)&&(x.a=!0,x.n=A.replace(r,"")),x=o(x),u.push(x)}else if("c"===w){if(a.n===x.n)return h?(h.d=u,a.b.push(h)):a.d=u,a;i("Helper start and end don't match",e,c.index+c[0].length)}else if("b"===w){h?(h.d=u,a.b.push(h)):a.d=u;var E=x.n||"";s.async&&r.test(E)&&(x.a=!0,x.n=E.replace(r,"")),h=x,u=[]}else if("s"===w){var S=x.n||"";s.async&&r.test(S)&&(x.a=!0,x.n=S.replace(r,"")),u.push(x)}else u.push(x)}if(!l)throw t('unclosed helper "'+a.n+'"');return m(e.slice(p,e.length),!1),a.d=u,a}({f:[]},!0);if(s.plugins)for(var v=0;v<s.plugins.length;v++){var y=s.plugins[v];y.processAST&&(m.d=y.processAST(m.d,s))}return m.d}function f(e,t){var i=p(e,t),s="var tR='';"+(t.useWith?"with("+t.varName+"||{}){":"")+_(i,t)+"if(cb){cb(null,tR)} return tR"+(t.useWith?"}":"");if(t.plugins)for(var n=0;n<t.plugins.length;n++){var o=t.plugins[n];o.processFnString&&(s=o.processFnString(s,t))}return s}function g(e,t){for(var i=0;i<t.length;i++){var s=t[i][0],n=t[i][1];e=(t[i][2]?"await ":"")+"c.l('F','"+s+"')("+e,n&&(e+=","+n),e+=")"}return e}function m(e,t,i,s,n,o){var a="{exec:"+(n?"async ":"")+y(i,t,e)+",params:["+s+"]";return o&&(a+=",name:'"+o+"'"),n&&(a+=",async:true"),a+"}"}function v(e,t){for(var i="[",s=0;s<e.length;s++){var n=e[s];i+=m(t,n.res||"",n.d,n.p||"",n.a,n.n),s<e.length&&(i+=",")}return i+"]"}function y(e,t,i){return"function("+t+"){var tR='';"+_(e,i)+"return tR}"}function _(e,t){for(var i=0,s=e.length,n="";i<s;i++){var o=e[i];if("string"==typeof o)n+="tR+='"+o+"';";else{var a=o.t,r=o.c||"",l=o.f,c=o.n||"",h=o.p||"",d=o.res||"",u=o.b,p=!!o.a;if("i"===a){t.defaultFilter&&(r="c.l('F','"+t.defaultFilter+"')("+r+")");var f=g(r,l);!o.raw&&t.autoEscape&&(f="c.l('F','e')("+f+")"),n+="tR+="+f+";"}else if("h"===a)if(t.storage.nativeHelpers.get(c))n+=t.storage.nativeHelpers.get(c)(o,t);else{var y=(p?"await ":"")+"c.l('H','"+c+"')("+m(t,d,o.d,h,p);y+=u?","+v(u,t):",[]",n+="tR+="+g(y+=",c)",l)+";"}else"s"===a?n+="tR+="+g((p?"await ":"")+"c.l('H','"+c+"')({params:["+h+"]},[],c)",l)+";":"e"===a&&(n+=r+"\n")}}return n}var $=function(){function e(e){this.cache=e}return e.prototype.define=function(e,t){this.cache[e]=t},e.prototype.get=function(e){return this.cache[e]},e.prototype.remove=function(e){delete this.cache[e]},e.prototype.reset=function(){this.cache={}},e.prototype.load=function(e){a(this.cache,e,!0)},e}();function b(e,i,s,n){if(i&&i.length>0)throw t((n?"Native":"")+"Helper '"+e+"' doesn't accept blocks");if(s&&s.length>0)throw t((n?"Native":"")+"Helper '"+e+"' doesn't accept filters")}var x={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function w(e){return x[e]}var A=new $({}),E=new $({each:function(e,t){var i="",s=e.params[0];if(b("each",t,!1),e.async)return new Promise(function(t){!function e(t,i,s,n,o){s(t[i],i).then(function(a){n+=a,i===t.length-1?o(n):e(t,i+1,s,n,o)})}(s,0,e.exec,i,t)});for(var n=0;n<s.length;n++)i+=e.exec(s[n],n);return i},foreach:function(e,t){var i=e.params[0];if(b("foreach",t,!1),e.async)return new Promise(function(t){!function e(t,i,s,n,o,a){n(i[s],t[i[s]]).then(function(r){o+=r,s===i.length-1?a(o):e(t,i,s+1,n,o,a)})}(i,Object.keys(i),0,e.exec,"",t)});var s="";for(var n in i)o(i,n)&&(s+=e.exec(n,i[n]));return s},include:function(e,i,s){b("include",i,!1);var n=s.storage.templates.get(e.params[0]);if(!n)throw t('Could not fetch template "'+e.params[0]+'"');return n(e.params[1],s)},extends:function(e,i,s){var n=e.params[1]||{};n.content=e.exec();for(var o=0;o<i.length;o++){var a=i[o];n[a.name]=a.exec()}var r=s.storage.templates.get(e.params[0]);if(!r)throw t('Could not fetch template "'+e.params[0]+'"');return r(n,s)},useScope:function(e,t){return b("useScope",t,!1),e.exec(e.params[0])}}),S=new $({if:function(e,t){b("if",!1,e.f,!0);var i="if("+e.p+"){"+_(e.d,t)+"}";if(e.b)for(var s=0;s<e.b.length;s++){var n=e.b[s];"else"===n.n?i+="else{"+_(n.d,t)+"}":"elif"===n.n&&(i+="else if("+n.p+"){"+_(n.d,t)+"}")}return i},try:function(e,i){if(b("try",!1,e.f,!0),!e.b||1!==e.b.length||"catch"!==e.b[0].n)throw t("native helper 'try' only accepts 1 block, 'catch'");var s="try{"+_(e.d,i)+"}",n=e.b[0];return s+"catch"+(n.res?"("+n.res+")":"")+"{"+_(n.d,i)+"}"},block:function(e,t){return b("block",e.b,e.f,!0),"if(!"+t.varName+"["+e.p+"]){tR+=("+y(e.d,"",t)+")()}else{tR+="+t.varName+"["+e.p+"]}"}}),k=new $({e:function(e){var t=String(e);return/[&<>"']/.test(t)?t.replace(/[&<>"']/g,w):t}}),T={varName:"it",autoTrim:[!1,"nl"],autoEscape:!0,defaultFilter:!1,tags:["{{","}}"],l:function(e,i){if("H"===e){var s=this.storage.helpers.get(i);if(s)return s;throw t("Can't find helper '"+i+"'")}if("F"===e){var n=this.storage.filters.get(i);if(n)return n;throw t("Can't find filter '"+i+"'")}},async:!1,storage:{helpers:E,nativeHelpers:S,filters:k,templates:A},prefixes:{h:"@",b:"#",i:"",r:"*",c:"/",e:"!"},cache:!1,plugins:[],useWith:!1};function C(e,t){var i={};return a(i,T),t&&a(i,t),e&&a(i,e),i.l.bind(i),i}function O(e,i){var s=C(i||{}),o=Function;if(s.async){if(!n)throw t("This environment doesn't support async/await");o=n}try{return new o(s.varName,"c","cb",f(e,s))}catch(i){throw i instanceof SyntaxError?t("Bad template syntax\n\n"+i.message+"\n"+Array(i.message.length+1).join("=")+"\n"+f(e,s)):i}}function z(e,t){var i;return t.cache&&t.name&&t.storage.templates.get(t.name)?t.storage.templates.get(t.name):(i="function"==typeof e?e:O(e,t),t.cache&&t.name&&t.storage.templates.define(t.name,i),i)}T.l.bind(T),e.compile=O,e.compileScope=_,e.compileScopeIntoFunction=y,e.compileToString=f,e.defaultConfig=T,e.filters=k,e.getConfig=C,e.helpers=E,e.nativeHelpers=S,e.parse=p,e.render=function(e,i,n,o){var a=C(n||{});if(!a.async)return z(e,a)(i,a);if(!o){if("function"==typeof s)return new s(function(t,s){try{t(z(e,a)(i,a))}catch(e){s(e)}});throw t("Please provide a callback function, this env doesn't support Promises")}try{z(e,a)(i,a,o)}catch(e){return o(e)}},e.templates=A,Object.defineProperty(e,"__esModule",{value:!0})}(Ce.exports)),Ce.exports}var ze=Oe();const Pe=2;class Ne{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}class je extends Ne{constructor(e){if(super(e),this.it=W,e.type!==Pe)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===W||null==e)return this._t=void 0,this.it=e;if(e===B)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}je.directiveName="unsafeHTML",je.resultType=1;const Ue=(e=>(...t)=>({_$litDirective$:e,values:t}))(je),He=e=>`<ha-icon icon="${e}"></ha-icon>`;function Re(e,t){const i=e?.layout?.sensors?.type??"table";return L` <div class="sensors ${[e?.layout?.sensors?.labels??!0?"with-labels":"without-labels","list"===i?"as-list":"as-table"].join(" ")}">${t}</div> `}function Ve({hide:e=!1,hass:t,state:i,details:s,localize:n,openEntityPopover:o}){if(e||void 0===i)return;const{type:a,heading:r,icon:l,unit:c,decimals:h}=s;let d;if(process.env.DEBUG&&console.log("ST: infoItem",{state:i,details:s}),"relativetime"===a)d=L`
      <div class="sensor-value">
        <ha-relative-time .datetime=${i} .hass=${t}></ha-relative-time>
      </div>
    `;else if("object"==typeof i){const[e]=i.entity_id.split("."),s=["component",e,"state",i.attributes?.device_class??"_",""].join("."),a=t.formatEntityState?.(i);let r=a??n?.(i.state,s)??i.state;a||"number"!=typeof h||(r=Se(r,{decimals:h})),d=L`
      <div
        class="sensor-value clickable"
        @click="${()=>o?.(i.entity_id)}"
      >
        ${r} ${c||i.attributes?.unit_of_measurement||""}
      </div>
    `}else{let e="number"==typeof h?Se(i,{decimals:h}):i;d=L` <div class="sensor-value">${e}${c}</div> `}if(!1===r)return d;const u=l?L` <ha-icon .icon=${l}></ha-icon> `:L` ${r}: `;return L`
    <div class="sensor-heading">${u}</div>
    ${d}
  `}var Ie;function Me({state:e,mode:t,modeOptions:i,localize:s,setMode:n}){const{type:o,hide_when_off:a,mode:r="none",list:l,name:c}=t;if(0===l.length||a&&e===Ie.OFF)return null;const h="hvac"===o?"operation":`${o}_mode`;let d=c||s(`ui.card.climate.${h}`);if(d===`ui.card.climate.${h}`){const e=`state_attributes.climate.${"hvac"===o?"hvac":o}_mode`;d=s(e),d===e&&(d="operation"===h?"Operation":"Mode")}const u=i?.headings??!1;return L`
    <div class="modes ${u?"heading":""}" role="group" aria-label=${d}>
      ${u?L` <div class="mode-title">${d}</div> `:""}
      ${l.map(({value:e,icon:t,name:a})=>L`
          <div
            class="mode-item ${e===r?"active "+r:""}"
            role="button"
            tabindex="0"
            aria-pressed=${e===r?"true":"false"}
            aria-label=${a||e}
            @click=${()=>n(o,e)}
            @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),n(o,e))}}
          >
            ${(e=>e?!1===i?.icons?null:L` <ha-icon class="mode-icon" .icon=${e}></ha-icon> `:null)(t)} ${(e=>!1===e||!1===i?.names?null:"hvac"===o?s(e,"component.climate.state._."):s(e,`component.climate.entity_component._.state_attributes.${o}_mode.state.`)||s(e,`state_attributes.climate.${o}_mode.`))(a)}
          </div>
        `)}
    </div>
  `}ze.defaultConfig.autoEscape=!1,ze.filters.define("icon",He),ze.filters.define("join",(e,t=", ")=>e.join(t)),ze.filters.define("css",(e,t)=>`<span style="${Object.entries(t).reduce((e,[t,i])=>`${e}${t}:${i};`,"")}">${e}</span>`),ze.filters.define("debug",e=>{try{return JSON.stringify(e)}catch{return`Not able to read valid JSON object from: ${e}`}}),function(e){e.OFF="off",e.HEAT="heat",e.COOL="cool",e.HEAT_COOL="heat_cool",e.AUTO="auto",e.DRY="dry",e.FAN_ONLY="fan_only"}(Ie||(Ie={}));const De={auto:"mdi:radiator",cooling:"mdi:snowflake",fan:"mdi:fan",heating:"mdi:radiator",idle:"mdi:radiator-disabled",off:"mdi:radiator-off"},Fe={auto:"hass:autorenew",cool:"hass:snowflake",dry:"hass:water-percent",fan_only:"hass:fan",heat_cool:"hass:autorenew",heat:"hass:fire",off:"hass:power",none:"mdi:minus-circle-outline",eco:"mdi:leaf",away:"mdi:home-export-outline",boost:"mdi:rocket-launch",comfort:"mdi:sofa",home:"mdi:home",sleep:"mdi:sleep",activity:"mdi:run",on:"mdi:fan",low:"mdi:fan-speed-1",medium:"mdi:fan-speed-2",high:"mdi:fan-speed-3",turbo:"mdi:fan-alert",quiet:"mdi:fan-minus",vertical:"mdi:arrow-up-down",horizontal:"mdi:arrow-left-right",both:"mdi:arrow-all",upper:"mdi:arrow-up",lower:"mdi:arrow-down"};function Le(e,t){const i=t.states[e.entity];if(!i)return null;let s="";return s=!0===e?.name?i.attributes.friendly_name:e?.name??"",{entity:i,label:s,icon:e?.icon??!1}}function Be(e,t){return Array.isArray(e)?e.filter(({entity:e})=>Boolean(t.states?.[e])).map(({entity:e,...i})=>({...i,state:t.states[e],entity:e})):[]}const We="dual";function qe(e,t){return!1===e?{}:e?Object.entries(e).reduce((e,[i,s])=>(s?.hide||(e[i]=t?.[i]),e),{}):function(e){return"number"==typeof e.target_temp_high&&"number"==typeof e.target_temp_low?We:"single"}(t)===We?{target_temp_low:t.target_temp_low,target_temp_high:t.target_temp_high}:{temperature:t.temperature}}var Je;!function(e){e.HVAC="hvac",e.FAN="fan",e.PRESET="preset",e.SWING="swing"}(Je||(Je={}));const Ye=Object.values(Je),Ge=[Je.HVAC,Je.PRESET],Ke="hass:chevron-up",Ze="hass:chevron-down",Qe="mdi:plus",Xe="mdi:minus",et={temperature:!1,state:!1};function tt(e,t,i={}){return t[`${e}_modes`].filter(e=>function(e,t){if("object"==typeof t[e])return!1!==t[e].include;return t?.[e]??!0}(e,i)).map(e=>{const t="object"==typeof i[e]?i[e]:{};return{icon:Fe[e],value:e,name:e,...t}})}class it extends re{constructor(){super(...arguments),this.modes=[],this._hass={},this.sensors=[],this.showSensors=!0,this.stepSize=.5,this._values={},this._updatingValues=!1,this._hide=et,this._updatingValuesTimeout=null,this._needsRecompute=!0,this._holdTimer=null,this._holdFired=!1,this._clickCount=0,this._clickTimer=null,this._debouncedSetTemperature=Ee(e=>{const{domain:t,service:i,data:s={}}=this.service;this._callAction(`${t}.${i}`,{entity_id:this.config.entity,...s,...e})},{wait:500}),this.localize=(e,t="")=>{const i=`${t}${e}`;return this._hass.localize(i)||e},this.toggleEntityChanged=e=>{if(!this.header||!this.header.toggle)return;const t=e.target;this._callAction(t.checked?"homeassistant.turn_on":"homeassistant.turn_off",{entity_id:this.header.toggle.entity?.entity_id})},this.setMode=(e,t)=>{e&&t?(this._callAction(`climate.set_${e}_mode`,{entity_id:this.config.entity,[`${e}_mode`]:t}),he(this,"haptic","light")):he(this,"haptic","failure")},this.openEntityPopover=(e=null)=>{he(this,"hass-more-info",{entityId:e||this.config.entity})},this._onActionPointerDown=e=>{0!==e.button&&"mouse"===e.pointerType||(this._holdFired=!1,this._holdTimer&&clearTimeout(this._holdTimer),this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._dispatchAction("hold")},it.HOLD_MS))},this._onActionPointerUp=()=>{this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onActionClick=e=>{e.preventDefault(),this._holdFired?this._holdFired=!1:(this._clickCount+=1,1===this._clickCount?(this._clickTimer&&clearTimeout(this._clickTimer),this._clickTimer=setTimeout(()=>{this._clickCount=0,this._clickTimer=null,this._dispatchAction("tap")},it.DOUBLE_TAP_MS)):(this._clickTimer&&clearTimeout(this._clickTimer),this._clickTimer=null,this._clickCount=0,this._dispatchAction("double_tap")))}}static get styles(){return ce}_callAction(e,t){if(this._hass.performAction)this._hass.performAction({action:e,data:t});else{const i=e.split(".");if(i.length<2)return;this._hass.callService(i[0],i.slice(1).join("."),t)}}static getConfigElement(){return window.document.createElement(`${e}-editor`)}static getStubConfig(e){return{entity:Object.keys(e.states).find(e=>e.startsWith("climate."))??""}}setConfig(e){if(!e?.entity)throw new Error("simple-thermostat: entity is required");this.config={decimals:1,...e},this.service=function(e){return e||{domain:"climate",service:"set_temperature"}}(this.config.service??!1),this._needsRecompute=!0}disconnectedCallback(){super.disconnectedCallback(),this._updatingValuesTimeout&&(clearTimeout(this._updatingValuesTimeout),this._updatingValuesTimeout=null),this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null),this._clickTimer&&(clearTimeout(this._clickTimer),this._clickTimer=null),this._debouncedSetTemperature?.cancel?.()}updated(e){super.updated(e);const t=Array.from(this.renderRoot.querySelectorAll("[with-hass]"));for(const e of Array.from(t))Array.from(e.attributes).forEach(t=>{t.name.startsWith("fwd-")&&(e[t.name.replace("fwd-","")]=t.value)}),e.hass=this._hass}set hass(e){if(!this.config?.entity||!e?.states)return;this._hass=e;const t=e.states[this.config.entity];if(!t)return void(void 0!==this.entity&&(this.entity=void 0));if(this.entity===t&&!this._needsRecompute)return;this._needsRecompute=!1,this.entity=t,this.header=function(e,t,i){if(!1===e)return!1;let s;s="string"==typeof e?.name?e.name:!1!==e?.name&&t.attributes.friendly_name;let n=t.attributes.hvac_action?De:Fe;return void 0!==e?.icon&&(n=e.icon),{name:s,icon:n,toggle:e?.toggle?Le(e.toggle,i):null,faults:Be(e?.faults,i)}}(!1!==this.config.header&&(this.config.header??{}),t,e);const i=t.attributes;let s=qe(this.config.setpoints,i);this._updatingValues&&function(e,t){const i=Object.keys(e);return i.length===Object.keys(t).length&&!i.some(i=>e?.[i]!==t?.[i])}(s,this._values)?(this._updatingValues=!1,this._updatingValuesTimeout&&(clearTimeout(this._updatingValuesTimeout),this._updatingValuesTimeout=null)):this._updatingValues||(this._values=s);const n=e=>Ye.includes(e)&&i[`${e}_modes`],o=e=>e.filter(n).map(e=>({type:e,hide_when_off:!1,list:tt(e,i)}));let a=[];if(!1===this.config.control)a=[];else if(Array.isArray(this.config.control))a=o(this.config.control);else if("object"==typeof this.config.control){const e=Object.entries(this.config.control);a=e.length>0?e.filter(([e])=>n(e)).map(([e,t])=>{const{_name:s,_hide_when_off:n,...o}=t;return{type:e,hide_when_off:n,name:s,list:tt(e,i,o)}}):o(Ge)}else a=o(Ge);if(this.modes=a.map(e=>{const s=e.list??[];if(e.type===Je.HVAC){const i=Object.values(Ie),n=[],o=[];return s.forEach(e=>{const t=i.indexOf(e.value);t>=0?n[t]=e:o.push(e)}),{...e,list:[...n.filter(Boolean),...o],mode:t.state}}const n=i[`${e.type}_mode`];return{...e,mode:n}}),this.config.step_size?this.stepSize=+this.config.step_size:i.target_temp_step&&(this.stepSize=+i.target_temp_step),this._hide={...et,...this.config.hide},!1===this.config.sensors)this.showSensors=!1;else if(3===this.config.version){this.sensors=[];const e=this.config.sensors??[],i=this.config.entity,s=e.map((e,s)=>{const n=e?.entity??i;let o=t;return e?.entity&&(o=this._hass.states?.[e.entity]),{id:e?.id??String(s),label:e?.label,template:e?.template??"",show:!1!==e?.show,entityId:n,context:o}}),n=s.map(e=>e.id),o=[];n.includes("state")||o.push({id:"state",label:"{{ui.operation}}",template:"{{state.text}}",entityId:i,context:t,show:!0}),n.includes("temperature")||o.push({id:"temperature",label:"{{ui.currently}}",template:"{{current_temperature|formatNumber}}",entityId:i,context:t,show:!0}),this.sensors=[...o,...s]}else this.config.sensors&&(this.sensors=this.config.sensors.map(({name:t,entity:s,attribute:n,unit:o="",...a})=>{let r;const l=[t];return s?(r=e.states[s],l.push(r?.attributes?.friendly_name),n&&(r=r?.attributes?.[n])):n&&n in i&&(r=i[n],l.push(n)),l.push(s),{...a,name:l.find(e=>!!e),state:r,entity:s,unit:o}}))}render(){const{_hide:e,_values:t,_updatingValues:i,config:s,entity:n}=this,o=[];if(this.stepSize<1&&0===this.config.decimals&&o.push(L`
        <ha-alert alert-type="warning">
          Decimals is set to 0 and step_size is lower than 1. Decrementing a
          setpoint will likely not work. Change one of the settings to clear
          this warning.
        </ha-alert>
      `),!n)return this._hass?.states?L`
        <ha-alert alert-type="error">
          Entity not available: ${s.entity}
        </ha-alert>
      `:L`<ha-card class="loading"></ha-card>`;const{attributes:{min_temp:a=null,max_temp:r=null,hvac_action:l}}=n,c=this.getUnit(),h=this.config?.layout?.step??"row",d="row"===h,u=["unavailable","unknown"].includes(n.state),p=e=>"string"==typeof e?e.replace(/[^a-z0-9_-]/gi,""):"",f=[!this.header&&"no-header",p(l),u&&p(n.state)].filter(e=>!!e);let g;return 3===this.config.version?(g=this.sensors.filter(e=>!1!==e.show).map(e=>function({context:e,entityId:t,template:i="{{state.text}}",label:s,hass:n,variables:o={},config:a,localize:r,openEntityPopover:l}){if(!e)return null;const{state:c,attributes:h}=e,[d]=t.split("."),u=Object.fromEntries(["currently","operation","fan_mode","swing_mode","preset_mode","humidity"].map(e=>[e,n.localize?.(`ui.card.climate.${e}`)??e])),p={...h,state:{raw:c,text:r(c,`component.${d}.state._.`)},ui:u,v:o};ze.filters.define("formatNumber",(e,t={decimals:a.decimals})=>String(Se(e,t))),ze.filters.define("relativetime",e=>`<ha-relative-time fwd-datetime=${e} with-hass></ha-relative-time>`),ze.filters.define("translate",(e,t="")=>r(e,t||"climate"!==d&&"humidifier"!==d?t:`state_attributes.${d}.${e}`));const f=e=>{try{return ze.render(e,p,{useWith:!0})}catch{return`[template error: ${e}]`}},g=f(i);if(!1===s||!1===a?.layout?.sensors?.labels)return L`<div class="sensor-value">${Ue(g)}</div>`;const m=s||"{{friendly_name}}",v=m.match(/^(mdi|hass):.*/)?He(m):f(m);return L`
    <div class="sensor-heading">${Ue(v)}</div>
    <div class="sensor-value">${Ue(g)}</div>
  `}({...e,variables:this.config.variables,hass:this._hass,config:this.config,localize:this.localize,openEntityPopover:this.openEntityPopover})),g=Re(this.config,g)):g=this.showSensors?function({_hide:e,entity:t,unit:i,hass:s,sensors:n,config:o,localize:a,openEntityPopover:r}){const{state:l,attributes:{hvac_action:c,current_temperature:h}}=t,d=o?.layout?.sensors?.labels??!0;let u=s.formatEntityState?.(t)??a(l,"component.climate.state._.");c&&(u=[a(c,"component.climate.entity_component._.state_attributes.hvac_action.state.")||a(c,"state_attributes.climate.hvac_action."),` (${u})`].join(""));const p=[Ve({hide:e.temperature,state:`${Se(h,o)}${i||""}`,hass:s,details:{heading:!!d&&(o?.label?.temperature??a("ui.card.climate.currently"))}}),Ve({hide:e.state,state:u,hass:s,details:{heading:!!d&&(o?.label?.state??a("ui.panel.lovelace.editor.card.generic.state"))}}),...n.map(({name:e,state:t,...i})=>Ve({state:t,hass:s,localize:a,openEntityPopover:r,details:{...i,heading:d&&e}}))].filter(Boolean);return Re(o,p)}({_hide:e,unit:c,hass:this._hass,entity:n,sensors:this.sensors,config:this.config,localize:this.localize,openEntityPopover:this.openEntityPopover}):"",L`
      <ha-card class="${f.join(" ")}">
        ${this.config.styles?L`<style>
              ${this.config.styles}
            </style>`:W}
        ${o}
        ${ke({header:this.header,toggleEntityChanged:this.toggleEntityChanged,entity:n,openEntityPopover:this.openEntityPopover})}
        <section class="body">
          ${g}
          ${Object.entries(t).map(([e,t])=>{const n=["string","number"].includes(typeof t),o=!1!==c&&n;return L`
              <div class="current-wrapper ${h}">
                <ha-icon-button
                  ?disabled=${null!==r&&t>=r}
                  class="thermostat-trigger"
                  aria-label="Increase ${e}"
                  .label=${`Increase ${e}`}
                  @click="${()=>this.setTemperature(this.stepSize,e)}"
                >
                  <ha-icon .icon=${d?Qe:Ke}></ha-icon>
                </ha-icon-button>

                <h3
                  @pointerdown=${this._onActionPointerDown}
                  @pointerup=${this._onActionPointerUp}
                  @pointercancel=${this._onActionPointerUp}
                  @click=${this._onActionClick}
                  @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._dispatchAction("tap"))}}
                  role="button"
                  tabindex="0"
                  aria-label=${`${e}: ${Se(t,{...s,locale:this._hass?.locale})}${o?` ${c}`:""}`}
                  class=${i?"current--value updating":"current--value"}
                >
                  ${Se(t,{...s,locale:this._hass?.locale})}
                  ${o?L`<span class="current--unit">${c}</span>`:W}
                </h3>
                <ha-icon-button
                  ?disabled=${null!==a&&t<=a}
                  class="thermostat-trigger"
                  aria-label="Decrease ${e}"
                  .label=${`Decrease ${e}`}
                  @click="${()=>this.setTemperature(-this.stepSize,e)}"
                >
                  <ha-icon .icon=${d?Xe:Ze}></ha-icon>
                </ha-icon-button>
              </div>
            `})}
        </section>

        ${this.modes.map(e=>Me({state:n.state,mode:e,localize:this.localize,modeOptions:this.config?.layout?.mode??{},setMode:this.setMode}))}
      </ha-card>
    `}setTemperature(e,t){this._updatingValues=!0,this._updatingValuesTimeout&&clearTimeout(this._updatingValuesTimeout),this._updatingValuesTimeout=setTimeout(()=>{this._updatingValues=!1,this._updatingValuesTimeout=null},1e4);const i=this._values[t],s=Number(i)+e,{decimals:n}=this.config;this._values={...this._values,[t]:+Se(s,{decimals:n})},this._debouncedSetTemperature(this._values)}_dispatchAction(e){const t="tap"===e?"tap_action":"hold"===e?"hold_action":"double_tap_action",i=this.config?.[t]??("tap"===e?{action:"more-info"}:{action:"none"});this._runAction(i)}_runAction(e){switch(e.action){case"none":return;case"more-info":return void he(this,"hass-more-info",{entityId:this.config.entity});case"navigate":return history.pushState(null,"",e.navigation_path),void he(window,"location-changed",{replace:!1});case"url":return void window.open(e.url_path);case"toggle":return void this._callAction("homeassistant.toggle",{entity_id:this.config.entity});case"call-service":return void this._callAction(e.service,e.service_data??{})}}getCardSize(){let e=2;return!1!==this.config?.header&&(e+=1),!1!==this.config?.control&&(e+=1),e}getUnit(){return void 0!==this.config.unit?this.config.unit:this._hass.config?.unit_system?.temperature??!1}}it.HOLD_MS=500,it.DOUBLE_TAP_MS=250,ge([ye()],it.prototype,"config",void 0),ge([ye()],it.prototype,"header",void 0),ge([ye()],it.prototype,"service",void 0),ge([ye()],it.prototype,"modes",void 0),ge([ye()],it.prototype,"entity",void 0),ge([ye()],it.prototype,"sensors",void 0),ge([ye()],it.prototype,"showSensors",void 0),ge([ye()],it.prototype,"_values",void 0),ge([ye()],it.prototype,"_updatingValues",void 0),ge([ye()],it.prototype,"_hide",void 0),customElements.define(e,it),customElements.define(`${e}-editor`,class extends re{static get styles(){return ce}static get properties(){return{hass:{},config:{}}}setConfig(e){this.config=e||fe(pe)}_openLink(){window.open("https://github.com/duczz/ha-simple-thermostat/blob/master/README.md")}render(){return this.hass&&this.config?L`
      <div class="card-config">

        <ha-selector
          .hass=${this.hass}
          .selector=${{entity:{domain:"climate"}}}
          .value=${this.config.entity??""}
          .label=${"Entity (required)"}
          .configValue=${"entity"}
          @value-changed=${this.valueChanged}
        ></ha-selector>

        <ha-expansion-panel .header=${"Header"} outlined expanded>
          <div class="panel-content">
            <ha-formfield label="Show header">
              <ha-switch
                .checked=${!1!==this.config.header}
                @change=${this.toggleHeader}
              ></ha-switch>
            </ha-formfield>

            ${!1!==this.config.header?L`
              <div class="side-by-side">
                <ha-textfield
                  label="Name (optional)"
                  .value="${this.config.header?.name??""}"
                  .configValue="${"header.name"}"
                  @input="${this.valueChanged}"
                ></ha-textfield>
                <ha-icon-picker
                  label="Icon (optional)"
                  .value="${this.config.header?.icon??""}"
                  .configValue=${"header.icon"}
                  @value-changed=${this.valueChanged}
                ></ha-icon-picker>
              </div>
              <div class="side-by-side">
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{entity:{}}}
                  .value=${this.config?.header?.toggle?.entity??""}
                  .label=${"Toggle entity (optional)"}
                  .configValue=${"header.toggle.entity"}
                  @value-changed=${this.valueChanged}
                ></ha-selector>
                <ha-textfield
                  label="Toggle label"
                  .value="${this.config?.header?.toggle?.name??""}"
                  .configValue="${"header.toggle.name"}"
                  @input="${this.valueChanged}"
                ></ha-textfield>
              </div>
              ${this.config?.header?.toggle?.entity?L`
                <ha-icon-picker
                  label="Toggle icon (optional)"
                  .value="${this.config?.header?.toggle?.icon??""}"
                  .configValue=${"header.toggle.icon"}
                  @value-changed=${this.valueChanged}
                ></ha-icon-picker>
              `:""}
            `:""}
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel .header=${"Mode Controls"} outlined>
          <div class="panel-content">
            <div class="editor-switches">
              <ha-formfield label="Show mode names">
                <ha-switch
                  .checked=${!1!==this.config?.layout?.mode?.names}
                  .configValue="${"layout.mode.names"}"
                  @change=${this.valueChanged}
                ></ha-switch>
              </ha-formfield>
              <ha-formfield label="Show mode icons">
                <ha-switch
                  .checked=${!1!==this.config?.layout?.mode?.icons}
                  .configValue="${"layout.mode.icons"}"
                  @change=${this.valueChanged}
                ></ha-switch>
              </ha-formfield>
              <ha-formfield label="Show mode headings">
                <ha-switch
                  .checked=${!0===this.config?.layout?.mode?.headings}
                  .configValue="${"layout.mode.headings"}"
                  @change=${this.valueChanged}
                ></ha-switch>
              </ha-formfield>
            </div>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel .header=${"Layout & Display"} outlined>
          <div class="panel-content">
            <div class="side-by-side">
              <ha-textfield
                label="Decimals"
                type="number"
                min="0"
                max="5"
                .value="${String(this.config.decimals??1)}"
                .configValue="${"decimals"}"
                @input="${this.valueChanged}"
              ></ha-textfield>
              <ha-textfield
                label="Unit (optional)"
                .value="${this.config.unit??""}"
                .configValue="${"unit"}"
                @input="${this.valueChanged}"
              ></ha-textfield>
            </div>
            <div class="side-by-side">
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{options:["column","row"],mode:"dropdown"}}}
                .value=${this.config.layout?.step??"row"}
                .label=${"Step layout"}
                .configValue=${"layout.step"}
                @value-changed=${this.valueChanged}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{options:[{value:"",label:"Auto (from entity)"},{value:"0.1",label:"0.1"},{value:"0.5",label:"0.5"},{value:"1",label:"1"}],mode:"dropdown"}}}
                .value=${null!=this.config.step_size?String(this.config.step_size):""}
                .label=${"Step size"}
                .configValue=${"step_size"}
                @value-changed=${this.valueChanged}
              ></ha-selector>
            </div>
            <ha-textfield
              label="Fallback text (optional)"
              .value="${this.config.fallback??""}"
              .configValue="${"fallback"}"
              @input="${this.valueChanged}"
            ></ha-textfield>

            <p class="section-label">Hide</p>
            <div class="editor-switches">
              <ha-formfield label="Hide temperature">
                <ha-switch
                  .checked=${!0===this.config?.hide?.temperature}
                  .configValue="${"hide.temperature"}"
                  @change=${this.valueChanged}
                ></ha-switch>
              </ha-formfield>
              <ha-formfield label="Hide state">
                <ha-switch
                  .checked=${!0===this.config?.hide?.state}
                  .configValue="${"hide.state"}"
                  @change=${this.valueChanged}
                ></ha-switch>
              </ha-formfield>
            </div>

            <p class="section-label">Labels</p>
            <div class="side-by-side">
              <ha-textfield
                label="Temperature label"
                .value="${this.config?.label?.temperature??""}"
                .configValue="${"label.temperature"}"
                @input="${this.valueChanged}"
              ></ha-textfield>
              <ha-textfield
                label="State label"
                .value="${this.config?.label?.state??""}"
                .configValue="${"label.state"}"
                @input="${this.valueChanged}"
              ></ha-textfield>
            </div>

            <p class="section-label">Sensors</p>
            <div class="side-by-side">
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{options:["table","list"],mode:"dropdown"}}}
                .value=${this.config?.layout?.sensors?.type??"table"}
                .label=${"Sensor layout"}
                .configValue=${"layout.sensors.type"}
                @value-changed=${this.valueChanged}
              ></ha-selector>
              <ha-formfield label="Show sensor labels">
                <ha-switch
                  .checked=${!1!==this.config?.layout?.sensors?.labels}
                  .configValue="${"layout.sensors.labels"}"
                  @change=${this.valueChanged}
                ></ha-switch>
              </ha-formfield>
            </div>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel .header=${"Interactions"} outlined>
          <div class="panel-content">
            <p class="styles-hint">
              Configure how the card responds to tap, hold, and double-tap on the temperature display.
            </p>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ui_action:{default_action:"more-info"}}}
              .value=${this.config?.tap_action??{action:"more-info"}}
              .label=${"Tap action"}
              .configValue=${"tap_action"}
              @value-changed=${this.valueChanged}
            ></ha-selector>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ui_action:{default_action:"none"}}}
              .value=${this.config?.hold_action??{action:"none"}}
              .label=${"Hold action"}
              .configValue=${"hold_action"}
              @value-changed=${this.valueChanged}
            ></ha-selector>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ui_action:{default_action:"none"}}}
              .value=${this.config?.double_tap_action??{action:"none"}}
              .label=${"Double tap action"}
              .configValue=${"double_tap_action"}
              @value-changed=${this.valueChanged}
            ></ha-selector>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel .header=${"Custom CSS"} outlined>
          <div class="panel-content">
            <p class="styles-hint">
              Use <code>--st-*</code> variables or target any selector inside the card.
            </p>
            <div class="styles-editor">
              <ha-code-editor
                mode="yaml"
                autocomplete-entities
                autocomplete-icons
                .hass=${this.hass}
                .value=${this.config.styles??""}
                .configValue=${"styles"}
                @value-changed=${this.valueChanged}
              ></ha-code-editor>
            </div>
          </div>
        </ha-expansion-panel>

        <div class="editor-footer">
          <ha-button @click=${this._openLink}>
            <ha-icon icon="mdi:book-open-variant" slot="icon"></ha-icon>
            All configuration options
          </ha-button>
          <span class="editor-footer__hint">
            Advanced settings only via YAML
          </span>
          <span class="editor-footer__version">v${t} · ${de}</span>
        </div>

      </div>
    `:L``}valueChanged(e){if(!this.config||!this.hass)return;const{target:t}=e,i=fe(this.config);if(t.configValue){let s=void 0!==t.checked?t.checked:void 0!==e.detail?.value?e.detail.value:t.value;if(""===s||void 0===s)!function(e,t){const i=t.split(".");let s=e;for(;i.length>1;){const e=i.shift();if(!s[e])return;s=s[e]}delete s[i[0]]}(i,t.configValue);else{if("string"==typeof s&&ue.includes(t.configValue)){const e=Number(s);Number.isNaN(e)||(s=e)}!function(e,t,i){const s=t.split(".");let n=e;for(;s.length-1;){const e=s.shift();Object.hasOwn(n,e)||(n[e]={}),n=n[e]}n[s[0]]=i}(i,t.configValue,s)}}if(["layout.mode.names","layout.mode.icons"].includes(t.configValue)){!1===i?.layout?.mode?.names&&!1===i?.layout?.mode?.icons?i.control=!1:!1===i.control&&delete i.control}he(this,"config-changed",{config:i})}toggleControl(e){const t=fe(this.config);e.target.checked?delete t.control:t.control=!1,he(this,"config-changed",{config:t})}toggleHeader(e){const t=fe(this.config);t.header=!!e.target.checked&&{},he(this,"config-changed",{config:t})}}),console.info(`%c${e}: ${t}`,"font-weight: bold"),window.customCards=window.customCards||[],window.customCards.push({type:e,name:"Simple Thermostat",preview:!1,description:"A different take on the thermostat card",documentationURL:"https://github.com/duczz/simple-thermostat"});
