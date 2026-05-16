!function(){const t={DEBUG:!1,BUILD_TIME:"16.05.2026, 10:42"};try{if(process)return process.env=Object.assign({},process.env),void Object.assign(process.env,t)}catch(t){}globalThis.process={env:t}}();var t="simple-thermostat",e="2.3.3";function i(t,e,i,n){var o,s=arguments.length,r=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(s<3?o(r):s>3?o(e,i,r):o(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const n=globalThis,o=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let a=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(o&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const l=o?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:u,getOwnPropertySymbols:p,getPrototypeOf:m}=Object,f=globalThis,g=f.trustedTypes,v=g?g.emptyScript:"",y=f.reactiveElementPolyfillSupport,_=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!c(t,e),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&d(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:o}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const s=n?.call(this);o?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=m(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...u(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(o)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),o=n.litNonce;void 0!==o&&e.setAttribute("nonce",o),e.textContent=i.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=n;const s=o.fromAttribute(e,t.type);this[n]=s??this._$Ej?.get(n)??s,this._$Em=null}}requestUpdate(t,e,i,n=!1,o){if(void 0!==t){const s=this.constructor;if(!1===n&&(o=this[t]),i??=s.getPropertyOptions(t),!((i.hasChanged??$)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:o},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==o||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[_("elementProperties")]=new Map,x[_("finalized")]=new Map,y?.({ReactiveElement:x}),(f.reactiveElementVersions??=[]).push("2.1.2");const A=globalThis,S=t=>t,E=A.trustedTypes,C=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,T="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+k,P=`<${z}>`,O=document,M=()=>O.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,j=Array.isArray,R="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,H=/>/g,I=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,F=/"/g,L=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),K=new WeakMap,Y=O.createTreeWalker(O,129);function J(t,e){if(!j(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,n=[];let o,s=2===e?"<svg>":3===e?"<math>":"",r=U;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===U?"!--"===l[1]?r=D:void 0!==l[1]?r=H:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=I):void 0!==l[3]&&(r=I):r===I?">"===l[0]?(r=o??U,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?I:'"'===l[3]?F:V):r===F||r===V?r=I:r===D||r===H?r=U:(r=I,o=void 0);const h=r===I&&t[e+1].startsWith("/>")?" ":"";s+=r===U?i+P:c>=0?(n.push(a),i.slice(0,c)+T+i.slice(c)+k+h):i+k+(-2===c?e:h)}return[J(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class Z{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let o=0,s=0;const r=t.length-1,a=this.parts,[l,c]=G(t,e);if(this.el=Z.createElement(l,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=Y.nextNode())&&a.length<r;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(T)){const e=c[s++],i=n.getAttribute(t).split(k),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?it:"?"===r[1]?nt:"@"===r[1]?ot:et}),n.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:o}),n.removeAttribute(t));if(L.test(n.tagName)){const t=n.textContent.split(k),e=t.length-1;if(e>0){n.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],M()),Y.nextNode(),a.push({type:2,index:++o});n.append(t[e],M())}}}else if(8===n.nodeType)if(n.data===z)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=n.data.indexOf(k,t+1));)a.push({type:7,index:o}),t+=k.length-1}o++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,n){if(e===W)return e;let o=void 0!==n?i._$Co?.[n]:i._$Cl;const s=N(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(t),o._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=o:i._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,n)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??O).importNode(e,!0);Y.currentNode=n;let o=Y.nextNode(),s=0,r=0,a=i[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new tt(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new st(o,this,t)),this._$AV.push(e),a=i[++r]}s!==a?.index&&(o=Y.nextNode(),s++)}return Y.currentNode=O,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),N(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>j(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new X(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new Z(t)),e}k(t){j(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const o of t)n===e.length?e.push(i=new tt(this.O(M()),this.O(M()),this,this.options)):i=e[n],i._$AI(o),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,n){const o=this.strings;let s=!1;if(void 0===o)t=Q(this,t,e,0),s=!N(t)||t!==this._$AH&&t!==W,s&&(this._$AH=t);else{const n=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Q(this,n[i+r],e,r),a===W&&(a=this._$AH[r]),s||=!N(a)||a!==this._$AH[r],a===q?t=q:t!==q&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}s&&!n&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class nt extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class ot extends et{constructor(t,e,i,n,o){super(t,e,i,n,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??q)===W)return;const i=this._$AH,n=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==q&&(i===q||n);n&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const rt=A.litHtmlPolyfillSupport;rt?.(Z,tt),(A.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;let lt=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let o=n._$litPart$;if(void 0===o){const t=i?.renderBefore??null;n._$litPart$=o=new tt(e.insertBefore(M(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const dt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:$},ht=(t=dt,e,i)=>{const{kind:n,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(void 0===s&&globalThis.litPropertyMetadata.set(o,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===n){const{name:n}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(n,o,t,!0,i)},init(e){return void 0!==e&&this.C(n,void 0,t,e),e}}}if("setter"===n){const{name:n}=i;return function(i){const o=this[n];e.call(this,i),this.requestUpdate(n,o,t,!0,i)}}throw Error("Unsupported decorator location: "+n)};function ut(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const n=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),n?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ut({...t,state:!0,attribute:!1})}var mt=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new a(i,t,s)})`:host {
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
`;function ft(t,e,i,n={}){i=null==i?{}:i;const o=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return o.detail=i,t.dispatchEvent(o),o}!function(t,e){void 0===e&&(e={});var i=e.insertAt;if(t&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],o=document.createElement("style");o.type="text/css","top"===i&&n.firstChild?n.insertBefore(o,n.firstChild):n.appendChild(o),o.styleSheet?o.styleSheet.cssText=t:o.appendChild(document.createTextNode(t))}}(mt);const gt="dual";const vt={getSetpoints:t=>function(t){return"number"==typeof t.target_temp_high&&"number"==typeof t.target_temp_low?gt:"single"}(t)===gt?{target_temp_low:t.target_temp_low,target_temp_high:t.target_temp_high}:{temperature:t.temperature},getRange:t=>({min:t?.min_temp??null,max:t?.max_temp??null,step:t?.target_temp_step??null}),getCurrentValue:t=>t?.current_temperature??null,getCurrentValueTemplate:()=>"{{current_temperature|formatNumber}}",getSetpointService:()=>({domain:"climate",service:"set_temperature"}),getModeService:t=>`climate.set_${t}_mode`,getModePayloadKey:t=>`${t}_mode`,getModeAttribute:t=>`${t}_modes`,getDefaultControl:()=>["hvac","preset"],getLocalizationDomain:()=>"climate"},yt={climate:vt,fan:{getSetpoints:t=>({percentage:t?.percentage}),getRange:t=>({min:0,max:100,step:1}),getCurrentValue:t=>t?.percentage??null,getCurrentValueTemplate:()=>"{{percentage|formatNumber}}",getSetpointService:()=>({domain:"fan",service:"set_percentage"}),getModeService:t=>"direction"===t?"fan.set_direction":"oscillating"===t?"fan.oscillate":`fan.set_${t}_mode`,getModePayloadKey:t=>"direction"===t?"direction":"oscillating"===t?"oscillating":`${t}_mode`,getModeAttribute:t=>"direction"===t?"direction":"oscillating"===t?"oscillating":`${t}_modes`,getDefaultControl:()=>["preset"],transformModePayloadValue:(t,e)=>"oscillating"===t?"true"===e:e,getLocalizationDomain:()=>"fan"},humidifier:{getSetpoints:t=>({humidity:t?.humidity}),getRange:t=>({min:t?.min_humidity??0,max:t?.max_humidity??100,step:1}),getCurrentValue:t=>t?.current_humidity??null,getCurrentValueTemplate:()=>"{{current_humidity|formatNumber}}",getSetpointService:()=>({domain:"humidifier",service:"set_humidity"}),getModeService:t=>"mode"===t?"humidifier.set_mode":`humidifier.set_${t}`,getModePayloadKey:t=>"mode"===t?"mode":t,getModeAttribute:t=>"mode"===t?"available_modes":`${t}_modes`,getDefaultControl:()=>["mode"],getLocalizationDomain:()=>"humidifier"}};function _t(t){if(!t)return vt;const e=t.split(".")[0];return yt[e]??vt}const bt=process.env.BUILD_TIME,$t=t=>structuredClone(t);const wt={entity:"Entity (required)",current_value_entity:"Current temperature entity (optional)",show_header:"Show header",name:"Name",icon:"Icon","toggle.entity":"Toggle entity","toggle.name":"Toggle label","toggle.icon":"Toggle icon",show_preset:"Preset mode",show_fan:"Fan mode",show_swing:"Swing mode","layout.mode.names":"Show mode names","layout.mode.icons":"Show mode icons","layout.mode.headings":"Show mode headings",decimals:"Decimals",unit:"Unit","layout.step":"Step layout",step_size:"Step size",fallback:"Fallback text","hide.temperature":"Hide temperature","hide.state":"Hide state","label.temperature":"Temperature label","label.state":"State label","layout.sensors.type":"Sensor layout","layout.sensors.labels":"Show sensor labels",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action"};function xt(t,e,i){const n=e.split(".");let o=t;for(;n.length>1;){const t=n.shift();Object.hasOwn(o,t)||(o[t]={}),o=o[t]}o[n[0]]=i}function At(t,e){const i=e.split(".");let n=t;for(;i.length>1;){const t=i.shift();if(!n[t])return;n=n[t]}delete n[i[0]]}function St(t,e,i){const n=t.control;return!1!==n&&(Array.isArray(n)?n.includes(e):i.getDefaultControl().includes(e))}class Et extends lt{constructor(){super(...arguments),this._valueChanged=t=>{const e=t.detail.value;ft(this,"config-changed",{config:this._applyFormChange(e)})},this._computeLabel=t=>wt[t.name]??t.name,this._stylesChanged=t=>{const e=t.detail?.value,i=$t(this.config);""===e||null==e?delete i.styles:i.styles=e,ft(this,"config-changed",{config:i})}}static get styles(){return mt}setConfig(t){this.config=t||{}}_openLink(){window.open("https://github.com/duczz/ha-simple-thermostat/blob/master/README.md","_blank","noopener")}_buildFormData(){const t=_t(this.config.entity),e=this.config.header&&"object"==typeof this.config.header?this.config.header:{};return{entity:this.config.entity??"",current_value_entity:this.config.current_value_entity??"",show_header:!1!==this.config.header,decimals:this.config.decimals??1,unit:this.config.unit??"","layout.step":this.config.layout?.step??"row",step_size:null!=this.config.step_size?String(this.config.step_size):"auto",fallback:this.config.fallback??"","hide.temperature":!0===this.config.hide?.temperature,"hide.state":!0===this.config.hide?.state,"label.temperature":this.config.label?.temperature??"","label.state":this.config.label?.state??"","layout.sensors.type":this.config.layout?.sensors?.type??"table","layout.sensors.labels":!1!==this.config.layout?.sensors?.labels,"layout.mode.names":!1!==this.config.layout?.mode?.names,"layout.mode.icons":!1!==this.config.layout?.mode?.icons,"layout.mode.headings":!0===this.config.layout?.mode?.headings,show_preset:St(this.config,"preset",t),show_fan:St(this.config,"fan",t),show_swing:St(this.config,"swing",t),name:e.name??"",icon:"string"==typeof e.icon?e.icon:"","toggle.entity":e.toggle?.entity??"","toggle.name":e.toggle?.name??"","toggle.icon":"string"==typeof e.toggle?.icon?e.toggle.icon:"",tap_action:this.config.tap_action??{action:"more-info"},hold_action:this.config.hold_action??{action:"none"},double_tap_action:this.config.double_tap_action??{action:"none"}}}_applyFormChange(t){const e=$t(this.config),i=["entity","current_value_entity","decimals","unit","fallback","layout.step","layout.mode.names","layout.mode.icons","layout.mode.headings","layout.sensors.type","layout.sensors.labels","hide.temperature","hide.state","label.temperature","label.state","tap_action","hold_action","double_tap_action"];for(const n of i){const i=t[n];null==i||""===i?At(e,n):xt(e,n,i)}if(!1===t.show_header)e.header=!1;else{!1!==e.header&&null!=e.header||(e.header={});const i=t.name,n=t.icon,o=t["toggle.entity"],s=t["toggle.name"],r=t["toggle.icon"];i?e.header.name=i:delete e.header.name,n?e.header.icon=n:delete e.header.icon,o?(e.header.toggle=e.header.toggle||{},e.header.toggle.entity=o,s?e.header.toggle.name=s:delete e.header.toggle.name,r?e.header.toggle.icon=r:delete e.header.toggle.icon):delete e.header.toggle}if("auto"===t.step_size||""===t.step_size||null==t.step_size)delete e.step_size;else{const i=Number(t.step_size);e.step_size=Number.isNaN(i)?t.step_size:i}const n=_t(e.entity).getDefaultControl(),o=["hvac"];t.show_preset&&o.push("preset"),t.show_fan&&o.push("fan"),t.show_swing&&o.push("swing");const s=!1===t["layout.mode.names"],r=!1===t["layout.mode.icons"];return s&&r?e.control=!1:o.length===n.length&&o.every((t,e)=>t===n[e])?delete e.control:e.control=o,e}render(){if(!this.hass||!this.config)return B``;const t=function(t){const e=[];return!1!==t.header&&e.push({type:"grid",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"toggle.entity",selector:{entity:{}}},{name:"toggle.name",selector:{text:{}}},...t.header?.toggle?.entity?[{name:"toggle.icon",selector:{icon:{}}}]:[]),[{name:"entity",required:!0,selector:{entity:{domain:["climate","fan","humidifier"]}}},{name:"current_value_entity",selector:{entity:{domain:["sensor","input_number"]}}},{type:"expandable",title:"Header",schema:[{name:"show_header",selector:{boolean:{}}},...e]},{type:"expandable",title:"Mode Controls",schema:[{type:"grid",column_min_width:"130px",schema:[{name:"show_preset",selector:{boolean:{}}},{name:"show_fan",selector:{boolean:{}}},{name:"show_swing",selector:{boolean:{}}}]},{type:"grid",column_min_width:"130px",schema:[{name:"layout.mode.names",selector:{boolean:{}}},{name:"layout.mode.icons",selector:{boolean:{}}},{name:"layout.mode.headings",selector:{boolean:{}}}]}]},{type:"expandable",title:"Layout & Display",schema:[{type:"grid",schema:[{name:"decimals",selector:{number:{min:0,max:5,step:1,mode:"box"}}},{name:"unit",selector:{text:{}}}]},{type:"grid",schema:[{name:"layout.step",selector:{select:{mode:"dropdown",options:[{value:"row",label:"Row"},{value:"column",label:"Column"}]}}},{name:"step_size",selector:{select:{mode:"dropdown",options:[{value:"auto",label:"Auto (from entity)"},{value:"0.1",label:"0.1"},{value:"0.5",label:"0.5"},{value:"1",label:"1"}]}}}]},{name:"fallback",selector:{text:{}}},{type:"grid",column_min_width:"160px",schema:[{name:"hide.temperature",selector:{boolean:{}}},{name:"hide.state",selector:{boolean:{}}}]},{type:"grid",column_min_width:"160px",schema:[{name:"label.temperature",selector:{text:{}}},{name:"label.state",selector:{text:{}}}]},{type:"grid",column_min_width:"160px",schema:[{name:"layout.sensors.type",selector:{select:{mode:"dropdown",options:[{value:"table",label:"Table"},{value:"list",label:"List"}]}}},{name:"layout.sensors.labels",selector:{boolean:{}}}]}]},{type:"expandable",title:"Interactions",schema:[{name:"tap_action",selector:{ui_action:{default_action:"more-info"}}},{name:"hold_action",selector:{ui_action:{default_action:"none"}}},{name:"double_tap_action",selector:{ui_action:{default_action:"none"}}}]}]}(this.config),i=this._buildFormData();return B`
      <div class="card-config">
        <ha-form
          .hass=${this.hass}
          .data=${i}
          .schema=${t}
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
            <ha-svg-icon .path=${"M12 21.5C10.65 20.65 8.2 20 6.5 20C4.85 20 3.15 20.3 1.75 21.05C1.65 21.1 1.6 21.1 1.5 21.1C1.25 21.1 1 20.85 1 20.6V6C1.6 5.55 2.25 5.25 3 5C4.11 4.65 5.33 4.5 6.5 4.5C8.45 4.5 10.55 4.9 12 6C13.45 4.9 15.55 4.5 17.5 4.5C18.67 4.5 19.89 4.65 21 5C21.75 5.25 22.4 5.55 23 6V20.6C23 20.85 22.75 21.1 22.5 21.1C22.4 21.1 22.35 21.1 22.25 21.05C20.85 20.3 19.15 20 17.5 20C15.8 20 13.35 20.65 12 21.5M12 8V19.5C13.35 18.65 15.8 18 17.5 18C18.7 18 19.9 18.15 21 18.5V7C19.9 6.65 18.7 6.5 17.5 6.5C15.8 6.5 13.35 7.15 12 8M13 11.5C14.11 10.82 15.6 10.5 17.5 10.5C18.41 10.5 19.26 10.59 20 10.78V9.23C19.13 9.08 18.29 9 17.5 9C15.73 9 14.23 9.28 13 9.84V11.5M17.5 11.67C15.79 11.67 14.29 11.93 13 12.46V14.15C14.11 13.5 15.6 13.16 17.5 13.16C18.54 13.16 19.38 13.24 20 13.4V11.9C19.13 11.74 18.29 11.67 17.5 11.67M20 14.57C19.13 14.41 18.29 14.33 17.5 14.33C15.67 14.33 14.17 14.6 13 15.13V16.82C14.11 16.16 15.6 15.83 17.5 15.83C18.54 15.83 19.38 15.91 20 16.07V14.57Z"} slot="icon"></ha-svg-icon>
            All configuration options
          </ha-button>
          <span class="editor-footer__hint">
            Advanced settings only via YAML
          </span>
          <span class="editor-footer__version">v${e} · ${bt}</span>
        </div>
      </div>
    `}}i([pt()],Et.prototype,"config",void 0),i([ut({attribute:!1})],Et.prototype,"hass",void 0);const Ct=(t,e,i,n)=>{if("length"===i||"prototype"===i)return;if("arguments"===i||"caller"===i)return;const o=Object.getOwnPropertyDescriptor(t,i),s=Object.getOwnPropertyDescriptor(e,i);!Tt(o,s)&&n||Object.defineProperty(t,i,s)},Tt=function(t,e){return void 0===t||t.configurable||t.writable===e.writable&&t.enumerable===e.enumerable&&t.configurable===e.configurable&&(t.writable||t.value===e.value)},kt=(t,e)=>`/* Wrapped ${t}*/\n${e}`,zt=Object.getOwnPropertyDescriptor(Function.prototype,"toString"),Pt=Object.getOwnPropertyDescriptor(Function.prototype.toString,"name");function Ot(t,e,{ignoreNonConfigurable:i=!1}={}){const{name:n}=t;for(const n of Reflect.ownKeys(e))Ct(t,e,n,i);return((t,e)=>{const i=Object.getPrototypeOf(e);i!==Object.getPrototypeOf(t)&&Object.setPrototypeOf(t,i)})(t,e),((t,e,i)=>{const n=""===i?"":`with ${i.trim()}() `,o=kt.bind(null,n,e.toString());Object.defineProperty(o,"name",Pt);const{writable:s,enumerable:r,configurable:a}=zt;Object.defineProperty(t,"toString",{value:o,writable:s,enumerable:r,configurable:a})})(t,e,n),t}const Mt=(t,e={})=>{if("function"!=typeof t)throw new TypeError(`Expected the first argument to be a function, got \`${typeof t}\``);const{wait:i=0,maxWait:n=Number.POSITIVE_INFINITY,before:o=!1,after:s=!0}=e;if(i<0||n<0)throw new RangeError("`wait` and `maxWait` must not be negative.");if(!o&&!s)throw new Error("Both `before` and `after` are false, function wouldn't be called.");let r,a,l;const c=function(...e){const c=this,d=()=>{a=void 0,r&&(clearTimeout(r),r=void 0),s&&(l=t.apply(c,e))},h=o&&!r;return clearTimeout(r),r=setTimeout(()=>{r=void 0,a&&(clearTimeout(a),a=void 0),s&&(l=t.apply(c,e))},i),n>0&&n!==Number.POSITIVE_INFINITY&&!a&&(a=setTimeout(d,n)),h&&(l=t.apply(c,e)),l};return Ot(c,t),c.cancel=()=>{r&&(clearTimeout(r),r=void 0),a&&(clearTimeout(a),a=void 0)},c};function Nt(t,{decimals:e=1,fallback:i="N/A",locale:n}={}){if(null===t||""===t||["boolean","undefined"].includes(typeof t))return i;const o=Number(t);return Number.isNaN(o)?i:n?"decimal_comma"===n.number_format||"space_comma"===n.number_format?o.toFixed(e).replace(".",","):"comma_decimal"===n.number_format||"none"===n.number_format?o.toFixed(e):new Intl.NumberFormat("system"===n.number_format?void 0:n.language,{minimumFractionDigits:e,maximumFractionDigits:e}).format(o):o.toFixed(e)}function jt({header:t,toggleEntityChanged:e,entity:i,openEntityPopover:n}){if(!1===t)return q;const o=i.attributes.hvac_action||i.state;let s=t.icon;"object"==typeof t.icon&&(s=s?.[o]??!1);const r=t?.name??!1;return B`
    <header>
      <div
        class="clickable header__clickable"
        @click=${()=>n()}
      >
        ${function(t){return t?B` <ha-icon class="header__icon" .icon=${t}></ha-icon> `:q}(s)} ${function(t){return t?B`<h2 class="header__title">${t}</h2>`:q}(r)}
      </div>
      ${function(t,e){if(!t?.length)return q;const i=t.map(({icon:t,hide_inactive:i,state:n})=>B` <ha-icon
      class="fault-icon ${"on"===n?.state?"active":i?"hide":""}"
      .icon=${t||n?.attributes?.icon}
      @click="${()=>e(n?.entity_id)}"
    ></ha-icon>`);return B` <div class="faults">${i}</div>`}(t.faults,n)}
      ${function(t,e,i){return t?B`
    <div class="header__toggle">
      ${!1!==t.icon?B`<ha-icon class="toggle-icon" .icon=${t.icon}></ha-icon>`:q}
      <span
        class="clickable toggle-label"
        @click=${()=>e(t.entity?.entity_id)}
        >${t.label}
      </span>
      <ha-switch
        .checked=${"on"===t.entity?.state}
        @change=${i}
      ></ha-switch>
    </div>
  `:q}(t.toggle,n,e)}
    </header>
  `}var Rt,Ut={exports:{}};function Dt(){return Rt||(Rt=1,function(t){function e(t){var i,n,o=new Error(t);return i=o,n=e.prototype,Object.setPrototypeOf?Object.setPrototypeOf(i,n):i.__proto__=n,o}function i(t,i,n){var o=i.slice(0,n).split(/\n/),s=o.length,r=o[s-1].length+1;throw e(t+=" at line "+s+" col "+r+":\n\n  "+i.split(/\n/)[s-1]+"\n  "+Array(r).join(" ")+"^")}e.prototype=Object.create(Error.prototype,{name:{value:"Squirrelly Error",enumerable:!1}});var n=new Function("return this")().Promise,o=!1;try{o=new Function("return (async function(){}).constructor")()}catch(t){if(!(t instanceof SyntaxError))throw t}function s(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function r(t,e,i){for(var n in e)s(e,n)&&(null==e[n]||"object"!=typeof e[n]||"storage"!==n&&"prefixes"!==n||i?t[n]=e[n]:t[n]=r({},e[n]));return t}var a=/^async +/,l=/`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g,c=/'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g,d=/"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g,h=/[.*+\-?^${}()|[\]\\]/g;function u(t){return h.test(t)?t.replace(h,"\\$&"):t}function p(t,n){n.rmWhitespace&&(t=t.replace(/[\r\n]+/g,"\n").replace(/^\s+|\s+$/gm,"")),l.lastIndex=0,c.lastIndex=0,d.lastIndex=0;var o=n.prefixes,s=[o.h,o.b,o.i,o.r,o.c,o.e].reduce(function(t,e){return t&&e?t+"|"+u(e):e?u(e):t},""),r=new RegExp("([|()]|=>)|('|\"|`|\\/\\*)|\\s*((\\/)?(-|_)?"+u(n.tags[1])+")","g"),h=new RegExp("([^]*?)"+u(n.tags[0])+"(-|_)?\\s*("+s+")?\\s*","g"),p=0,m=!1;function f(e,o){var s,u={f:[]},f=0,g="c";function v(e){var o=t.slice(p,e),s=o.trim();if("f"===g)"safe"===s?u.raw=!0:n.async&&a.test(s)?(s=s.replace(a,""),u.f.push([s,"",!0])):u.f.push([s,""]);else if("fp"===g)u.f[u.f.length-1][1]+=s;else if("err"===g){if(s){var r=o.search(/\S/);i("invalid syntax",t,p+r)}}else u[g]=s;p=e+1}for("h"===o||"b"===o||"c"===o?g="n":"r"===o&&(u.raw=!0,o="i"),r.lastIndex=p;null!==(s=r.exec(t));){var y=s[1],_=s[2],b=s[3],$=s[4],w=s[5],x=s.index;if(y)"("===y?(0===f&&("n"===g?(v(x),g="p"):"f"===g&&(v(x),g="fp")),f++):")"===y?0===--f&&"c"!==g&&(v(x),g="err"):0===f&&"|"===y?(v(x),g="f"):"=>"===y&&(v(x),p+=1,g="res");else if(_)if("/*"===_){var A=t.indexOf("*/",r.lastIndex);-1===A&&i("unclosed comment",t,s.index),r.lastIndex=A+2}else"'"===_?(c.lastIndex=s.index,c.exec(t)?r.lastIndex=c.lastIndex:i("unclosed string",t,s.index)):'"'===_?(d.lastIndex=s.index,d.exec(t)?r.lastIndex=d.lastIndex:i("unclosed string",t,s.index)):"`"===_&&(l.lastIndex=s.index,l.exec(t)?r.lastIndex=l.lastIndex:i("unclosed string",t,s.index));else if(b)return v(x),p=x+s[0].length,h.lastIndex=p,m=w,$&&"h"===o&&(o="s"),u.t=o,u}return i("unclosed tag",t,e),u}var g=function s(r,l){r.b=[],r.d=[];var c,d=!1,u=[];function g(t,e){t&&(t=function(t,e,i,n){var o,s;return"string"==typeof e.autoTrim?o=s=e.autoTrim:Array.isArray(e.autoTrim)&&(o=e.autoTrim[1],s=e.autoTrim[0]),(i||!1===i)&&(o=i),(n||!1===n)&&(s=n),"slurp"===o&&"slurp"===s?t.trim():("_"===o||"slurp"===o?t=String.prototype.trimLeft?t.trimLeft():t.replace(/^[\s\uFEFF\xA0]+/,""):"-"!==o&&"nl"!==o||(t=t.replace(/^(?:\n|\r|\r\n)/,"")),"_"===s||"slurp"===s?t=String.prototype.trimRight?t.trimRight():t.replace(/[\s\uFEFF\xA0]+$/,""):"-"!==s&&"nl"!==s||(t=t.replace(/(?:\n|\r|\r\n)$/,"")),t)}(t,n,m,e))&&(t=t.replace(/\\|'/g,"\\$&").replace(/\r\n|\n|\r/g,"\\n"),u.push(t))}for(;null!==(c=h.exec(t));){var v,y=c[1],_=c[2],b=c[3]||"";for(var $ in o)if(o[$]===b){v=$;break}g(y,_),p=c.index+c[0].length,v||i("unrecognized tag type: "+b,t,p);var w=f(c.index,v),x=w.t;if("h"===x){var A=w.n||"";n.async&&a.test(A)&&(w.a=!0,w.n=A.replace(a,"")),w=s(w),u.push(w)}else if("c"===x){if(r.n===w.n)return d?(d.d=u,r.b.push(d)):r.d=u,r;i("Helper start and end don't match",t,c.index+c[0].length)}else if("b"===x){d?(d.d=u,r.b.push(d)):r.d=u;var S=w.n||"";n.async&&a.test(S)&&(w.a=!0,w.n=S.replace(a,"")),d=w,u=[]}else if("s"===x){var E=w.n||"";n.async&&a.test(E)&&(w.a=!0,w.n=E.replace(a,"")),u.push(w)}else u.push(w)}if(!l)throw e('unclosed helper "'+r.n+'"');return g(t.slice(p,t.length),!1),r.d=u,r}({f:[]},!0);if(n.plugins)for(var v=0;v<n.plugins.length;v++){var y=n.plugins[v];y.processAST&&(g.d=y.processAST(g.d,n))}return g.d}function m(t,e){var i=p(t,e),n="var tR='';"+(e.useWith?"with("+e.varName+"||{}){":"")+_(i,e)+"if(cb){cb(null,tR)} return tR"+(e.useWith?"}":"");if(e.plugins)for(var o=0;o<e.plugins.length;o++){var s=e.plugins[o];s.processFnString&&(n=s.processFnString(n,e))}return n}function f(t,e){for(var i=0;i<e.length;i++){var n=e[i][0],o=e[i][1];t=(e[i][2]?"await ":"")+"c.l('F','"+n+"')("+t,o&&(t+=","+o),t+=")"}return t}function g(t,e,i,n,o,s){var r="{exec:"+(o?"async ":"")+y(i,e,t)+",params:["+n+"]";return s&&(r+=",name:'"+s+"'"),o&&(r+=",async:true"),r+"}"}function v(t,e){for(var i="[",n=0;n<t.length;n++){var o=t[n];i+=g(e,o.res||"",o.d,o.p||"",o.a,o.n),n<t.length&&(i+=",")}return i+"]"}function y(t,e,i){return"function("+e+"){var tR='';"+_(t,i)+"return tR}"}function _(t,e){for(var i=0,n=t.length,o="";i<n;i++){var s=t[i];if("string"==typeof s)o+="tR+='"+s+"';";else{var r=s.t,a=s.c||"",l=s.f,c=s.n||"",d=s.p||"",h=s.res||"",u=s.b,p=!!s.a;if("i"===r){e.defaultFilter&&(a="c.l('F','"+e.defaultFilter+"')("+a+")");var m=f(a,l);!s.raw&&e.autoEscape&&(m="c.l('F','e')("+m+")"),o+="tR+="+m+";"}else if("h"===r)if(e.storage.nativeHelpers.get(c))o+=e.storage.nativeHelpers.get(c)(s,e);else{var y=(p?"await ":"")+"c.l('H','"+c+"')("+g(e,h,s.d,d,p);y+=u?","+v(u,e):",[]",o+="tR+="+f(y+=",c)",l)+";"}else"s"===r?o+="tR+="+f((p?"await ":"")+"c.l('H','"+c+"')({params:["+d+"]},[],c)",l)+";":"e"===r&&(o+=a+"\n")}}return o}var b=function(){function t(t){this.cache=t}return t.prototype.define=function(t,e){this.cache[t]=e},t.prototype.get=function(t){return this.cache[t]},t.prototype.remove=function(t){delete this.cache[t]},t.prototype.reset=function(){this.cache={}},t.prototype.load=function(t){r(this.cache,t,!0)},t}();function $(t,i,n,o){if(i&&i.length>0)throw e((o?"Native":"")+"Helper '"+t+"' doesn't accept blocks");if(n&&n.length>0)throw e((o?"Native":"")+"Helper '"+t+"' doesn't accept filters")}var w={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function x(t){return w[t]}var A=new b({}),S=new b({each:function(t,e){var i="",n=t.params[0];if($("each",e,!1),t.async)return new Promise(function(e){!function t(e,i,n,o,s){n(e[i],i).then(function(r){o+=r,i===e.length-1?s(o):t(e,i+1,n,o,s)})}(n,0,t.exec,i,e)});for(var o=0;o<n.length;o++)i+=t.exec(n[o],o);return i},foreach:function(t,e){var i=t.params[0];if($("foreach",e,!1),t.async)return new Promise(function(e){!function t(e,i,n,o,s,r){o(i[n],e[i[n]]).then(function(a){s+=a,n===i.length-1?r(s):t(e,i,n+1,o,s,r)})}(i,Object.keys(i),0,t.exec,"",e)});var n="";for(var o in i)s(i,o)&&(n+=t.exec(o,i[o]));return n},include:function(t,i,n){$("include",i,!1);var o=n.storage.templates.get(t.params[0]);if(!o)throw e('Could not fetch template "'+t.params[0]+'"');return o(t.params[1],n)},extends:function(t,i,n){var o=t.params[1]||{};o.content=t.exec();for(var s=0;s<i.length;s++){var r=i[s];o[r.name]=r.exec()}var a=n.storage.templates.get(t.params[0]);if(!a)throw e('Could not fetch template "'+t.params[0]+'"');return a(o,n)},useScope:function(t,e){return $("useScope",e,!1),t.exec(t.params[0])}}),E=new b({if:function(t,e){$("if",!1,t.f,!0);var i="if("+t.p+"){"+_(t.d,e)+"}";if(t.b)for(var n=0;n<t.b.length;n++){var o=t.b[n];"else"===o.n?i+="else{"+_(o.d,e)+"}":"elif"===o.n&&(i+="else if("+o.p+"){"+_(o.d,e)+"}")}return i},try:function(t,i){if($("try",!1,t.f,!0),!t.b||1!==t.b.length||"catch"!==t.b[0].n)throw e("native helper 'try' only accepts 1 block, 'catch'");var n="try{"+_(t.d,i)+"}",o=t.b[0];return n+"catch"+(o.res?"("+o.res+")":"")+"{"+_(o.d,i)+"}"},block:function(t,e){return $("block",t.b,t.f,!0),"if(!"+e.varName+"["+t.p+"]){tR+=("+y(t.d,"",e)+")()}else{tR+="+e.varName+"["+t.p+"]}"}}),C=new b({e:function(t){var e=String(t);return/[&<>"']/.test(e)?e.replace(/[&<>"']/g,x):e}}),T={varName:"it",autoTrim:[!1,"nl"],autoEscape:!0,defaultFilter:!1,tags:["{{","}}"],l:function(t,i){if("H"===t){var n=this.storage.helpers.get(i);if(n)return n;throw e("Can't find helper '"+i+"'")}if("F"===t){var o=this.storage.filters.get(i);if(o)return o;throw e("Can't find filter '"+i+"'")}},async:!1,storage:{helpers:S,nativeHelpers:E,filters:C,templates:A},prefixes:{h:"@",b:"#",i:"",r:"*",c:"/",e:"!"},cache:!1,plugins:[],useWith:!1};function k(t,e){var i={};return r(i,T),e&&r(i,e),t&&r(i,t),i.l.bind(i),i}function z(t,i){var n=k(i||{}),s=Function;if(n.async){if(!o)throw e("This environment doesn't support async/await");s=o}try{return new s(n.varName,"c","cb",m(t,n))}catch(i){throw i instanceof SyntaxError?e("Bad template syntax\n\n"+i.message+"\n"+Array(i.message.length+1).join("=")+"\n"+m(t,n)):i}}function P(t,e){var i;return e.cache&&e.name&&e.storage.templates.get(e.name)?e.storage.templates.get(e.name):(i="function"==typeof t?t:z(t,e),e.cache&&e.name&&e.storage.templates.define(e.name,i),i)}T.l.bind(T),t.compile=z,t.compileScope=_,t.compileScopeIntoFunction=y,t.compileToString=m,t.defaultConfig=T,t.filters=C,t.getConfig=k,t.helpers=S,t.nativeHelpers=E,t.parse=p,t.render=function(t,i,o,s){var r=k(o||{});if(!r.async)return P(t,r)(i,r);if(!s){if("function"==typeof n)return new n(function(e,n){try{e(P(t,r)(i,r))}catch(t){n(t)}});throw e("Please provide a callback function, this env doesn't support Promises")}try{P(t,r)(i,r,s)}catch(t){return s(t)}},t.templates=A,Object.defineProperty(t,"__esModule",{value:!0})}(Ut.exports)),Ut.exports}var Ht=Dt();const It=2;class Vt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}class Ft extends Vt{constructor(t){if(super(t),this.it=q,t.type!==It)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===q||null==t)return this._t=void 0,this.it=t;if(t===W)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}Ft.directiveName="unsafeHTML",Ft.resultType=1;const Lt=(t=>(...e)=>({_$litDirective$:t,values:e}))(Ft),Bt=t=>`<ha-icon icon="${t}"></ha-icon>`;function Wt(t,e){const i=t?.layout?.sensors?.type??"table";return B` <div class="sensors ${[t?.layout?.sensors?.labels??!0?"with-labels":"without-labels","list"===i?"as-list":"as-table"].join(" ")}">${e}</div> `}function qt({hide:t=!1,hass:e,state:i,details:n,localize:o,openEntityPopover:s}){if(t||void 0===i)return;const{type:r,heading:a,icon:l,unit:c,decimals:d}=n;let h;if(process.env.DEBUG&&console.log("ST: infoItem",{state:i,details:n}),"relativetime"===r)h=B`
      <div class="sensor-value">
        <ha-relative-time .datetime=${i} .hass=${e}></ha-relative-time>
      </div>
    `;else if("object"==typeof i){const[t]=i.entity_id.split("."),n=["component",t,"state",i.attributes?.device_class??"_",""].join(".");let r,a="";if(void 0!==c){let t=i.state;"number"==typeof d&&(t=Nt(t,{decimals:d})),r=t,a=c?` ${c}`:""}else{const t=e.formatEntityState?.(i);r=t??o?.(i.state,n)??i.state,t||("number"==typeof d&&(r=Nt(r,{decimals:d})),a=i.attributes?.unit_of_measurement?` ${i.attributes.unit_of_measurement}`:"")}h=B`
      <div
        class="sensor-value clickable"
        @click="${()=>s?.(i.entity_id)}"
      >
        ${r}${a}
      </div>
    `}else{let t="number"==typeof d?Nt(i,{decimals:d}):i;h=B` <div class="sensor-value">${t}${c?` ${c}`:""}</div> `}if(!1===a)return h;const u=l?B` <ha-icon .icon=${l}></ha-icon> `:B` ${a}: `;return B`
    <div class="sensor-heading">${u}</div>
    ${h}
  `}var Kt;function Yt({state:t,mode:e,modeOptions:i,localize:n,setMode:o}){const{type:s,hide_when_off:r,mode:a="none",list:l,name:c}=e;if(0===l.length||r&&t===Kt.OFF)return null;const d="hvac"===s?"operation":`${s}_mode`;let h=c||n(`ui.card.climate.${d}`);if(h===`ui.card.climate.${d}`){const t=`state_attributes.climate.${"hvac"===s?"hvac":s}_mode`;h=n(t),h===t&&(h="operation"===d?"Operation":"Mode")}const u=i?.headings??!1;return B`
    <div class="modes ${u?"heading":""}" role="group" aria-label=${h}>
      ${u?B` <div class="mode-title">${h}</div> `:""}
      ${l.map(({value:t,icon:e,name:r})=>B`
          <div
            class="mode-item ${t===a?"active "+a:""}"
            role="button"
            tabindex="0"
            aria-pressed=${t===a?"true":"false"}
            aria-label=${r||t}
            @click=${()=>o(s,t)}
            @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),o(s,t))}}
          >
            ${(t=>t?!1===i?.icons?null:B` <ha-icon class="mode-icon" .icon=${t}></ha-icon> `:null)(e)} ${(t=>!1===t||!1===i?.names?null:"hvac"===s?n(t,"component.climate.state._."):n(t,`component.climate.entity_component._.state_attributes.${s}_mode.state.`)||n(t,`state_attributes.climate.${s}_mode.`))(r)}
          </div>
        `)}
    </div>
  `}Ht.defaultConfig.autoEscape=!1,Ht.filters.define("icon",Bt),Ht.filters.define("join",(t,e=", ")=>t.join(e)),Ht.filters.define("css",(t,e)=>`<span style="${Object.entries(e).reduce((t,[e,i])=>`${t}${e}:${i};`,"")}">${t}</span>`),Ht.filters.define("debug",t=>{try{return JSON.stringify(t)}catch{return`Not able to read valid JSON object from: ${t}`}}),function(t){t.OFF="off",t.HEAT="heat",t.COOL="cool",t.HEAT_COOL="heat_cool",t.AUTO="auto",t.DRY="dry",t.FAN_ONLY="fan_only"}(Kt||(Kt={}));const Jt={auto:"mdi:radiator",cooling:"mdi:snowflake",fan:"mdi:fan",heating:"mdi:radiator",idle:"mdi:radiator-disabled",off:"mdi:radiator-off"},Gt={auto:"mdi:fan-auto",cool:"hass:snowflake",dry:"hass:water-percent",fan_only:"hass:fan",heat_cool:"hass:autorenew",heat:"hass:fire",off:"mdi:power",none:"mdi:minus-circle-outline",eco:"mdi:leaf",away:"mdi:home-export-outline",boost:"mdi:rocket-launch",comfort:"mdi:sofa",home:"mdi:home",sleep:"mdi:sleep",activity:"mdi:run",on:"mdi:fan",automatic:"mdi:fan-auto",normal:"mdi:fan",low:"mdi:fan-speed-1",medium:"mdi:fan-speed-2",high:"mdi:fan-speed-3",turbo:"mdi:fan-alert",powerful:"mdi:fan-plus",quiet:"mdi:fan-minus",silent:"mdi:fan-minus",1:"mdi:fan-speed-1",2:"mdi:fan-speed-2",3:"mdi:fan-speed-3",4:"mdi:fan-plus",5:"mdi:fan-alert",vertical:"mdi:arrow-up-down",top:"mdi:arrow-up","top-middle":"mdi:arrow-top-right",middle:"mdi:arrow-collapse-vertical","middle-bottom":"mdi:arrow-bottom-right",bottom:"mdi:arrow-down",upper:"mdi:arrow-up",lower:"mdi:arrow-down",horizontal:"mdi:arrow-left-right",left:"mdi:arrow-left","center-left":"mdi:arrow-top-left",center:"mdi:arrow-collapse-horizontal","center-right":"mdi:arrow-top-right",right:"mdi:arrow-right",both:"mdi:arrow-all"};function Zt(t,e){const i=e.states[t.entity];if(!i)return null;let n="";return n=!0===t?.name?i.attributes.friendly_name:t?.name??"",{entity:i,label:n,icon:t?.icon??!1}}function Qt(t,e){return Array.isArray(t)?t.filter(({entity:t})=>Boolean(e.states?.[t])).map(({entity:t,...i})=>({...i,state:e.states[t],entity:t})):[]}var Xt;!function(t){t.HVAC="hvac",t.FAN="fan",t.PRESET="preset",t.SWING="swing"}(Xt||(Xt={}));const te="hass:chevron-up",ee="hass:chevron-down",ie="mdi:plus",ne="mdi:minus",oe={temperature:!1,state:!1};function se(t,e,i={},n=`${t}_modes`){let o=e[n];return"boolean"==typeof o&&(o=["false","true"]),Array.isArray(o)?o.filter(t=>function(t,e){if("object"==typeof e[t])return!1!==e[t].include;return e?.[t]??!0}(t,i)).map(t=>{const e=String(t),n="object"==typeof i[e]?i[e]:{};return{icon:Gt[e]??Gt[e.toLowerCase()],value:e,name:e,...n}}):[]}class re extends lt{constructor(){super(...arguments),this.modes=[],this._hass={},this.sensors=[],this.showSensors=!0,this.stepSize=.5,this._values={},this._updatingValues=!1,this._hide=oe,this._updatingValuesTimeout=null,this._needsRecompute=!0,this._extTempEntity=null,this._holdTimer=null,this._holdFired=!1,this._clickCount=0,this._clickTimer=null,this._debouncedSetTemperature=Mt(t=>{const{domain:e,service:i,data:n={}}=this.service;this._callAction(`${e}.${i}`,{entity_id:this.config.entity,...n,...t})},{wait:500}),this.localize=(t,e="")=>{const i=`${e}${t}`;return this._hass.localize(i)||t},this.toggleEntityChanged=t=>{if(!this.header||!this.header.toggle)return;const e=t.target;this._callAction(e.checked?"homeassistant.turn_on":"homeassistant.turn_off",{entity_id:this.header.toggle.entity?.entity_id})},this.setMode=(t,e)=>{if(t&&e){const i=_t(this.config.entity),n=i.transformModePayloadValue?i.transformModePayloadValue(t,e):e;this._callAction(i.getModeService(t),{entity_id:this.config.entity,[i.getModePayloadKey(t)]:n}),ft(this,"haptic","light")}else ft(this,"haptic","failure")},this.openEntityPopover=(t=null)=>{ft(this,"hass-more-info",{entityId:t||this.config.entity})},this._onActionPointerDown=t=>{0!==t.button&&"mouse"===t.pointerType||(this._holdFired=!1,this._holdTimer&&clearTimeout(this._holdTimer),this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._dispatchAction("hold")},re.HOLD_MS))},this._onActionPointerUp=()=>{this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onActionClick=t=>{t.preventDefault(),this._holdFired?this._holdFired=!1:(this._clickCount+=1,1===this._clickCount?(this._clickTimer&&clearTimeout(this._clickTimer),this._clickTimer=setTimeout(()=>{this._clickCount=0,this._clickTimer=null,this._dispatchAction("tap")},re.DOUBLE_TAP_MS)):(this._clickTimer&&clearTimeout(this._clickTimer),this._clickTimer=null,this._clickCount=0,this._dispatchAction("double_tap")))}}static get styles(){return mt}_callAction(t,e){this._hass.performAction({action:t,data:e})}static getConfigElement(){return window.document.createElement(`${t}-editor`)}static getStubConfig(t){return{entity:Object.keys(t.states).find(t=>t.startsWith("climate.")||t.startsWith("fan.")||t.startsWith("humidifier."))??""}}setConfig(t){if(!t?.entity)throw new Error("simple-thermostat: entity is required");this.config={decimals:1,...t},this.service=function(t,e=vt){return t||e.getSetpointService()}(this.config.service??!1,_t(this.config.entity)),this._needsRecompute=!0}disconnectedCallback(){super.disconnectedCallback(),this._updatingValuesTimeout&&(clearTimeout(this._updatingValuesTimeout),this._updatingValuesTimeout=null),this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null),this._clickTimer&&(clearTimeout(this._clickTimer),this._clickTimer=null),this._debouncedSetTemperature?.cancel?.()}updated(t){super.updated(t);const e=Array.from(this.renderRoot.querySelectorAll("[with-hass]"));for(const t of Array.from(e))Array.from(t.attributes).forEach(e=>{e.name.startsWith("fwd-")&&(t[e.name.replace("fwd-","")]=e.value)}),t.hass=this._hass}set hass(t){if(!this.config?.entity||!t?.states)return;this._hass=t;const e=t.states[this.config.entity];if(!e)return void(void 0!==this.entity&&(this.entity=void 0));const i=this.config.current_value_entity??this.config.current_temperature_entity,n=i?t.states[i]:null;if(this.entity===e&&this._extTempEntity===n&&!this._needsRecompute)return;this._extTempEntity=n,this._needsRecompute=!1,this.entity=e,this.header=function(t,e,i){if(!1===t)return!1;let n;n="string"==typeof t?.name?t.name:!1!==t?.name&&e.attributes.friendly_name;let o=e.attributes.hvac_action?Jt:Gt;return void 0!==t?.icon&&(o=t.icon),{name:n,icon:o,toggle:t?.toggle?Zt(t.toggle,i):null,faults:Qt(t?.faults,i)}}(!1!==this.config.header&&(this.config.header??{}),e,t);const o=e.attributes,s=_t(this.config.entity);let r=function(t,e,i=vt){return!1===t?{}:t?Object.entries(t).reduce((t,[i,n])=>(n?.hide||(t[i]=e?.[i]),t),{}):i.getSetpoints(e)}(this.config.setpoints,o,s);this._updatingValues&&function(t,e){const i=Object.keys(t);return i.length===Object.keys(e).length&&!i.some(i=>t?.[i]!==e?.[i])}(r,this._values)?(this._updatingValues=!1,this._updatingValuesTimeout&&(clearTimeout(this._updatingValuesTimeout),this._updatingValuesTimeout=null)):this._updatingValues||(this._values=r);const a=s.getDefaultControl(),l=t=>void 0!==o[s.getModeAttribute(t)],c=t=>t.filter(l).map(t=>({type:t,hide_when_off:!1,list:se(t,o,{},s.getModeAttribute(t))}));let d=[];if(!1===this.config.control)d=[];else if(Array.isArray(this.config.control))d=c(this.config.control);else if("object"==typeof this.config.control){const t=Object.entries(this.config.control);d=t.length>0?t.filter(([t])=>l(t)).map(([t,e])=>{const{_name:i,_hide_when_off:n,...r}=e;return{type:t,hide_when_off:n,name:i,list:se(t,o,r,s.getModeAttribute(t))}}):c(a)}else d=c(a);if(this.modes=d.map(t=>{const i=t.list??[];if(t.type===Xt.HVAC){const n=Object.values(Kt),o=[],s=[];return i.forEach(t=>{const e=n.indexOf(t.value);e>=0?o[e]=t:s.push(t)}),{...t,list:[...o.filter(Boolean),...s],mode:e.state}}const n=o[s.getModePayloadKey(t.type)];return{...t,mode:String(n)}}),this.config.step_size)this.stepSize=+this.config.step_size;else{const t=s.getRange(o).step;null!=t&&(this.stepSize=+t)}if(this._hide={...oe,...this.config.hide},!1===this.config.sensors)this.showSensors=!1;else if(3===this.config.version){this.sensors=[];const i=this.config.sensors??[],n=this.config.entity,o=i.map((t,i)=>{const o=t?.entity??n;let s=e;return t?.entity&&(s=this._hass.states?.[t.entity]),{id:t?.id??String(i),label:t?.label,template:t?.template??"",show:!1!==t?.show,entityId:o,context:s}}),r=o.map(t=>t.id),a=[];if(r.includes("state")||a.push({id:"state",label:"{{ui.operation}}",template:"{{state.text}}",entityId:n,context:e,show:!0}),!r.includes("temperature")){const i=this.config.current_value_entity??this.config.current_temperature_entity??n,o=i!==n&&t.states[i];a.push({id:"temperature",label:"{{ui.currently}}",template:o?"{{state.raw|formatNumber}}":s.getCurrentValueTemplate(),entityId:i,context:o?t.states[i]:e,show:!0})}this.sensors=[...a,...o]}else this.config.sensors&&(this.sensors=this.config.sensors.map(({name:e,entity:i,attribute:n,unit:s,...r})=>{let a;const l=[e];return i?(a=t.states[i],l.push(a?.attributes?.friendly_name),n&&(a=a?.attributes?.[n])):n&&n in o&&(a=o[n],l.push(n)),l.push(i),{...r,name:l.find(t=>!!t),state:a,entity:i,unit:s}}))}render(){const{_hide:t,_values:e,_updatingValues:i,config:n,entity:o}=this,s=[];if(this.stepSize<1&&0===this.config.decimals&&s.push(B`
        <ha-alert alert-type="warning">
          Decimals is set to 0 and step_size is lower than 1. Decrementing a
          setpoint will likely not work. Change one of the settings to clear
          this warning.
        </ha-alert>
      `),!o)return this._hass?.states?B`
        <ha-alert alert-type="error">
          Entity not available: ${n.entity}
        </ha-alert>
      `:B`<ha-card class="loading"></ha-card>`;const{attributes:{hvac_action:r}}=o,a=_t(this.config.entity),{min:l,max:c}=a.getRange(o.attributes),d=this.getUnit(),h=this.config?.layout?.step??"row",u="row"===h,p=["unavailable","unknown"].includes(o.state),m=t=>"string"==typeof t?t.replace(/[^a-z0-9_-]/gi,""):"",f=[!this.header&&"no-header",m(r),p&&m(o.state)].filter(t=>!!t);let g;return 3===this.config.version?(g=this.sensors.filter(t=>!1!==t.show).map(t=>function({context:t,entityId:e,template:i="{{state.text}}",label:n,hass:o,variables:s={},config:r,localize:a,openEntityPopover:l}){if(!t)return null;const{state:c,attributes:d}=t,[h]=e.split("."),u=["climate","fan","humidifier"].includes(h)?`ui.card.${h}.`:"ui.card.climate.",p=Object.fromEntries(["currently","operation","fan_mode","swing_mode","preset_mode","humidity"].map(t=>[t,o.localize?.(`${u}${t}`)??t])),m={...d,state:{raw:c,text:a(c,`component.${h}.state._.`)},ui:p,v:s};Ht.filters.define("formatNumber",(t,e={decimals:r.decimals})=>String(Nt(t,e))),Ht.filters.define("relativetime",t=>`<ha-relative-time fwd-datetime=${t} with-hass></ha-relative-time>`),Ht.filters.define("translate",(t,e="")=>a(t,e||"climate"!==h&&"humidifier"!==h?e:`state_attributes.${h}.${t}`));const f=t=>{try{return Ht.render(t,m,{useWith:!0})}catch{return`[template error: ${t}]`}},g=f(i);if(!1===n||!1===r?.layout?.sensors?.labels)return B`<div class="sensor-value">${Lt(g)}</div>`;const v=n||"{{friendly_name}}",y=v.match(/^(mdi|hass):.*/)?Bt(v):f(v);return B`
    <div class="sensor-heading">${Lt(y)}</div>
    <div class="sensor-value">${Lt(g)}</div>
  `}({...t,variables:this.config.variables,hass:this._hass,config:this.config,localize:this.localize,openEntityPopover:this.openEntityPopover})),g=Wt(this.config,g)):g=this.showSensors?function({_hide:t,entity:e,unit:i,hass:n,sensors:o,config:s,localize:r,openEntityPopover:a}){const{state:l,attributes:{hvac_action:c}}=e,d=_t(s?.entity),h=d.getCurrentValue(e.attributes),u=s?.current_value_entity??s?.current_temperature_entity,p=u?n.states?.[u]?.state:void 0,m=void 0!==p?p:h,f=s?.layout?.sensors?.labels??!0,g=d.getLocalizationDomain();let v=n.formatEntityState?.(e)??r(l,`component.${g}.state._.`);c&&(v=[r(c,`component.${g}.entity_component._.state_attributes.hvac_action.state.`)||r(c,`state_attributes.${g}.hvac_action.`),` (${v})`].join(""));const y=[qt({hide:t.temperature,state:`${Nt(m,s)}${i||""}`,hass:n,details:{heading:!!f&&(s?.label?.temperature??r(`ui.card.${g}.currently`))}}),qt({hide:t.state,state:v,hass:n,details:{heading:!!f&&(s?.label?.state??r("ui.panel.lovelace.editor.card.generic.state"))}}),...o.map(({name:t,state:e,...i})=>qt({state:e,hass:n,localize:r,openEntityPopover:a,details:{...i,heading:f&&t}}))].filter(Boolean);return Wt(s,y)}({_hide:t,unit:d,hass:this._hass,entity:o,sensors:this.sensors,config:this.config,localize:this.localize,openEntityPopover:this.openEntityPopover}):"",B`
      <ha-card class="${f.join(" ")}">
        ${this.config.styles?B`<style>
              ${this.config.styles}
            </style>`:q}
        ${s}
        ${jt({header:this.header,toggleEntityChanged:this.toggleEntityChanged,entity:o,openEntityPopover:this.openEntityPopover})}
        <section class="body">
          ${g}
          ${Object.entries(e).map(([t,e])=>{const o=["string","number"].includes(typeof e),s="number"==typeof e?e:Number(e),r=!1!==d&&o;return B`
              <div class="current-wrapper ${h}">
                <ha-icon-button
                  ?disabled=${null!==c&&s>=c}
                  class="thermostat-trigger"
                  aria-label="Increase ${t}"
                  .label=${`Increase ${t}`}
                  @click="${()=>this.setTemperature(this.stepSize,t)}"
                >
                  <ha-icon .icon=${u?ie:te}></ha-icon>
                </ha-icon-button>

                <h3
                  @pointerdown=${this._onActionPointerDown}
                  @pointerup=${this._onActionPointerUp}
                  @pointercancel=${this._onActionPointerUp}
                  @click=${this._onActionClick}
                  @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._dispatchAction("tap"))}}
                  role="button"
                  tabindex="0"
                  aria-label=${`${t}: ${Nt(e,{...n,locale:this._hass?.locale})}${r?` ${d}`:""}`}
                  class=${i?"current--value updating":"current--value"}
                >
                  ${Nt(e,{...n,locale:this._hass?.locale})}
                  ${r?B`<span class="current--unit">${d}</span>`:q}
                </h3>
                <ha-icon-button
                  ?disabled=${null!==l&&s<=l}
                  class="thermostat-trigger"
                  aria-label="Decrease ${t}"
                  .label=${`Decrease ${t}`}
                  @click="${()=>this.setTemperature(-this.stepSize,t)}"
                >
                  <ha-icon .icon=${u?ne:ee}></ha-icon>
                </ha-icon-button>
              </div>
            `})}
        </section>

        ${this.modes.map(t=>Yt({state:o.state,mode:t,localize:this.localize,modeOptions:this.config?.layout?.mode??{},setMode:this.setMode}))}
      </ha-card>
    `}setTemperature(t,e){this._updatingValues=!0,this._updatingValuesTimeout&&clearTimeout(this._updatingValuesTimeout),this._updatingValuesTimeout=setTimeout(()=>{this._updatingValues=!1,this._updatingValuesTimeout=null},1e4);const i=this._values[e],n=Number(i)+t,{decimals:o}=this.config;this._values={...this._values,[e]:+Nt(n,{decimals:o})},this._debouncedSetTemperature(this._values)}_dispatchAction(t){const e="tap"===t?"tap_action":"hold"===t?"hold_action":"double_tap_action",i=this.config?.[e]??("tap"===t?{action:"more-info"}:{action:"none"});this._runAction(i)}_runAction(t){switch(t.action){case"none":return;case"more-info":return void ft(this,"hass-more-info",{entityId:this.config.entity});case"navigate":return history.pushState(null,"",t.navigation_path),void ft(window,"location-changed",{replace:!1});case"url":return void window.open(t.url_path);case"toggle":return void this._callAction("homeassistant.toggle",{entity_id:this.config.entity});case"call-service":return void this._callAction(t.service,t.service_data??{})}}getCardSize(){let t=2;return!1!==this.config?.header&&(t+=1),!1!==this.config?.control&&(t+=1),t}getUnit(){return void 0!==this.config.unit?this.config.unit:this._hass.config?.unit_system?.temperature??!1}}re.HOLD_MS=500,re.DOUBLE_TAP_MS=250,i([pt()],re.prototype,"config",void 0),i([pt()],re.prototype,"header",void 0),i([pt()],re.prototype,"service",void 0),i([pt()],re.prototype,"modes",void 0),i([pt()],re.prototype,"entity",void 0),i([pt()],re.prototype,"sensors",void 0),i([pt()],re.prototype,"showSensors",void 0),i([pt()],re.prototype,"_values",void 0),i([pt()],re.prototype,"_updatingValues",void 0),i([pt()],re.prototype,"_hide",void 0),customElements.get(t)||customElements.define(t,re),customElements.get(`${t}-editor`)||customElements.define(`${t}-editor`,Et),console.info(`%c SIMPLE-THERMOSTAT %c v${e} `,"color: white; background: #6f4cff; font-weight: 700; padding: 2px 6px; border-radius: 3px 0 0 3px;","color: #6f4cff; background: #1f1f1f; font-weight: 700; padding: 2px 6px; border-radius: 0 3px 3px 0;");const ae=window;ae.customCards=ae.customCards||[],ae.customCards.find(e=>e.type===t)||ae.customCards.push({type:t,name:"Simple Thermostat",preview:!1,description:"A different take on the thermostat card",documentationURL:"https://github.com/duczz/ha-simple-thermostat"});
