!function(){const e={DEBUG:!1,BUILD_TIME:"15.05.2026, 13:54"};try{if(process)return process.env=Object.assign({},process.env),void Object.assign(process.env,e)}catch(e){}globalThis.process={env:e}}();var e="simple-thermostat",t="2.3.2";const i=globalThis,n=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let r=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(n&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(t,e))}return e}toString(){return this.cssText}};const a=n?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,m=globalThis,f=m.trustedTypes,g=f?f.emptyScript:"",v=m.reactiveElementPolyfillSupport,_=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&c(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:o}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const s=n?.call(this);o?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...h(e),...u(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(n)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const n of t){const t=document.createElement("style"),o=i.litNonce;void 0!==o&&t.setAttribute("nonce",o),t.textContent=n.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=n;const s=o.fromAttribute(t,e.type);this[n]=s??this._$Ej?.get(n)??s,this._$Em=null}}requestUpdate(e,t,i,n=!1,o){if(void 0!==e){const s=this.constructor;if(!1===n&&(o=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??b)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:o},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==o||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[_("elementProperties")]=new Map,w[_("finalized")]=new Map,v?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,A=e=>e,S=x.trustedTypes,E=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,T="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+k,z=`<${C}>`,O=document,P=()=>O.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,j=Array.isArray,M="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,D=/>/g,H=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,F=/"/g,V=/^(?:script|style|textarea|title)$/i,L=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),B=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,K=O.createTreeWalker(O,129);function J(e,t){if(!j(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(t):t}const Y=(e,t)=>{const i=e.length-1,n=[];let o,s=2===t?"<svg>":3===t?"<math>":"",r=R;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===R?"!--"===l[1]?r=U:void 0!==l[1]?r=D:void 0!==l[2]?(V.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=H):void 0!==l[3]&&(r=H):r===H?">"===l[0]?(r=o??R,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?H:'"'===l[3]?F:I):r===F||r===I?r=H:r===U||r===D?r=R:(r=H,o=void 0);const h=r===H&&e[t+1].startsWith("/>")?" ":"";s+=r===R?i+z:c>=0?(n.push(a),i.slice(0,c)+T+i.slice(c)+k+h):i+k+(-2===c?t:h)}return[J(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class G{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let o=0,s=0;const r=e.length-1,a=this.parts,[l,c]=Y(e,t);if(this.el=G.createElement(l,i),K.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=K.nextNode())&&a.length<r;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(T)){const t=c[s++],i=n.getAttribute(e).split(k),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?te:"?"===r[1]?ie:"@"===r[1]?ne:ee}),n.removeAttribute(e)}else e.startsWith(k)&&(a.push({type:6,index:o}),n.removeAttribute(e));if(V.test(n.tagName)){const e=n.textContent.split(k),t=e.length-1;if(t>0){n.textContent=S?S.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],P()),K.nextNode(),a.push({type:2,index:++o});n.append(e[t],P())}}}else if(8===n.nodeType)if(n.data===C)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=n.data.indexOf(k,e+1));)a.push({type:7,index:o}),e+=k.length-1}o++}}static createElement(e,t){const i=O.createElement("template");return i.innerHTML=e,i}}function Z(e,t,i=e,n){if(t===B)return t;let o=void 0!==n?i._$Co?.[n]:i._$Cl;const s=N(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(e),o._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=o:i._$Cl=o),void 0!==o&&(t=Z(e,o._$AS(e,t.values),o,n)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??O).importNode(t,!0);K.currentNode=n;let o=K.nextNode(),s=0,r=0,a=i[0];for(;void 0!==a;){if(s===a.index){let t;2===a.type?t=new X(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new oe(o,this,e)),this._$AV.push(t),a=i[++r]}s!==a?.index&&(o=K.nextNode(),s++)}return K.currentNode=O,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),N(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>j(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=G.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new Q(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new G(e)),t}k(e){j(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const o of e)n===t.length?t.push(i=new X(this.O(P()),this.O(P()),this,this.options)):i=t[n],i._$AI(o),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(e,t=this,i,n){const o=this.strings;let s=!1;if(void 0===o)e=Z(this,e,t,0),s=!N(e)||e!==this._$AH&&e!==B,s&&(this._$AH=e);else{const n=e;let r,a;for(e=o[0],r=0;r<o.length-1;r++)a=Z(this,n[i+r],t,r),a===B&&(a=this._$AH[r]),s||=!N(a)||a!==this._$AH[r],a===W?e=W:e!==W&&(e+=(a??"")+o[r+1]),this._$AH[r]=a}s&&!n&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class ne extends ee{constructor(e,t,i,n,o){super(e,t,i,n,o),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??W)===B)return;const i=this._$AH,n=e===W&&i!==W||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==W&&(i===W||n);n&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const se=x.litHtmlPolyfillSupport;se?.(G,X),(x.litHtmlVersions??=[]).push("3.3.2");const re=globalThis;let ae=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let o=n._$litPart$;if(void 0===o){const e=i?.renderBefore??null;n._$litPart$=o=new X(t.insertBefore(P(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}};ae._$litElement$=!0,ae.finalized=!0,re.litElementHydrateSupport?.({LitElement:ae});const le=re.litElementPolyfillSupport;le?.({LitElement:ae}),(re.litElementVersions??=[]).push("4.2.2");var ce=((e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new r(i,e,o)})`:host {
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
  display: flex;
  flex-wrap: wrap;
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
  flex: 1;
  min-width: -moz-max-content;
  min-width: max-content;
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
  align-items: center;
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
  min-height: 90px;
  display: flex;
  flex-direction: column;
}
.styles-editor ha-code-editor {
  display: block;
  flex: 1;
  --code-mirror-max-height: 360px;
}
`;function de(e,t,i,n={}){i=null==i?{}:i;const o=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return o.detail=i,e.dispatchEvent(o),o}!function(e,t){void 0===t&&(t={});var i=t.insertAt;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],o=document.createElement("style");o.type="text/css","top"===i&&n.firstChild?n.insertBefore(o,n.firstChild):n.appendChild(o),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(document.createTextNode(e))}}(ce);const he=process.env.BUILD_TIME,ue=e=>JSON.parse(JSON.stringify(e));const pe={entity:"Entity (required)",current_value_entity:"Current temperature entity (optional)",show_header:"Show header",name:"Name",icon:"Icon","toggle.entity":"Toggle entity","toggle.name":"Toggle label","toggle.icon":"Toggle icon",show_preset:"Preset mode",show_fan:"Fan mode",show_swing:"Swing mode","layout.mode.names":"Show mode names","layout.mode.icons":"Show mode icons","layout.mode.headings":"Show mode headings",decimals:"Decimals",unit:"Unit","layout.step":"Step layout",step_size:"Step size",fallback:"Fallback text","hide.temperature":"Hide temperature","hide.state":"Hide state","label.temperature":"Temperature label","label.state":"State label","layout.sensors.type":"Sensor layout","layout.sensors.labels":"Show sensor labels",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action"},me=["decimals"];function fe(e,t,i){const n=t.split(".");let o=e;for(;n.length-1;){const e=n.shift();Object.hasOwn(o,e)||(o[e]={}),o=o[e]}o[n[0]]=i}function ge(e,t){const i=t.split(".");let n=e;for(;i.length>1;){const e=i.shift();if(!n[e])return;n=n[e]}delete n[i[0]]}function ve(e,t){const i=e.control;return!1!==i&&(Array.isArray(i)?i.includes(t):"preset"===t)}function _e(e,t,i,n){var o,s=arguments.length,r=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(s<3?o(r):s>3?o(t,i,r):o(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const ye={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},be=(e=ye,t,i)=>{const{kind:n,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(void 0===s&&globalThis.litPropertyMetadata.set(o,s=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),s.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,o,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const o=this[n];t.call(this,i),this.requestUpdate(n,o,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function $e(e){return function(e){return(t,i)=>"object"==typeof i?be(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}({...e,state:!0,attribute:!1})}const we=(e,t,i,n)=>{if("length"===i||"prototype"===i)return;if("arguments"===i||"caller"===i)return;const o=Object.getOwnPropertyDescriptor(e,i),s=Object.getOwnPropertyDescriptor(t,i);!xe(o,s)&&n||Object.defineProperty(e,i,s)},xe=function(e,t){return void 0===e||e.configurable||e.writable===t.writable&&e.enumerable===t.enumerable&&e.configurable===t.configurable&&(e.writable||e.value===t.value)},Ae=(e,t)=>`/* Wrapped ${e}*/\n${t}`,Se=Object.getOwnPropertyDescriptor(Function.prototype,"toString"),Ee=Object.getOwnPropertyDescriptor(Function.prototype.toString,"name");function Te(e,t,{ignoreNonConfigurable:i=!1}={}){const{name:n}=e;for(const n of Reflect.ownKeys(t))we(e,t,n,i);return((e,t)=>{const i=Object.getPrototypeOf(t);i!==Object.getPrototypeOf(e)&&Object.setPrototypeOf(e,i)})(e,t),((e,t,i)=>{const n=""===i?"":`with ${i.trim()}() `,o=Ae.bind(null,n,t.toString());Object.defineProperty(o,"name",Ee);const{writable:s,enumerable:r,configurable:a}=Se;Object.defineProperty(e,"toString",{value:o,writable:s,enumerable:r,configurable:a})})(e,t,n),e}const ke=(e,t={})=>{if("function"!=typeof e)throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);const{wait:i=0,maxWait:n=Number.POSITIVE_INFINITY,before:o=!1,after:s=!0}=t;if(i<0||n<0)throw new RangeError("`wait` and `maxWait` must not be negative.");if(!o&&!s)throw new Error("Both `before` and `after` are false, function wouldn't be called.");let r,a,l;const c=function(...t){const c=this,d=()=>{a=void 0,r&&(clearTimeout(r),r=void 0),s&&(l=e.apply(c,t))},h=o&&!r;return clearTimeout(r),r=setTimeout(()=>{r=void 0,a&&(clearTimeout(a),a=void 0),s&&(l=e.apply(c,t))},i),n>0&&n!==Number.POSITIVE_INFINITY&&!a&&(a=setTimeout(d,n)),h&&(l=e.apply(c,t)),l};return Te(c,e),c.cancel=()=>{r&&(clearTimeout(r),r=void 0),a&&(clearTimeout(a),a=void 0)},c};function Ce(e,{decimals:t=1,fallback:i="N/A",locale:n}={}){if(null===e||""===e||["boolean","undefined"].includes(typeof e))return i;const o=Number(e);return Number.isNaN(o)?i:n?"decimal_comma"===n.number_format||"space_comma"===n.number_format?o.toFixed(t).replace(".",","):"comma_decimal"===n.number_format||"none"===n.number_format?o.toFixed(t):new Intl.NumberFormat("system"===n.number_format?void 0:n.language,{minimumFractionDigits:t,maximumFractionDigits:t}).format(o):o.toFixed(t)}function ze({header:e,toggleEntityChanged:t,entity:i,openEntityPopover:n}){if(!1===e)return W;const o=i.attributes.hvac_action||i.state;let s=e.icon;"object"==typeof e.icon&&(s=s?.[o]??!1);const r=e?.name??!1;return L`
    <header>
      <div
        class="clickable header__clickable"
        @click=${()=>n()}
      >
        ${function(e){return e?L` <ha-icon class="header__icon" .icon=${e}></ha-icon> `:W}(s)} ${function(e){return e?L`<h2 class="header__title">${e}</h2>`:W}(r)}
      </div>
      ${function(e,t){if(!e?.length)return W;const i=e.map(({icon:e,hide_inactive:i,state:n})=>L` <ha-icon
      class="fault-icon ${"on"===n?.state?"active":i?"hide":""}"
      .icon=${e||n?.attributes?.icon}
      @click="${()=>t(n?.entity_id)}"
    ></ha-icon>`);return L` <div class="faults">${i}</div>`}(e.faults,n)}
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
  `:W}(e.toggle,n,t)}
    </header>
  `}var Oe,Pe={exports:{}};function Ne(){return Oe||(Oe=1,function(e){function t(e){var i,n,o=new Error(e);return i=o,n=t.prototype,Object.setPrototypeOf?Object.setPrototypeOf(i,n):i.__proto__=n,o}function i(e,i,n){var o=i.slice(0,n).split(/\n/),s=o.length,r=o[s-1].length+1;throw t(e+=" at line "+s+" col "+r+":\n\n  "+i.split(/\n/)[s-1]+"\n  "+Array(r).join(" ")+"^")}t.prototype=Object.create(Error.prototype,{name:{value:"Squirrelly Error",enumerable:!1}});var n=new Function("return this")().Promise,o=!1;try{o=new Function("return (async function(){}).constructor")()}catch(e){if(!(e instanceof SyntaxError))throw e}function s(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function r(e,t,i){for(var n in t)s(t,n)&&(null==t[n]||"object"!=typeof t[n]||"storage"!==n&&"prefixes"!==n||i?e[n]=t[n]:e[n]=r({},t[n]));return e}var a=/^async +/,l=/`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g,c=/'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g,d=/"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g,h=/[.*+\-?^${}()|[\]\\]/g;function u(e){return h.test(e)?e.replace(h,"\\$&"):e}function p(e,n){n.rmWhitespace&&(e=e.replace(/[\r\n]+/g,"\n").replace(/^\s+|\s+$/gm,"")),l.lastIndex=0,c.lastIndex=0,d.lastIndex=0;var o=n.prefixes,s=[o.h,o.b,o.i,o.r,o.c,o.e].reduce(function(e,t){return e&&t?e+"|"+u(t):t?u(t):e},""),r=new RegExp("([|()]|=>)|('|\"|`|\\/\\*)|\\s*((\\/)?(-|_)?"+u(n.tags[1])+")","g"),h=new RegExp("([^]*?)"+u(n.tags[0])+"(-|_)?\\s*("+s+")?\\s*","g"),p=0,m=!1;function f(t,o){var s,u={f:[]},f=0,g="c";function v(t){var o=e.slice(p,t),s=o.trim();if("f"===g)"safe"===s?u.raw=!0:n.async&&a.test(s)?(s=s.replace(a,""),u.f.push([s,"",!0])):u.f.push([s,""]);else if("fp"===g)u.f[u.f.length-1][1]+=s;else if("err"===g){if(s){var r=o.search(/\S/);i("invalid syntax",e,p+r)}}else u[g]=s;p=t+1}for("h"===o||"b"===o||"c"===o?g="n":"r"===o&&(u.raw=!0,o="i"),r.lastIndex=p;null!==(s=r.exec(e));){var _=s[1],y=s[2],b=s[3],$=s[4],w=s[5],x=s.index;if(_)"("===_?(0===f&&("n"===g?(v(x),g="p"):"f"===g&&(v(x),g="fp")),f++):")"===_?0===--f&&"c"!==g&&(v(x),g="err"):0===f&&"|"===_?(v(x),g="f"):"=>"===_&&(v(x),p+=1,g="res");else if(y)if("/*"===y){var A=e.indexOf("*/",r.lastIndex);-1===A&&i("unclosed comment",e,s.index),r.lastIndex=A+2}else"'"===y?(c.lastIndex=s.index,c.exec(e)?r.lastIndex=c.lastIndex:i("unclosed string",e,s.index)):'"'===y?(d.lastIndex=s.index,d.exec(e)?r.lastIndex=d.lastIndex:i("unclosed string",e,s.index)):"`"===y&&(l.lastIndex=s.index,l.exec(e)?r.lastIndex=l.lastIndex:i("unclosed string",e,s.index));else if(b)return v(x),p=x+s[0].length,h.lastIndex=p,m=w,$&&"h"===o&&(o="s"),u.t=o,u}return i("unclosed tag",e,t),u}var g=function s(r,l){r.b=[],r.d=[];var c,d=!1,u=[];function g(e,t){e&&(e=function(e,t,i,n){var o,s;return"string"==typeof t.autoTrim?o=s=t.autoTrim:Array.isArray(t.autoTrim)&&(o=t.autoTrim[1],s=t.autoTrim[0]),(i||!1===i)&&(o=i),(n||!1===n)&&(s=n),"slurp"===o&&"slurp"===s?e.trim():("_"===o||"slurp"===o?e=String.prototype.trimLeft?e.trimLeft():e.replace(/^[\s\uFEFF\xA0]+/,""):"-"!==o&&"nl"!==o||(e=e.replace(/^(?:\n|\r|\r\n)/,"")),"_"===s||"slurp"===s?e=String.prototype.trimRight?e.trimRight():e.replace(/[\s\uFEFF\xA0]+$/,""):"-"!==s&&"nl"!==s||(e=e.replace(/(?:\n|\r|\r\n)$/,"")),e)}(e,n,m,t))&&(e=e.replace(/\\|'/g,"\\$&").replace(/\r\n|\n|\r/g,"\\n"),u.push(e))}for(;null!==(c=h.exec(e));){var v,_=c[1],y=c[2],b=c[3]||"";for(var $ in o)if(o[$]===b){v=$;break}g(_,y),p=c.index+c[0].length,v||i("unrecognized tag type: "+b,e,p);var w=f(c.index,v),x=w.t;if("h"===x){var A=w.n||"";n.async&&a.test(A)&&(w.a=!0,w.n=A.replace(a,"")),w=s(w),u.push(w)}else if("c"===x){if(r.n===w.n)return d?(d.d=u,r.b.push(d)):r.d=u,r;i("Helper start and end don't match",e,c.index+c[0].length)}else if("b"===x){d?(d.d=u,r.b.push(d)):r.d=u;var S=w.n||"";n.async&&a.test(S)&&(w.a=!0,w.n=S.replace(a,"")),d=w,u=[]}else if("s"===x){var E=w.n||"";n.async&&a.test(E)&&(w.a=!0,w.n=E.replace(a,"")),u.push(w)}else u.push(w)}if(!l)throw t('unclosed helper "'+r.n+'"');return g(e.slice(p,e.length),!1),r.d=u,r}({f:[]},!0);if(n.plugins)for(var v=0;v<n.plugins.length;v++){var _=n.plugins[v];_.processAST&&(g.d=_.processAST(g.d,n))}return g.d}function m(e,t){var i=p(e,t),n="var tR='';"+(t.useWith?"with("+t.varName+"||{}){":"")+y(i,t)+"if(cb){cb(null,tR)} return tR"+(t.useWith?"}":"");if(t.plugins)for(var o=0;o<t.plugins.length;o++){var s=t.plugins[o];s.processFnString&&(n=s.processFnString(n,t))}return n}function f(e,t){for(var i=0;i<t.length;i++){var n=t[i][0],o=t[i][1];e=(t[i][2]?"await ":"")+"c.l('F','"+n+"')("+e,o&&(e+=","+o),e+=")"}return e}function g(e,t,i,n,o,s){var r="{exec:"+(o?"async ":"")+_(i,t,e)+",params:["+n+"]";return s&&(r+=",name:'"+s+"'"),o&&(r+=",async:true"),r+"}"}function v(e,t){for(var i="[",n=0;n<e.length;n++){var o=e[n];i+=g(t,o.res||"",o.d,o.p||"",o.a,o.n),n<e.length&&(i+=",")}return i+"]"}function _(e,t,i){return"function("+t+"){var tR='';"+y(e,i)+"return tR}"}function y(e,t){for(var i=0,n=e.length,o="";i<n;i++){var s=e[i];if("string"==typeof s)o+="tR+='"+s+"';";else{var r=s.t,a=s.c||"",l=s.f,c=s.n||"",d=s.p||"",h=s.res||"",u=s.b,p=!!s.a;if("i"===r){t.defaultFilter&&(a="c.l('F','"+t.defaultFilter+"')("+a+")");var m=f(a,l);!s.raw&&t.autoEscape&&(m="c.l('F','e')("+m+")"),o+="tR+="+m+";"}else if("h"===r)if(t.storage.nativeHelpers.get(c))o+=t.storage.nativeHelpers.get(c)(s,t);else{var _=(p?"await ":"")+"c.l('H','"+c+"')("+g(t,h,s.d,d,p);_+=u?","+v(u,t):",[]",o+="tR+="+f(_+=",c)",l)+";"}else"s"===r?o+="tR+="+f((p?"await ":"")+"c.l('H','"+c+"')({params:["+d+"]},[],c)",l)+";":"e"===r&&(o+=a+"\n")}}return o}var b=function(){function e(e){this.cache=e}return e.prototype.define=function(e,t){this.cache[e]=t},e.prototype.get=function(e){return this.cache[e]},e.prototype.remove=function(e){delete this.cache[e]},e.prototype.reset=function(){this.cache={}},e.prototype.load=function(e){r(this.cache,e,!0)},e}();function $(e,i,n,o){if(i&&i.length>0)throw t((o?"Native":"")+"Helper '"+e+"' doesn't accept blocks");if(n&&n.length>0)throw t((o?"Native":"")+"Helper '"+e+"' doesn't accept filters")}var w={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function x(e){return w[e]}var A=new b({}),S=new b({each:function(e,t){var i="",n=e.params[0];if($("each",t,!1),e.async)return new Promise(function(t){!function e(t,i,n,o,s){n(t[i],i).then(function(r){o+=r,i===t.length-1?s(o):e(t,i+1,n,o,s)})}(n,0,e.exec,i,t)});for(var o=0;o<n.length;o++)i+=e.exec(n[o],o);return i},foreach:function(e,t){var i=e.params[0];if($("foreach",t,!1),e.async)return new Promise(function(t){!function e(t,i,n,o,s,r){o(i[n],t[i[n]]).then(function(a){s+=a,n===i.length-1?r(s):e(t,i,n+1,o,s,r)})}(i,Object.keys(i),0,e.exec,"",t)});var n="";for(var o in i)s(i,o)&&(n+=e.exec(o,i[o]));return n},include:function(e,i,n){$("include",i,!1);var o=n.storage.templates.get(e.params[0]);if(!o)throw t('Could not fetch template "'+e.params[0]+'"');return o(e.params[1],n)},extends:function(e,i,n){var o=e.params[1]||{};o.content=e.exec();for(var s=0;s<i.length;s++){var r=i[s];o[r.name]=r.exec()}var a=n.storage.templates.get(e.params[0]);if(!a)throw t('Could not fetch template "'+e.params[0]+'"');return a(o,n)},useScope:function(e,t){return $("useScope",t,!1),e.exec(e.params[0])}}),E=new b({if:function(e,t){$("if",!1,e.f,!0);var i="if("+e.p+"){"+y(e.d,t)+"}";if(e.b)for(var n=0;n<e.b.length;n++){var o=e.b[n];"else"===o.n?i+="else{"+y(o.d,t)+"}":"elif"===o.n&&(i+="else if("+o.p+"){"+y(o.d,t)+"}")}return i},try:function(e,i){if($("try",!1,e.f,!0),!e.b||1!==e.b.length||"catch"!==e.b[0].n)throw t("native helper 'try' only accepts 1 block, 'catch'");var n="try{"+y(e.d,i)+"}",o=e.b[0];return n+"catch"+(o.res?"("+o.res+")":"")+"{"+y(o.d,i)+"}"},block:function(e,t){return $("block",e.b,e.f,!0),"if(!"+t.varName+"["+e.p+"]){tR+=("+_(e.d,"",t)+")()}else{tR+="+t.varName+"["+e.p+"]}"}}),T=new b({e:function(e){var t=String(e);return/[&<>"']/.test(t)?t.replace(/[&<>"']/g,x):t}}),k={varName:"it",autoTrim:[!1,"nl"],autoEscape:!0,defaultFilter:!1,tags:["{{","}}"],l:function(e,i){if("H"===e){var n=this.storage.helpers.get(i);if(n)return n;throw t("Can't find helper '"+i+"'")}if("F"===e){var o=this.storage.filters.get(i);if(o)return o;throw t("Can't find filter '"+i+"'")}},async:!1,storage:{helpers:S,nativeHelpers:E,filters:T,templates:A},prefixes:{h:"@",b:"#",i:"",r:"*",c:"/",e:"!"},cache:!1,plugins:[],useWith:!1};function C(e,t){var i={};return r(i,k),t&&r(i,t),e&&r(i,e),i.l.bind(i),i}function z(e,i){var n=C(i||{}),s=Function;if(n.async){if(!o)throw t("This environment doesn't support async/await");s=o}try{return new s(n.varName,"c","cb",m(e,n))}catch(i){throw i instanceof SyntaxError?t("Bad template syntax\n\n"+i.message+"\n"+Array(i.message.length+1).join("=")+"\n"+m(e,n)):i}}function O(e,t){var i;return t.cache&&t.name&&t.storage.templates.get(t.name)?t.storage.templates.get(t.name):(i="function"==typeof e?e:z(e,t),t.cache&&t.name&&t.storage.templates.define(t.name,i),i)}k.l.bind(k),e.compile=z,e.compileScope=y,e.compileScopeIntoFunction=_,e.compileToString=m,e.defaultConfig=k,e.filters=T,e.getConfig=C,e.helpers=S,e.nativeHelpers=E,e.parse=p,e.render=function(e,i,o,s){var r=C(o||{});if(!r.async)return O(e,r)(i,r);if(!s){if("function"==typeof n)return new n(function(t,n){try{t(O(e,r)(i,r))}catch(e){n(e)}});throw t("Please provide a callback function, this env doesn't support Promises")}try{O(e,r)(i,r,s)}catch(e){return s(e)}},e.templates=A,Object.defineProperty(e,"__esModule",{value:!0})}(Pe.exports)),Pe.exports}var je=Ne();const Me=2;class Re{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}class Ue extends Re{constructor(e){if(super(e),this.it=W,e.type!==Me)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===W||null==e)return this._t=void 0,this.it=e;if(e===B)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}Ue.directiveName="unsafeHTML",Ue.resultType=1;const De=(e=>(...t)=>({_$litDirective$:e,values:t}))(Ue),He=e=>`<ha-icon icon="${e}"></ha-icon>`;function Ie(e,t){const i=e?.layout?.sensors?.type??"table";return L` <div class="sensors ${[e?.layout?.sensors?.labels??!0?"with-labels":"without-labels","list"===i?"as-list":"as-table"].join(" ")}">${t}</div> `}function Fe({hide:e=!1,hass:t,state:i,details:n,localize:o,openEntityPopover:s}){if(e||void 0===i)return;const{type:r,heading:a,icon:l,unit:c,decimals:d}=n;let h;if(process.env.DEBUG&&console.log("ST: infoItem",{state:i,details:n}),"relativetime"===r)h=L`
      <div class="sensor-value">
        <ha-relative-time .datetime=${i} .hass=${t}></ha-relative-time>
      </div>
    `;else if("object"==typeof i){const[e]=i.entity_id.split("."),n=["component",e,"state",i.attributes?.device_class??"_",""].join(".");let r,a="";if(void 0!==c){let e=i.state;"number"==typeof d&&(e=Ce(e,{decimals:d})),r=e,a=c?` ${c}`:""}else{const e=t.formatEntityState?.(i);r=e??o?.(i.state,n)??i.state,e||("number"==typeof d&&(r=Ce(r,{decimals:d})),a=i.attributes?.unit_of_measurement?` ${i.attributes.unit_of_measurement}`:"")}h=L`
      <div
        class="sensor-value clickable"
        @click="${()=>s?.(i.entity_id)}"
      >
        ${r}${a}
      </div>
    `}else{let e="number"==typeof d?Ce(i,{decimals:d}):i;h=L` <div class="sensor-value">${e}${c?` ${c}`:""}</div> `}if(!1===a)return h;const u=l?L` <ha-icon .icon=${l}></ha-icon> `:L` ${a}: `;return L`
    <div class="sensor-heading">${u}</div>
    ${h}
  `}je.defaultConfig.autoEscape=!1,je.filters.define("icon",He),je.filters.define("join",(e,t=", ")=>e.join(t)),je.filters.define("css",(e,t)=>`<span style="${Object.entries(t).reduce((e,[t,i])=>`${e}${t}:${i};`,"")}">${e}</span>`),je.filters.define("debug",e=>{try{return JSON.stringify(e)}catch{return`Not able to read valid JSON object from: ${e}`}});const Ve="dual";const Le={getSetpoints:e=>function(e){return"number"==typeof e.target_temp_high&&"number"==typeof e.target_temp_low?Ve:"single"}(e)===Ve?{target_temp_low:e.target_temp_low,target_temp_high:e.target_temp_high}:{temperature:e.temperature},getRange:e=>({min:e?.min_temp??null,max:e?.max_temp??null,step:e?.target_temp_step??null}),getCurrentValue:e=>e?.current_temperature??null,getCurrentValueTemplate:()=>"{{current_temperature|formatNumber}}",getSetpointService:()=>({domain:"climate",service:"set_temperature"}),getModeService:e=>`climate.set_${e}_mode`,getModePayloadKey:e=>`${e}_mode`,getModeAttribute:e=>`${e}_modes`,getDefaultControl:()=>["hvac","preset"],getLocalizationDomain:()=>"climate"},Be={climate:Le,fan:{getSetpoints:e=>({percentage:e?.percentage}),getRange:e=>({min:0,max:100,step:1}),getCurrentValue:e=>e?.percentage??null,getCurrentValueTemplate:()=>"{{percentage|formatNumber}}",getSetpointService:()=>({domain:"fan",service:"set_percentage"}),getModeService:e=>"direction"===e?"fan.set_direction":"oscillating"===e?"fan.oscillate":`fan.set_${e}_mode`,getModePayloadKey:e=>"direction"===e?"direction":"oscillating"===e?"oscillating":`${e}_mode`,getModeAttribute:e=>"direction"===e?"direction":"oscillating"===e?"oscillating":`${e}_modes`,getDefaultControl:()=>["preset"],transformModePayloadValue:(e,t)=>"oscillating"===e?"true"===t:t,getLocalizationDomain:()=>"fan"},humidifier:{getSetpoints:e=>({humidity:e?.humidity}),getRange:e=>({min:e?.min_humidity??0,max:e?.max_humidity??100,step:1}),getCurrentValue:e=>e?.current_humidity??null,getCurrentValueTemplate:()=>"{{current_humidity|formatNumber}}",getSetpointService:()=>({domain:"humidifier",service:"set_humidity"}),getModeService:e=>"mode"===e?"humidifier.set_mode":`humidifier.set_${e}`,getModePayloadKey:e=>"mode"===e?"mode":e,getModeAttribute:e=>"mode"===e?"available_modes":`${e}_modes`,getDefaultControl:()=>["mode"],getLocalizationDomain:()=>"humidifier"}};function We(e){if(!e)return Le;const t=e.split(".")[0];return Be[t]??Le}var qe;function Ke({state:e,mode:t,modeOptions:i,localize:n,setMode:o}){const{type:s,hide_when_off:r,mode:a="none",list:l,name:c}=t;if(0===l.length||r&&e===qe.OFF)return null;const d="hvac"===s?"operation":`${s}_mode`;let h=c||n(`ui.card.climate.${d}`);if(h===`ui.card.climate.${d}`){const e=`state_attributes.climate.${"hvac"===s?"hvac":s}_mode`;h=n(e),h===e&&(h="operation"===d?"Operation":"Mode")}const u=i?.headings??!1;return L`
    <div class="modes ${u?"heading":""}" role="group" aria-label=${h}>
      ${u?L` <div class="mode-title">${h}</div> `:""}
      ${l.map(({value:e,icon:t,name:r})=>L`
          <div
            class="mode-item ${e===a?"active "+a:""}"
            role="button"
            tabindex="0"
            aria-pressed=${e===a?"true":"false"}
            aria-label=${r||e}
            @click=${()=>o(s,e)}
            @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),o(s,e))}}
          >
            ${(e=>e?!1===i?.icons?null:L` <ha-icon class="mode-icon" .icon=${e}></ha-icon> `:null)(t)} ${(e=>!1===e||!1===i?.names?null:"hvac"===s?n(e,"component.climate.state._."):n(e,`component.climate.entity_component._.state_attributes.${s}_mode.state.`)||n(e,`state_attributes.climate.${s}_mode.`))(r)}
          </div>
        `)}
    </div>
  `}!function(e){e.OFF="off",e.HEAT="heat",e.COOL="cool",e.HEAT_COOL="heat_cool",e.AUTO="auto",e.DRY="dry",e.FAN_ONLY="fan_only"}(qe||(qe={}));const Je={auto:"mdi:radiator",cooling:"mdi:snowflake",fan:"mdi:fan",heating:"mdi:radiator",idle:"mdi:radiator-disabled",off:"mdi:radiator-off"},Ye={auto:"mdi:fan-auto",cool:"hass:snowflake",dry:"hass:water-percent",fan_only:"hass:fan",heat_cool:"hass:autorenew",heat:"hass:fire",off:"mdi:power",none:"mdi:minus-circle-outline",eco:"mdi:leaf",away:"mdi:home-export-outline",boost:"mdi:rocket-launch",comfort:"mdi:sofa",home:"mdi:home",sleep:"mdi:sleep",activity:"mdi:run",on:"mdi:fan",automatic:"mdi:fan-auto",normal:"mdi:fan",low:"mdi:fan-speed-1",medium:"mdi:fan-speed-2",high:"mdi:fan-speed-3",turbo:"mdi:fan-alert",powerful:"mdi:fan-plus",quiet:"mdi:fan-minus",silent:"mdi:fan-minus",1:"mdi:fan-speed-1",2:"mdi:fan-speed-2",3:"mdi:fan-speed-3",4:"mdi:fan-plus",5:"mdi:fan-alert",vertical:"mdi:arrow-up-down",top:"mdi:arrow-up","top-middle":"mdi:arrow-top-right",middle:"mdi:arrow-collapse-vertical","middle-bottom":"mdi:arrow-bottom-right",bottom:"mdi:arrow-down",upper:"mdi:arrow-up",lower:"mdi:arrow-down",horizontal:"mdi:arrow-left-right",left:"mdi:arrow-left","center-left":"mdi:arrow-top-left",center:"mdi:arrow-collapse-horizontal","center-right":"mdi:arrow-top-right",right:"mdi:arrow-right",both:"mdi:arrow-all"};function Ge(e,t){const i=t.states[e.entity];if(!i)return null;let n="";return n=!0===e?.name?i.attributes.friendly_name:e?.name??"",{entity:i,label:n,icon:e?.icon??!1}}function Ze(e,t){return Array.isArray(e)?e.filter(({entity:e})=>Boolean(t.states?.[e])).map(({entity:e,...i})=>({...i,state:t.states[e],entity:e})):[]}var Qe;!function(e){e.HVAC="hvac",e.FAN="fan",e.PRESET="preset",e.SWING="swing"}(Qe||(Qe={}));Object.values(Qe),Qe.HVAC,Qe.PRESET;const Xe="hass:chevron-up",et="hass:chevron-down",tt="mdi:plus",it="mdi:minus",nt={temperature:!1,state:!1};function ot(e,t,i={},n=`${e}_modes`){let o=t[n];return"boolean"==typeof o&&(o=["false","true"]),Array.isArray(o)?o.filter(e=>function(e,t){if("object"==typeof t[e])return!1!==t[e].include;return t?.[e]??!0}(e,i)).map(e=>{const t=String(e),n="object"==typeof i[t]?i[t]:{};return{icon:Ye[t]??Ye[t.toLowerCase()],value:t,name:t,...n}}):[]}class st extends ae{constructor(){super(...arguments),this.modes=[],this._hass={},this.sensors=[],this.showSensors=!0,this.stepSize=.5,this._values={},this._updatingValues=!1,this._hide=nt,this._updatingValuesTimeout=null,this._needsRecompute=!0,this._extTempEntity=null,this._holdTimer=null,this._holdFired=!1,this._clickCount=0,this._clickTimer=null,this._debouncedSetTemperature=ke(e=>{const{domain:t,service:i,data:n={}}=this.service;this._callAction(`${t}.${i}`,{entity_id:this.config.entity,...n,...e})},{wait:500}),this.localize=(e,t="")=>{const i=`${t}${e}`;return this._hass.localize(i)||e},this.toggleEntityChanged=e=>{if(!this.header||!this.header.toggle)return;const t=e.target;this._callAction(t.checked?"homeassistant.turn_on":"homeassistant.turn_off",{entity_id:this.header.toggle.entity?.entity_id})},this.setMode=(e,t)=>{if(e&&t){const i=We(this.config.entity),n=i.transformModePayloadValue?i.transformModePayloadValue(e,t):t;this._callAction(i.getModeService(e),{entity_id:this.config.entity,[i.getModePayloadKey(e)]:n}),de(this,"haptic","light")}else de(this,"haptic","failure")},this.openEntityPopover=(e=null)=>{de(this,"hass-more-info",{entityId:e||this.config.entity})},this._onActionPointerDown=e=>{0!==e.button&&"mouse"===e.pointerType||(this._holdFired=!1,this._holdTimer&&clearTimeout(this._holdTimer),this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._dispatchAction("hold")},st.HOLD_MS))},this._onActionPointerUp=()=>{this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onActionClick=e=>{e.preventDefault(),this._holdFired?this._holdFired=!1:(this._clickCount+=1,1===this._clickCount?(this._clickTimer&&clearTimeout(this._clickTimer),this._clickTimer=setTimeout(()=>{this._clickCount=0,this._clickTimer=null,this._dispatchAction("tap")},st.DOUBLE_TAP_MS)):(this._clickTimer&&clearTimeout(this._clickTimer),this._clickTimer=null,this._clickCount=0,this._dispatchAction("double_tap")))}}static get styles(){return ce}_callAction(e,t){if(this._hass.performAction)this._hass.performAction({action:e,data:t});else{const i=e.split(".");if(i.length<2)return;this._hass.callService(i[0],i.slice(1).join("."),t)}}static getConfigElement(){return window.document.createElement(`${e}-editor`)}static getStubConfig(e){return{entity:Object.keys(e.states).find(e=>e.startsWith("climate.")||e.startsWith("fan.")||e.startsWith("humidifier."))??""}}setConfig(e){if(!e?.entity)throw new Error("simple-thermostat: entity is required");this.config={decimals:1,...e},this.service=function(e,t=Le){return e||t.getSetpointService()}(this.config.service??!1,We(this.config.entity)),this._needsRecompute=!0}disconnectedCallback(){super.disconnectedCallback(),this._updatingValuesTimeout&&(clearTimeout(this._updatingValuesTimeout),this._updatingValuesTimeout=null),this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null),this._clickTimer&&(clearTimeout(this._clickTimer),this._clickTimer=null),this._debouncedSetTemperature?.cancel?.()}updated(e){super.updated(e);const t=Array.from(this.renderRoot.querySelectorAll("[with-hass]"));for(const e of Array.from(t))Array.from(e.attributes).forEach(t=>{t.name.startsWith("fwd-")&&(e[t.name.replace("fwd-","")]=t.value)}),e.hass=this._hass}set hass(e){if(!this.config?.entity||!e?.states)return;this._hass=e;const t=e.states[this.config.entity];if(!t)return void(void 0!==this.entity&&(this.entity=void 0));const i=this.config.current_value_entity??this.config.current_temperature_entity,n=i?e.states[i]:null;if(this.entity===t&&this._extTempEntity===n&&!this._needsRecompute)return;this._extTempEntity=n,this._needsRecompute=!1,this.entity=t,this.header=function(e,t,i){if(!1===e)return!1;let n;n="string"==typeof e?.name?e.name:!1!==e?.name&&t.attributes.friendly_name;let o=t.attributes.hvac_action?Je:Ye;return void 0!==e?.icon&&(o=e.icon),{name:n,icon:o,toggle:e?.toggle?Ge(e.toggle,i):null,faults:Ze(e?.faults,i)}}(!1!==this.config.header&&(this.config.header??{}),t,e);const o=t.attributes,s=We(this.config.entity);let r=function(e,t,i=Le){return!1===e?{}:e?Object.entries(e).reduce((e,[i,n])=>(n?.hide||(e[i]=t?.[i]),e),{}):i.getSetpoints(t)}(this.config.setpoints,o,s);this._updatingValues&&function(e,t){const i=Object.keys(e);return i.length===Object.keys(t).length&&!i.some(i=>e?.[i]!==t?.[i])}(r,this._values)?(this._updatingValues=!1,this._updatingValuesTimeout&&(clearTimeout(this._updatingValuesTimeout),this._updatingValuesTimeout=null)):this._updatingValues||(this._values=r);const a=s.getDefaultControl(),l=e=>void 0!==o[s.getModeAttribute(e)],c=e=>e.filter(l).map(e=>({type:e,hide_when_off:!1,list:ot(e,o,{},s.getModeAttribute(e))}));let d=[];if(!1===this.config.control)d=[];else if(Array.isArray(this.config.control))d=c(this.config.control);else if("object"==typeof this.config.control){const e=Object.entries(this.config.control);d=e.length>0?e.filter(([e])=>l(e)).map(([e,t])=>{const{_name:i,_hide_when_off:n,...r}=t;return{type:e,hide_when_off:n,name:i,list:ot(e,o,r,s.getModeAttribute(e))}}):c(a)}else d=c(a);if(this.modes=d.map(e=>{const i=e.list??[];if(e.type===Qe.HVAC){const n=Object.values(qe),o=[],s=[];return i.forEach(e=>{const t=n.indexOf(e.value);t>=0?o[t]=e:s.push(e)}),{...e,list:[...o.filter(Boolean),...s],mode:t.state}}const n=o[s.getModePayloadKey(e.type)];return{...e,mode:String(n)}}),this.config.step_size)this.stepSize=+this.config.step_size;else{const e=s.getRange(o).step;null!=e&&(this.stepSize=+e)}if(this._hide={...nt,...this.config.hide},!1===this.config.sensors)this.showSensors=!1;else if(3===this.config.version){this.sensors=[];const i=this.config.sensors??[],n=this.config.entity,o=i.map((e,i)=>{const o=e?.entity??n;let s=t;return e?.entity&&(s=this._hass.states?.[e.entity]),{id:e?.id??String(i),label:e?.label,template:e?.template??"",show:!1!==e?.show,entityId:o,context:s}}),r=o.map(e=>e.id),a=[];if(r.includes("state")||a.push({id:"state",label:"{{ui.operation}}",template:"{{state.text}}",entityId:n,context:t,show:!0}),!r.includes("temperature")){const i=this.config.current_value_entity??this.config.current_temperature_entity??n,o=i!==n&&e.states[i];a.push({id:"temperature",label:"{{ui.currently}}",template:o?"{{state.raw|formatNumber}}":s.getCurrentValueTemplate(),entityId:i,context:o?e.states[i]:t,show:!0})}this.sensors=[...a,...o]}else this.config.sensors&&(this.sensors=this.config.sensors.map(({name:t,entity:i,attribute:n,unit:s,...r})=>{let a;const l=[t];return i?(a=e.states[i],l.push(a?.attributes?.friendly_name),n&&(a=a?.attributes?.[n])):n&&n in o&&(a=o[n],l.push(n)),l.push(i),{...r,name:l.find(e=>!!e),state:a,entity:i,unit:s}}))}render(){const{_hide:e,_values:t,_updatingValues:i,config:n,entity:o}=this,s=[];if(this.stepSize<1&&0===this.config.decimals&&s.push(L`
        <ha-alert alert-type="warning">
          Decimals is set to 0 and step_size is lower than 1. Decrementing a
          setpoint will likely not work. Change one of the settings to clear
          this warning.
        </ha-alert>
      `),!o)return this._hass?.states?L`
        <ha-alert alert-type="error">
          Entity not available: ${n.entity}
        </ha-alert>
      `:L`<ha-card class="loading"></ha-card>`;const{attributes:{hvac_action:r}}=o,a=We(this.config.entity),{min:l,max:c}=a.getRange(o.attributes),d=this.getUnit(),h=this.config?.layout?.step??"row",u="row"===h,p=["unavailable","unknown"].includes(o.state),m=e=>"string"==typeof e?e.replace(/[^a-z0-9_-]/gi,""):"",f=[!this.header&&"no-header",m(r),p&&m(o.state)].filter(e=>!!e);let g;return 3===this.config.version?(g=this.sensors.filter(e=>!1!==e.show).map(e=>function({context:e,entityId:t,template:i="{{state.text}}",label:n,hass:o,variables:s={},config:r,localize:a,openEntityPopover:l}){if(!e)return null;const{state:c,attributes:d}=e,[h]=t.split("."),u=["climate","fan","humidifier"].includes(h)?`ui.card.${h}.`:"ui.card.climate.",p=Object.fromEntries(["currently","operation","fan_mode","swing_mode","preset_mode","humidity"].map(e=>[e,o.localize?.(`${u}${e}`)??e])),m={...d,state:{raw:c,text:a(c,`component.${h}.state._.`)},ui:p,v:s};je.filters.define("formatNumber",(e,t={decimals:r.decimals})=>String(Ce(e,t))),je.filters.define("relativetime",e=>`<ha-relative-time fwd-datetime=${e} with-hass></ha-relative-time>`),je.filters.define("translate",(e,t="")=>a(e,t||"climate"!==h&&"humidifier"!==h?t:`state_attributes.${h}.${e}`));const f=e=>{try{return je.render(e,m,{useWith:!0})}catch{return`[template error: ${e}]`}},g=f(i);if(!1===n||!1===r?.layout?.sensors?.labels)return L`<div class="sensor-value">${De(g)}</div>`;const v=n||"{{friendly_name}}",_=v.match(/^(mdi|hass):.*/)?He(v):f(v);return L`
    <div class="sensor-heading">${De(_)}</div>
    <div class="sensor-value">${De(g)}</div>
  `}({...e,variables:this.config.variables,hass:this._hass,config:this.config,localize:this.localize,openEntityPopover:this.openEntityPopover})),g=Ie(this.config,g)):g=this.showSensors?function({_hide:e,entity:t,unit:i,hass:n,sensors:o,config:s,localize:r,openEntityPopover:a}){const{state:l,attributes:{hvac_action:c}}=t,d=We(s?.entity),h=d.getCurrentValue(t.attributes),u=s?.current_value_entity??s?.current_temperature_entity,p=u?n.states?.[u]?.state:void 0,m=void 0!==p?p:h,f=s?.layout?.sensors?.labels??!0,g=d.getLocalizationDomain();let v=n.formatEntityState?.(t)??r(l,`component.${g}.state._.`);c&&(v=[r(c,`component.${g}.entity_component._.state_attributes.hvac_action.state.`)||r(c,`state_attributes.${g}.hvac_action.`),` (${v})`].join(""));const _=[Fe({hide:e.temperature,state:`${Ce(m,s)}${i||""}`,hass:n,details:{heading:!!f&&(s?.label?.temperature??r(`ui.card.${g}.currently`))}}),Fe({hide:e.state,state:v,hass:n,details:{heading:!!f&&(s?.label?.state??r("ui.panel.lovelace.editor.card.generic.state"))}}),...o.map(({name:e,state:t,...i})=>Fe({state:t,hass:n,localize:r,openEntityPopover:a,details:{...i,heading:f&&e}}))].filter(Boolean);return Ie(s,_)}({_hide:e,unit:d,hass:this._hass,entity:o,sensors:this.sensors,config:this.config,localize:this.localize,openEntityPopover:this.openEntityPopover}):"",L`
      <ha-card class="${f.join(" ")}">
        ${this.config.styles?L`<style>
              ${this.config.styles}
            </style>`:W}
        ${s}
        ${ze({header:this.header,toggleEntityChanged:this.toggleEntityChanged,entity:o,openEntityPopover:this.openEntityPopover})}
        <section class="body">
          ${g}
          ${Object.entries(t).map(([e,t])=>{const o=["string","number"].includes(typeof t),s=!1!==d&&o;return L`
              <div class="current-wrapper ${h}">
                <ha-icon-button
                  ?disabled=${null!==c&&t>=c}
                  class="thermostat-trigger"
                  aria-label="Increase ${e}"
                  .label=${`Increase ${e}`}
                  @click="${()=>this.setTemperature(this.stepSize,e)}"
                >
                  <ha-icon .icon=${u?tt:Xe}></ha-icon>
                </ha-icon-button>

                <h3
                  @pointerdown=${this._onActionPointerDown}
                  @pointerup=${this._onActionPointerUp}
                  @pointercancel=${this._onActionPointerUp}
                  @click=${this._onActionClick}
                  @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._dispatchAction("tap"))}}
                  role="button"
                  tabindex="0"
                  aria-label=${`${e}: ${Ce(t,{...n,locale:this._hass?.locale})}${s?` ${d}`:""}`}
                  class=${i?"current--value updating":"current--value"}
                >
                  ${Ce(t,{...n,locale:this._hass?.locale})}
                  ${s?L`<span class="current--unit">${d}</span>`:W}
                </h3>
                <ha-icon-button
                  ?disabled=${null!==l&&t<=l}
                  class="thermostat-trigger"
                  aria-label="Decrease ${e}"
                  .label=${`Decrease ${e}`}
                  @click="${()=>this.setTemperature(-this.stepSize,e)}"
                >
                  <ha-icon .icon=${u?it:et}></ha-icon>
                </ha-icon-button>
              </div>
            `})}
        </section>

        ${this.modes.map(e=>Ke({state:o.state,mode:e,localize:this.localize,modeOptions:this.config?.layout?.mode??{},setMode:this.setMode}))}
      </ha-card>
    `}setTemperature(e,t){this._updatingValues=!0,this._updatingValuesTimeout&&clearTimeout(this._updatingValuesTimeout),this._updatingValuesTimeout=setTimeout(()=>{this._updatingValues=!1,this._updatingValuesTimeout=null},1e4);const i=this._values[t],n=Number(i)+e,{decimals:o}=this.config;this._values={...this._values,[t]:+Ce(n,{decimals:o})},this._debouncedSetTemperature(this._values)}_dispatchAction(e){const t="tap"===e?"tap_action":"hold"===e?"hold_action":"double_tap_action",i=this.config?.[t]??("tap"===e?{action:"more-info"}:{action:"none"});this._runAction(i)}_runAction(e){switch(e.action){case"none":return;case"more-info":return void de(this,"hass-more-info",{entityId:this.config.entity});case"navigate":return history.pushState(null,"",e.navigation_path),void de(window,"location-changed",{replace:!1});case"url":return void window.open(e.url_path);case"toggle":return void this._callAction("homeassistant.toggle",{entity_id:this.config.entity});case"call-service":return void this._callAction(e.service,e.service_data??{})}}getCardSize(){let e=2;return!1!==this.config?.header&&(e+=1),!1!==this.config?.control&&(e+=1),e}getUnit(){return void 0!==this.config.unit?this.config.unit:this._hass.config?.unit_system?.temperature??!1}}st.HOLD_MS=500,st.DOUBLE_TAP_MS=250,_e([$e()],st.prototype,"config",void 0),_e([$e()],st.prototype,"header",void 0),_e([$e()],st.prototype,"service",void 0),_e([$e()],st.prototype,"modes",void 0),_e([$e()],st.prototype,"entity",void 0),_e([$e()],st.prototype,"sensors",void 0),_e([$e()],st.prototype,"showSensors",void 0),_e([$e()],st.prototype,"_values",void 0),_e([$e()],st.prototype,"_updatingValues",void 0),_e([$e()],st.prototype,"_hide",void 0),customElements.define(e,st),customElements.define(`${e}-editor`,class extends ae{constructor(){super(...arguments),this._valueChanged=e=>{const t=e.detail.value;de(this,"config-changed",{config:this._applyFormChange(t)})},this._computeLabel=e=>pe[e.name]??e.name,this._stylesChanged=e=>{const t=e.detail?.value,i=ue(this.config);""===t||null==t?delete i.styles:i.styles=t,de(this,"config-changed",{config:i})}}static get styles(){return ce}static get properties(){return{hass:{},config:{}}}setConfig(e){this.config=e||{}}_openLink(){window.open("https://github.com/duczz/ha-simple-thermostat/blob/master/README.md")}_buildFormData(){return{entity:this.config.entity??"",current_value_entity:this.config.current_value_entity??"",show_header:!1!==this.config.header,decimals:this.config.decimals??1,unit:this.config.unit??"","layout.step":this.config.layout?.step??"row",step_size:null!=this.config.step_size?String(this.config.step_size):"auto",fallback:this.config.fallback??"","hide.temperature":!0===this.config.hide?.temperature,"hide.state":!0===this.config.hide?.state,"label.temperature":this.config.label?.temperature??"","label.state":this.config.label?.state??"","layout.sensors.type":this.config.layout?.sensors?.type??"table","layout.sensors.labels":!1!==this.config.layout?.sensors?.labels,"layout.mode.names":!1!==this.config.layout?.mode?.names,"layout.mode.icons":!1!==this.config.layout?.mode?.icons,"layout.mode.headings":!0===this.config.layout?.mode?.headings,show_preset:ve(this.config,"preset"),show_fan:ve(this.config,"fan"),show_swing:ve(this.config,"swing"),name:this.config.header&&"object"==typeof this.config.header?this.config.header.name??"":"",icon:this.config.header&&"object"==typeof this.config.header&&"string"==typeof this.config.header.icon?this.config.header.icon:"","toggle.entity":this.config.header?.toggle?.entity??"","toggle.name":this.config.header?.toggle?.name??"","toggle.icon":"string"==typeof this.config.header?.toggle?.icon?this.config.header.toggle.icon:"",tap_action:this.config.tap_action??{action:"more-info"},hold_action:this.config.hold_action??{action:"none"},double_tap_action:this.config.double_tap_action??{action:"none"}}}_applyFormChange(e){const t=ue(this.config),i=["entity","current_value_entity","decimals","unit","fallback","layout.step","layout.mode.names","layout.mode.icons","layout.mode.headings","layout.sensors.type","layout.sensors.labels","hide.temperature","hide.state","label.temperature","label.state","tap_action","hold_action","double_tap_action"];for(const n of i){const i=e[n];if(null==i||""===i)ge(t,n);else if(me.includes(n)&&"string"==typeof i){const e=Number(i);fe(t,n,Number.isNaN(e)?i:e)}else fe(t,n,i)}if(!1===e.show_header)t.header=!1;else{!1!==t.header&&null!=t.header||(t.header={});const i=e.name,n=e.icon,o=e["toggle.entity"],s=e["toggle.name"],r=e["toggle.icon"];i?t.header.name=i:delete t.header.name,n?t.header.icon=n:delete t.header.icon,o?(t.header.toggle=t.header.toggle||{},t.header.toggle.entity=o,s?t.header.toggle.name=s:delete t.header.toggle.name,r?t.header.toggle.icon=r:delete t.header.toggle.icon):delete t.header.toggle}if("auto"===e.step_size||""===e.step_size||null==e.step_size)delete t.step_size;else{const i=Number(e.step_size);t.step_size=Number.isNaN(i)?e.step_size:i}const n=["hvac","preset"],o=["hvac"];e.show_preset&&o.push("preset"),e.show_fan&&o.push("fan"),e.show_swing&&o.push("swing");const s=!1===e["layout.mode.names"],r=!1===e["layout.mode.icons"];return s&&r?t.control=!1:o.length===n.length&&o.every((e,t)=>e===n[t])?delete t.control:t.control=o,t}render(){if(!this.hass||!this.config)return L``;const e=function(e){const t=[];return!1!==e.header&&t.push({type:"grid",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"toggle.entity",selector:{entity:{}}},{name:"toggle.name",selector:{text:{}}},...e.header?.toggle?.entity?[{name:"toggle.icon",selector:{icon:{}}}]:[]),[{name:"entity",required:!0,selector:{entity:{domain:["climate","fan","humidifier"]}}},{name:"current_value_entity",selector:{entity:{domain:["sensor","input_number"]}}},{type:"expandable",title:"Header",schema:[{name:"show_header",selector:{boolean:{}}},...t]},{type:"expandable",title:"Mode Controls",schema:[{type:"grid",column_min_width:"130px",schema:[{name:"show_preset",selector:{boolean:{}}},{name:"show_fan",selector:{boolean:{}}},{name:"show_swing",selector:{boolean:{}}}]},{type:"grid",column_min_width:"130px",schema:[{name:"layout.mode.names",selector:{boolean:{}}},{name:"layout.mode.icons",selector:{boolean:{}}},{name:"layout.mode.headings",selector:{boolean:{}}}]}]},{type:"expandable",title:"Layout & Display",schema:[{type:"grid",schema:[{name:"decimals",selector:{number:{min:0,max:5,step:1,mode:"box"}}},{name:"unit",selector:{text:{}}}]},{type:"grid",schema:[{name:"layout.step",selector:{select:{mode:"dropdown",options:[{value:"row",label:"Row"},{value:"column",label:"Column"}]}}},{name:"step_size",selector:{select:{mode:"dropdown",options:[{value:"auto",label:"Auto (from entity)"},{value:"0.1",label:"0.1"},{value:"0.5",label:"0.5"},{value:"1",label:"1"}]}}}]},{name:"fallback",selector:{text:{}}},{type:"grid",column_min_width:"160px",schema:[{name:"hide.temperature",selector:{boolean:{}}},{name:"hide.state",selector:{boolean:{}}}]},{type:"grid",column_min_width:"160px",schema:[{name:"label.temperature",selector:{text:{}}},{name:"label.state",selector:{text:{}}}]},{type:"grid",column_min_width:"160px",schema:[{name:"layout.sensors.type",selector:{select:{mode:"dropdown",options:[{value:"table",label:"Table"},{value:"list",label:"List"}]}}},{name:"layout.sensors.labels",selector:{boolean:{}}}]}]},{type:"expandable",title:"Interactions",schema:[{name:"tap_action",selector:{ui_action:{default_action:"more-info"}}},{name:"hold_action",selector:{ui_action:{default_action:"none"}}},{name:"double_tap_action",selector:{ui_action:{default_action:"none"}}}]}]}(this.config),i=this._buildFormData();return L`
      <div class="card-config">
        <ha-form
          .hass=${this.hass}
          .data=${i}
          .schema=${e}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>

        <ha-expansion-panel .header=${"Custom CSS"} outlined>
          <div class="panel-content">
            <div class="styles-editor">
              <ha-code-editor
                mode="yaml"
                autocomplete-entities
                autocomplete-icons
                .hass=${this.hass}
                .value=${this.config.styles??""}
                .configValue=${"styles"}
                @value-changed=${this._stylesChanged}
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
          <span class="editor-footer__version">v${t} · ${he}</span>
        </div>
      </div>
    `}}),console.info(`%c${e}: ${t}`,"font-weight: bold"),window.customCards=window.customCards||[],window.customCards.push({type:e,name:"Simple Thermostat",preview:!1,description:"A different take on the thermostat card",documentationURL:"https://github.com/duczz/ha-simple-thermostat"});
