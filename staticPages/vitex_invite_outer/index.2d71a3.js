!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s="cR5N")}({"644g":function(e,t,n){"use strict";n.d(t,"a",(function(){return a})),n.d(t,"c",(function(){return u})),n.d(t,"b",(function(){return c})),n.d(t,"d",(function(){return l}));var r=navigator.userAgent,i=!!(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers&&window.webkit.messageHandlers.iOS_Native_InjectJavascript),o=!(!window._dsbridge&&!window._dsf&&-1==navigator.userAgent.indexOf("_dsbridge")),a=null!=r.match(/vite/i)||i||o,u=null!=r.match(/iPhone|iP(o|a)d/i),c=null!=r.match(/android/i),l=null!=r.match(/micromessage/i)},K6kY:function(e,t,n){},VpmR:function(e,t,n){"use strict";function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n.d(t,"a",(function(){return o})),n.d(t,"b",(function(){return a}));var o=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),i(this,"_lang","zh"),i(this,"map",null),i(this,"bindMap",{}),i(this,"changeLangHandlers",[]),this.map=t,this._lang=n||a}var t,n,o;return t=e,(n=[{key:"bind",value:function(e,t){this.bindMap[t]=document.querySelector(e),this.bindMap[t].innerHTML=this.text(t)}},{key:"onLangChanged",value:function(e){this.changeLangHandlers.push(e)}},{key:"changeLang",value:function(){for(var e in this.bindMap)this.bindMap[e].innerHTML=this.text(e);this.changeLangHandlers.forEach((function(e){return e()}))}},{key:"text",value:function(e){return this.map[this.lang].message[e]}},{key:"lang",get:function(){return this._lang},set:function(e){this._lang!=e&&(this._lang=e,this.changeLang())}}])&&r(t.prototype,n),o&&r(t,o),e}(),a=navigator.language.toLowerCase().indexOf("zh")>-1?"zh":"en"},cR5N:function(e,t,n){"use strict";n.r(t);n("K6kY");var r=n("m8P/"),i=n("644g"),o=n("ppkF"),a=n("m3rI"),u=n("VpmR"),c=n("pW8Q"),l=n.n(c),f=n("yJ+k"),s=n.n(f);r.a.vitex_invite_code=r.a.vitex_invite_code||"";var g="".concat(a.e,"?vitex_invite_code=").concat(r.a.vitex_invite_code),d="".concat(a.d,"?vitex_invite_code=").concat(r.a.vitex_invite_code),I=new u.a({en:{message:{title:"Vitex Mining Invitation",invite_to_join:"Join Me to Mine at Vitex",join_benefit:"Join a Mining Team",fee9:"Get 10% off Trading Fees<br>",rewards102:"102.5% Mining Rewards<br>",feeback:"Trading Fees Dividends",more:"More Benefits Coming Soon",code:"Invitation Code: ",scan:"Scan with Vite App to Join or Scan to Download Vite App",join:"Join the Mining Team",copy_success:"Copy success",copy_failed:"Copy failed"}},zh:{message:{title:"Vitex 挖矿邀请",invite_to_join:"邀请您加入我的Vitex挖矿战队",join_benefit:"加入矿队即可享受",fee9:"交易费9折",rewards102:"挖矿收益 102.5%",feeback:"分红手续费",more:"后续有更多惊喜福利",code:"邀请码：",scan:"Vite App扫码加入矿队或扫码下载Vite App",join:"加入矿队",copy_success:"复制成功",copy_failed:"复制失败"}}});document.title=I.text("title"),I.onLangChanged((function(){document.title=I.text("title")})),I.bind("#i18_invite_to_join","invite_to_join"),I.bind("#i18_join_benefit","join_benefit"),I.bind("#i18_fee9","fee9"),I.bind("#i18_rewards102","rewards102"),I.bind("#i18_feeback","feeback"),I.bind("#i18_more","more"),I.bind("#i18_code","code"),I.bind("#i18_scan","scan"),I.bind("#link_join","join");var h=document.getElementById("phone");h.src="zh"===I.lang?l.a:s.a;var v=document.getElementById("lang_selct"),m=document.getElementById("lang_list"),b=document.getElementById("mask");v.addEventListener("click",(function(){m.style.display="block",b.style.display="block"}),!1);var w,p,y=function(){m.style.display="none",b.style.display="none"};if(b.addEventListener("click",y,!1),m.addEventListener("click",(function(e){if(e.stopPropagation(),e.target instanceof HTMLElement){var t=e.target.dataset.lang;t&&(I.lang=t,y(),h.src="zh"===I.lang?l.a:s.a)}}),!1),i.a)location.href=d;else{var M=function(){r.a.vitex_invite_code&&(S.value=r.a.vitex_invite_code,S.select(),function(e){Z.innerHTML=e,Z.style.display="block",setTimeout((function(){Z.style.display="none"}),500)}(document.execCommand("copy")?I.text("copy_success"):I.text("copy_failed")))};w=document.getElementById("qr_code"),p={size:280,ecLevel:o.ecLevel.QUARTILE,minVersion:8,background:"#fff",mode:o.modes.DRAW_WITH_IMAGE_BOX,radius:.5,image:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTIiIGhlaWdodD0iNTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxmaWx0ZXIgeD0iLTIuMyUiIHk9Ii0zLjYlIiB3aWR0aD0iMTA0LjYlIiBoZWlnaHQ9IjEwNy4yJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iaCI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iLjI1IiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93Qmx1cklubmVyMSIvPjxmZU9mZnNldCBkeT0iLjUiIGluPSJzaGFkb3dCbHVySW5uZXIxIiByZXN1bHQ9InNoYWRvd09mZnNldElubmVyMSIvPjxmZUNvbXBvc2l0ZSBpbj0ic2hhZG93T2Zmc2V0SW5uZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0iYXJpdGhtZXRpYyIgazI9Ii0xIiBrMz0iMSIgcmVzdWx0PSJzaGFkb3dJbm5lcklubmVyMSIvPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAxIDAgMCAwIDAgMSAwIDAgMCAwIDEgMCAwIDAgMC4yNjA4Njk1NjUgMCIgaW49InNoYWRvd0lubmVySW5uZXIxIi8+PC9maWx0ZXI+PGZpbHRlciB4PSItMS42JSIgeT0iLTIuMiUiIHdpZHRoPSIxMDMuMyUiIGhlaWdodD0iMTA0LjQlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJrIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIuMjUiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dCbHVySW5uZXIxIi8+PGZlT2Zmc2V0IGR5PSIuNSIgaW49InNoYWRvd0JsdXJJbm5lcjEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0SW5uZXIxIi8+PGZlQ29tcG9zaXRlIGluPSJzaGFkb3dPZmZzZXRJbm5lcjEiIGluMj0iU291cmNlQWxwaGEiIG9wZXJhdG9yPSJhcml0aG1ldGljIiBrMj0iLTEiIGszPSIxIiByZXN1bHQ9InNoYWRvd0lubmVySW5uZXIxIi8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDEgMCAwIDAgMCAxIDAgMCAwIDAgMSAwIDAgMCAwLjI2MDg2OTU2NSAwIiBpbj0ic2hhZG93SW5uZXJJbm5lcjEiLz48L2ZpbHRlcj48ZmlsdGVyIHg9Ii0yNSUiIHk9Ii0xLjglIiB3aWR0aD0iMTUwJSIgaGVpZ2h0PSIxMDQuMSUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImEiPjxmZU1vcnBob2xvZ3kgcmFkaXVzPSIuNSIgb3BlcmF0b3I9ImRpbGF0ZSIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd1NwcmVhZE91dGVyMSIvPjxmZU9mZnNldCBkeT0iMiIgaW49InNoYWRvd1NwcmVhZE91dGVyMSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiLz48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI1IiBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMC42OTAxOTYwNzggMCAwIDAgMCAwLjc1Mjk0MTE3NiAwIDAgMCAwIDAuOTI5NDExNzY1IDAgMCAwIDAuNDIyMTg2MzY4IDAiIGluPSJzaGFkb3dCbHVyT3V0ZXIxIi8+PC9maWx0ZXI+PGZpbHRlciB4PSItNC4xJSIgeT0iLTIuNCUiIHdpZHRoPSIxMDguMyUiIGhlaWdodD0iMTA0LjclIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJlIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIuMjUiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dCbHVySW5uZXIxIi8+PGZlT2Zmc2V0IGR5PSIuNSIgaW49InNoYWRvd0JsdXJJbm5lcjEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0SW5uZXIxIi8+PGZlQ29tcG9zaXRlIGluPSJzaGFkb3dPZmZzZXRJbm5lcjEiIGluMj0iU291cmNlQWxwaGEiIG9wZXJhdG9yPSJhcml0aG1ldGljIiBrMj0iLTEiIGszPSIxIiByZXN1bHQ9InNoYWRvd0lubmVySW5uZXIxIi8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDEgMCAwIDAgMCAxIDAgMCAwIDAgMSAwIDAgMCAwLjI2MDg2OTU2NSAwIiBpbj0ic2hhZG93SW5uZXJJbm5lcjEiLz48L2ZpbHRlcj48ZmlsdGVyIHg9Ii0xLjclIiB5PSItMS43JSIgd2lkdGg9IjEwMy40JSIgaGVpZ2h0PSIxMDMuNCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9Im4iPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249Ii4yNSIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd0JsdXJJbm5lcjEiLz48ZmVPZmZzZXQgZHk9Ii41IiBpbj0ic2hhZG93Qmx1cklubmVyMSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRJbm5lcjEiLz48ZmVDb21wb3NpdGUgaW49InNoYWRvd09mZnNldElubmVyMSIgaW4yPSJTb3VyY2VBbHBoYSIgb3BlcmF0b3I9ImFyaXRobWV0aWMiIGsyPSItMSIgazM9IjEiIHJlc3VsdD0ic2hhZG93SW5uZXJJbm5lcjEiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMSAwIDAgMCAwIDEgMCAwIDAgMCAxIDAgMCAwIDAuMjYwODY5NTY1IDAiIGluPSJzaGFkb3dJbm5lcklubmVyMSIvPjwvZmlsdGVyPjxwYXRoIGlkPSJnIiBkPSJNMCAyMC41NTRsMTkuNjU0IDcuNTIgMS45NjctMS40MS0uMjk3LTEyLjQwMnoiLz48cGF0aCBpZD0iZCIgZD0iTTIwLjkwNCAzMC43MjNsMi4yNC0xLjgzMSA5Ljg2MSAzLjU4LTEyLjEgMTcuNDk1eiIvPjxwYXRoIGlkPSJqIiBkPSJNMjAuOTAyIDEwLjI2bDMwLjQ5NC00LjkxNkwyMC45MDQgMjcuOTF6Ii8+PHBhdGggaWQ9Im0iIGQ9Ik0yMS45NDkgMjguOTg3bDE2LjM1NCA2LjMwMkw1MS42NDIgNS41N3oiLz48cGF0aCBpZD0iYiIgZD0iTTAgMGg3MHY4NThIMHoiLz48bGluZWFyR3JhZGllbnQgeDE9IjU0LjUzMyUiIHkxPSIzMy40MTElIiB4Mj0iMi45MTclIiB5Mj0iODcuNjU2JSIgaWQ9ImYiPjxzdG9wIHN0b3AtY29sb3I9IiMwOTkyRkYiIG9mZnNldD0iMCUiLz48c3RvcCBzdG9wLWNvbG9yPSIjMDAyQkZGIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNTQuNTMzJSIgeTE9IjI3LjczNiUiIHgyPSIyLjkxNyUiIHkyPSIxMDAuNTM4JSIgaWQ9ImkiPjxzdG9wIHN0b3AtY29sb3I9IiMwOTkyRkYiIG9mZnNldD0iMCUiLz48c3RvcCBzdG9wLWNvbG9yPSIjMDAyQkZGIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMCUiIHkxPSI5OC42OSUiIHgyPSIwJSIgeTI9IjEuNDE2JSIgaWQ9ImMiPjxzdG9wIHN0b3AtY29sb3I9IiMxQzU5RjMiIG9mZnNldD0iMCUiLz48c3RvcCBzdG9wLWNvbG9yPSIjMUUzN0UwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iNTQuNTI1JSIgeTE9IjkuMzQ1JSIgeDI9IjMuMDA1JSIgeTI9IjE0Mi4yODUlIiBpZD0ibCI+PHN0b3Agc3RvcC1jb2xvcj0iIzA5OTJGRiIgb2Zmc2V0PSIwJSIvPjxzdG9wIHN0b3AtY29sb3I9IiMwMDJCRkYiIG9mZnNldD0iMTAwJSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZmlsbD0iI0ZBRkNGRiIgZD0iTS05LTI5aDE0NDB2ODU4SC05eiIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05IC0yOSkiPjx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI2EpIiB4bGluazpocmVmPSIjYiIvPjx1c2UgZmlsbD0iI0ZGRiIgeGxpbms6aHJlZj0iI2IiLz48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSI+PHVzZSBmaWxsPSJ1cmwoI2MpIiB4bGluazpocmVmPSIjZCIvPjx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI2UpIiB4bGluazpocmVmPSIjZCIvPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEpIj48dXNlIGZpbGw9InVybCgjZikiIHhsaW5rOmhyZWY9IiNnIi8+PHVzZSBmaWxsLW9wYWNpdHk9Ii43MjgiIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNnIi8+PHVzZSBmaWxsPSIjMDAwIiBmaWx0ZXI9InVybCgjaCkiIHhsaW5rOmhyZWY9IiNnIi8+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMSkiPjx1c2UgZmlsbD0idXJsKCNpKSIgeGxpbms6aHJlZj0iI2oiLz48dXNlIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNrKSIgeGxpbms6aHJlZj0iI2oiLz48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSI+PHVzZSBmaWxsPSJ1cmwoI2wpIiB4bGluazpocmVmPSIjbSIvPjx1c2UgZmlsbC1vcGFjaXR5PSIuNzI4IiBmaWxsPSIjRkZGIiB4bGluazpocmVmPSIjbSIvPjx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI24pIiB4bGluazpocmVmPSIjbSIvPjwvZz48L2c+PC9zdmc+",mSize:.15},new o.qrcode(w).generate(g,p);var Z=document.getElementById("note"),S=document.getElementById("code_input");document.getElementById("invite_code").innerHTML=r.a.vitex_invite_code,document.getElementById("btn_cppy").addEventListener("click",M,!1);var x=document.getElementById("link_join");x.href=g,x.addEventListener("click",M,!1)}},m3rI:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"f",(function(){return i})),n.d(t,"e",(function(){return o})),n.d(t,"d",(function(){return a})),n.d(t,"c",(function(){return u})),n.d(t,"b",(function(){return c}));var r="https://api.vitewallet.com/ios",i="https://x.vite.net/vitex_invite_outer/index.html",o="https://app.vite.net/webview/vitex_invite_middle/index.html",a="https://x.vite.net/vitex_invite_inner/index.html",u="https://vitex.vite.net/api/v1/inviter",c="https://growth.vite.net/api/coin/v1/init"},"m8P/":function(e,t,n){"use strict";function r(e){var t={vitex_invite_code:""};return 0===e.length?t:("?"===e[0]&&(e=e.slice(1)),0===e.length?t:(e.split("&").forEach((function(e){var n=e.split("=");n.length>1&&(t[n[0]]=n[1])})),t))}n.d(t,"b",(function(){return r})),t.a=r(location.search)},pW8Q:function(e,t,n){e.exports=n.p+"vitex_invite_outer/images/ee857ff4d37ba6f312ba746ec7a7cfc2.png"},ppkF:function(e,t,n){!function(e){"use strict";var t,n=(function(e,t){var n,r=function(){var e=function(e,t){var n=e,r=i[t],a=null,c=0,l=null,v=[],m={},w=function(e,t){a=function(e){for(var t=new Array(e),n=0;n<e;n+=1){t[n]=new Array(e);for(var r=0;r<e;r+=1)t[n][r]=null}return t}(c=4*n+17),p(0,0),p(c-7,0),p(0,c-7),M(),y(),S(e,t),7<=n&&Z(e),null==l&&(l=j(n,r,v)),x(l,t)},p=function(e,t){for(var n=-1;n<=7;n+=1)if(!(e+n<=-1||c<=e+n))for(var r=-1;r<=7;r+=1)t+r<=-1||c<=t+r||(a[e+n][t+r]=0<=n&&n<=6&&(0==r||6==r)||0<=r&&r<=6&&(0==n||6==n)||2<=n&&n<=4&&2<=r&&r<=4)},y=function(){for(var e=8;e<c-8;e+=1)null==a[e][6]&&(a[e][6]=e%2==0);for(var t=8;t<c-8;t+=1)null==a[6][t]&&(a[6][t]=t%2==0)},M=function(){for(var e=o.getPatternPosition(n),t=0;t<e.length;t+=1)for(var r=0;r<e.length;r+=1){var i=e[t],u=e[r];if(null==a[i][u])for(var c=-2;c<=2;c+=1)for(var l=-2;l<=2;l+=1)a[i+c][u+l]=-2==c||2==c||-2==l||2==l||0==c&&0==l}},Z=function(e){for(var t=o.getBCHTypeNumber(n),r=0;r<18;r+=1){var i=!e&&1==(t>>r&1);a[Math.floor(r/3)][r%3+c-8-3]=i}for(r=0;r<18;r+=1)i=!e&&1==(t>>r&1),a[r%3+c-8-3][Math.floor(r/3)]=i},S=function(e,t){for(var n=r<<3|t,i=o.getBCHTypeInfo(n),u=0;u<15;u+=1){var l=!e&&1==(i>>u&1);u<6?a[u][8]=l:u<8?a[u+1][8]=l:a[c-15+u][8]=l}for(u=0;u<15;u+=1)l=!e&&1==(i>>u&1),u<8?a[8][c-u-1]=l:u<9?a[8][15-u-1+1]=l:a[8][15-u-1]=l;a[c-8][8]=!e},x=function(e,t){for(var n=-1,r=c-1,i=7,u=0,l=o.getMaskFunction(t),f=c-1;0<f;f-=2)for(6==f&&(f-=1);;){for(var s=0;s<2;s+=1)if(null==a[r][f-s]){var g=!1;u<e.length&&(g=1==(e[u]>>>i&1)),l(r,f-s)&&(g=!g),a[r][f-s]=g,-1==(i-=1)&&(u+=1,i=7)}if((r+=n)<0||c<=r){r-=n,n=-n;break}}},j=function(e,t,n){for(var r=f.getRSBlocks(e,t),i=s(),a=0;a<n.length;a+=1){var c=n[a];i.put(c.getMode(),4),i.put(c.getLength(),o.getLengthInBits(c.getMode(),e)),c.write(i)}var l=0;for(a=0;a<r.length;a+=1)l+=r[a].dataCount;if(i.getLengthInBits()>8*l)throw"code length overflow. ("+i.getLengthInBits()+">"+8*l+")";for(i.getLengthInBits()+4<=8*l&&i.put(0,4);i.getLengthInBits()%8!=0;)i.putBit(!1);for(;!(i.getLengthInBits()>=8*l||(i.put(236,8),i.getLengthInBits()>=8*l));)i.put(17,8);return function(e,t){for(var n=0,r=0,i=0,a=new Array(t.length),c=new Array(t.length),l=0;l<t.length;l+=1){var f=t[l].dataCount,s=t[l].totalCount-f;r=Math.max(r,f),i=Math.max(i,s),a[l]=new Array(f);for(var g=0;g<a[l].length;g+=1)a[l][g]=255&e.getBuffer()[g+n];n+=f;var d=o.getErrorCorrectPolynomial(s),I=u(a[l],d.getLength()-1).mod(d);for(c[l]=new Array(d.getLength()-1),g=0;g<c[l].length;g+=1){var h=g+I.getLength()-c[l].length;c[l][g]=0<=h?I.getAt(h):0}}var v=0;for(g=0;g<t.length;g+=1)v+=t[g].totalCount;var m=new Array(v),b=0;for(g=0;g<r;g+=1)for(l=0;l<t.length;l+=1)g<a[l].length&&(m[b]=a[l][g],b+=1);for(g=0;g<i;g+=1)for(l=0;l<t.length;l+=1)g<c[l].length&&(m[b]=c[l][g],b+=1);return m}(i,r)};return m.addData=function(e,t){var n=null;switch(t=t||"Byte"){case"Numeric":n=g(e);break;case"Alphanumeric":n=d(e);break;case"Byte":n=I(e);break;case"Kanji":n=h(e);break;default:throw"mode:"+t}v.push(n),l=null},m.isDark=function(e,t){if(e<0||c<=e||t<0||c<=t)throw e+","+t;return a[e][t]},m.getModuleCount=function(){return c},m.make=function(){if(n<1){for(var e=1;e<40;e++){for(var t=f.getRSBlocks(e,r),i=s(),a=0;a<v.length;a++){var u=v[a];i.put(u.getMode(),4),i.put(u.getLength(),o.getLengthInBits(u.getMode(),e)),u.write(i)}var c=0;for(a=0;a<t.length;a++)c+=t[a].dataCount;if(i.getLengthInBits()<=8*c)break}n=e}w(!1,function(){for(var e=0,t=0,n=0;n<8;n+=1){w(!0,n);var r=o.getLostPoint(m);(0==n||r<e)&&(e=r,t=n)}return t}())},m.createTableTag=function(e,t){e=e||2;var n="";n+='<table style="',n+=" border-width: 0px; border-style: none;",n+=" border-collapse: collapse;",n+=" padding: 0px; margin: "+(t=void 0===t?4*e:t)+"px;",n+='">',n+="<tbody>";for(var r=0;r<m.getModuleCount();r+=1){n+="<tr>";for(var i=0;i<m.getModuleCount();i+=1)n+='<td style="',n+=" border-width: 0px; border-style: none;",n+=" border-collapse: collapse;",n+=" padding: 0px; margin: 0px;",n+=" width: "+e+"px;",n+=" height: "+e+"px;",n+=" background-color: ",n+=m.isDark(r,i)?"#000000":"#ffffff",n+=";",n+='"/>';n+="</tr>"}return(n+="</tbody>")+"</table>"},m.createSvgTag=function(e,t){e=e||2,t=void 0===t?4*e:t;var n,r,i,o,a=m.getModuleCount()*e+2*t,u="";for(o="l"+e+",0 0,"+e+" -"+e+",0 0,-"+e+"z ",u+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',u+=' width="'+a+'px"',u+=' height="'+a+'px"',u+=' viewBox="0 0 '+a+" "+a+'" ',u+=' preserveAspectRatio="xMinYMin meet">',u+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',u+='<path d="',r=0;r<m.getModuleCount();r+=1)for(i=r*e+t,n=0;n<m.getModuleCount();n+=1)m.isDark(r,n)&&(u+="M"+(n*e+t)+","+i+o);return(u+='" stroke="transparent" fill="black"/>')+"</svg>"},m.createDataURL=function(e,t){e=e||2,t=void 0===t?4*e:t;var n=m.getModuleCount()*e+2*t,r=t,i=n-t;return b(n,n,(function(t,n){if(r<=t&&t<i&&r<=n&&n<i){var o=Math.floor((t-r)/e),a=Math.floor((n-r)/e);return m.isDark(a,o)?0:1}return 1}))},m.createImgTag=function(e,t,n){e=e||2,t=void 0===t?4*e:t;var r=m.getModuleCount()*e+2*t,i="";return i+="<img",i+=' src="',i+=m.createDataURL(e,t),i+='"',i+=' width="',i+=r,i+='"',i+=' height="',i+=r,i+='"',n&&(i+=' alt="',i+=n,i+='"'),i+"/>"},m.renderTo2dContext=function(e,t){t=t||2;for(var n=m.getModuleCount(),r=0;r<n;r++)for(var i=0;i<n;i++)e.fillStyle=m.isDark(r,i)?"black":"white",e.fillRect(r*t,i*t,t,t)},m};e.stringToBytes=(e.stringToBytesFuncs={default:function(e){for(var t=[],n=0;n<e.length;n+=1){var r=e.charCodeAt(n);t.push(255&r)}return t}}).default,e.createStringToBytes=function(e,t){var n=function(){for(var n=m(e),r=function(){var e=n.read();if(-1==e)throw"eof";return e},i=0,o={};;){var a=n.read();if(-1==a)break;var u=r(),c=r()<<8|r();o[String.fromCharCode(a<<8|u)]=c,i+=1}if(i!=t)throw i+" != "+t;return o}(),r="?".charCodeAt(0);return function(e){for(var t=[],i=0;i<e.length;i+=1){var o=e.charCodeAt(i);if(o<128)t.push(o);else{var a=n[e.charAt(i)];"number"==typeof a?(255&a)==a?t.push(a):(t.push(a>>>8),t.push(255&a)):t.push(r)}}return t}};var t,n,r,i={L:1,M:0,Q:3,H:2},o=(t=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],r=function(e){for(var t=0;0!=e;)t+=1,e>>>=1;return t},(n={}).getBCHTypeInfo=function(e){for(var t=e<<10;0<=r(t)-r(1335);)t^=1335<<r(t)-r(1335);return 21522^(e<<10|t)},n.getBCHTypeNumber=function(e){for(var t=e<<12;0<=r(t)-r(7973);)t^=7973<<r(t)-r(7973);return e<<12|t},n.getPatternPosition=function(e){return t[e-1]},n.getMaskFunction=function(e){switch(e){case 0:return function(e,t){return(e+t)%2==0};case 1:return function(e,t){return e%2==0};case 2:return function(e,t){return t%3==0};case 3:return function(e,t){return(e+t)%3==0};case 4:return function(e,t){return(Math.floor(e/2)+Math.floor(t/3))%2==0};case 5:return function(e,t){return e*t%2+e*t%3==0};case 6:return function(e,t){return(e*t%2+e*t%3)%2==0};case 7:return function(e,t){return(e*t%3+(e+t)%2)%2==0};default:throw"bad maskPattern:"+e}},n.getErrorCorrectPolynomial=function(e){for(var t=u([1],0),n=0;n<e;n+=1)t=t.multiply(u([1,a.gexp(n)],0));return t},n.getLengthInBits=function(e,t){if(1<=t&&t<10)switch(e){case 1:return 10;case 2:return 9;case 4:case 8:return 8;default:throw"mode:"+e}else if(t<27)switch(e){case 1:return 12;case 2:return 11;case 4:return 16;case 8:return 10;default:throw"mode:"+e}else{if(!(t<41))throw"type:"+t;switch(e){case 1:return 14;case 2:return 13;case 4:return 16;case 8:return 12;default:throw"mode:"+e}}},n.getLostPoint=function(e){for(var t=e.getModuleCount(),n=0,r=0;r<t;r+=1)for(var i=0;i<t;i+=1){for(var o=0,a=e.isDark(r,i),u=-1;u<=1;u+=1)if(!(r+u<0||t<=r+u))for(var c=-1;c<=1;c+=1)i+c<0||t<=i+c||0==u&&0==c||a==e.isDark(r+u,i+c)&&(o+=1);5<o&&(n+=3+o-5)}for(r=0;r<t-1;r+=1)for(i=0;i<t-1;i+=1){var l=0;e.isDark(r,i)&&(l+=1),e.isDark(r+1,i)&&(l+=1),e.isDark(r,i+1)&&(l+=1),e.isDark(r+1,i+1)&&(l+=1),0!=l&&4!=l||(n+=3)}for(r=0;r<t;r+=1)for(i=0;i<t-6;i+=1)e.isDark(r,i)&&!e.isDark(r,i+1)&&e.isDark(r,i+2)&&e.isDark(r,i+3)&&e.isDark(r,i+4)&&!e.isDark(r,i+5)&&e.isDark(r,i+6)&&(n+=40);for(i=0;i<t;i+=1)for(r=0;r<t-6;r+=1)e.isDark(r,i)&&!e.isDark(r+1,i)&&e.isDark(r+2,i)&&e.isDark(r+3,i)&&e.isDark(r+4,i)&&!e.isDark(r+5,i)&&e.isDark(r+6,i)&&(n+=40);var f=0;for(i=0;i<t;i+=1)for(r=0;r<t;r+=1)e.isDark(r,i)&&(f+=1);return n+Math.abs(100*f/t/t-50)/5*10},n),a=function(){for(var e=new Array(256),t=new Array(256),n=0;n<8;n+=1)e[n]=1<<n;for(n=8;n<256;n+=1)e[n]=e[n-4]^e[n-5]^e[n-6]^e[n-8];for(n=0;n<255;n+=1)t[e[n]]=n;return{glog:function(e){if(e<1)throw"glog("+e+")";return t[e]},gexp:function(t){for(;t<0;)t+=255;for(;256<=t;)t-=255;return e[t]}}}();function u(e,t){if(void 0===e.length)throw e.length+"/"+t;var n=function(){for(var n=0;n<e.length&&0==e[n];)n+=1;for(var r=new Array(e.length-n+t),i=0;i<e.length-n;i+=1)r[i]=e[i+n];return r}(),r={getAt:function(e){return n[e]},getLength:function(){return n.length},multiply:function(e){for(var t=new Array(r.getLength()+e.getLength()-1),n=0;n<r.getLength();n+=1)for(var i=0;i<e.getLength();i+=1)t[n+i]^=a.gexp(a.glog(r.getAt(n))+a.glog(e.getAt(i)));return u(t,0)},mod:function(e){if(r.getLength()-e.getLength()<0)return r;for(var t=a.glog(r.getAt(0))-a.glog(e.getAt(0)),n=new Array(r.getLength()),i=0;i<r.getLength();i+=1)n[i]=r.getAt(i);for(i=0;i<e.getLength();i+=1)n[i]^=a.gexp(a.glog(e.getAt(i))+t);return u(n,0).mod(e)}};return r}var c,l,f=(c=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],(l={}).getRSBlocks=function(e,t){var n=function(e,t){switch(t){case i.L:return c[4*(e-1)+0];case i.M:return c[4*(e-1)+1];case i.Q:return c[4*(e-1)+2];case i.H:return c[4*(e-1)+3];default:return}}(e,t);if(void 0===n)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+t;for(var r,o,a=n.length/3,u=[],l=0;l<a;l+=1)for(var f=n[3*l+0],s=n[3*l+1],g=n[3*l+2],d=0;d<f;d+=1)u.push((r=g,o=void 0,(o={}).totalCount=s,o.dataCount=r,o));return u},l),s=function(){var e=[],t=0,n={getBuffer:function(){return e},getAt:function(t){var n=Math.floor(t/8);return 1==(e[n]>>>7-t%8&1)},put:function(e,t){for(var r=0;r<t;r+=1)n.putBit(1==(e>>>t-r-1&1))},getLengthInBits:function(){return t},putBit:function(n){var r=Math.floor(t/8);e.length<=r&&e.push(0),n&&(e[r]|=128>>>t%8),t+=1}};return n},g=function(e){var t=e,n={getMode:function(){return 1},getLength:function(e){return t.length},write:function(e){for(var n=t,i=0;i+2<n.length;)e.put(r(n.substring(i,i+3)),10),i+=3;i<n.length&&(n.length-i==1?e.put(r(n.substring(i,i+1)),4):n.length-i==2&&e.put(r(n.substring(i,i+2)),7))}},r=function(e){for(var t=0,n=0;n<e.length;n+=1)t=10*t+i(e.charAt(n));return t},i=function(e){if("0"<=e&&e<="9")return e.charCodeAt(0)-"0".charCodeAt(0);throw"illegal char :"+e};return n},d=function(e){var t=e,n={getMode:function(){return 2},getLength:function(e){return t.length},write:function(e){for(var n=t,i=0;i+1<n.length;)e.put(45*r(n.charAt(i))+r(n.charAt(i+1)),11),i+=2;i<n.length&&e.put(r(n.charAt(i)),6)}},r=function(e){if("0"<=e&&e<="9")return e.charCodeAt(0)-"0".charCodeAt(0);if("A"<=e&&e<="Z")return e.charCodeAt(0)-"A".charCodeAt(0)+10;switch(e){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+e}};return n},I=function(t){var n=e.stringToBytes(t);return{getMode:function(){return 4},getLength:function(e){return n.length},write:function(e){for(var t=0;t<n.length;t+=1)e.put(n[t],8)}}},h=function(t){var n=e.stringToBytesFuncs.SJIS;if(!n)throw"sjis not supported.";!function(e,t){var r=n("友");if(2!=r.length||38726!=(r[0]<<8|r[1]))throw"sjis not supported."}();var r=n(t);return{getMode:function(){return 8},getLength:function(e){return~~(r.length/2)},write:function(e){for(var t=r,n=0;n+1<t.length;){var i=(255&t[n])<<8|255&t[n+1];if(33088<=i&&i<=40956)i-=33088;else{if(!(57408<=i&&i<=60351))throw"illegal char at "+(n+1)+"/"+i;i-=49472}i=192*(i>>>8&255)+(255&i),e.put(i,13),n+=2}if(n<t.length)throw"illegal char at "+(n+1)}}},v=function(){var e=[],t={writeByte:function(t){e.push(255&t)},writeShort:function(e){t.writeByte(e),t.writeByte(e>>>8)},writeBytes:function(e,n,r){n=n||0,r=r||e.length;for(var i=0;i<r;i+=1)t.writeByte(e[i+n])},writeString:function(e){for(var n=0;n<e.length;n+=1)t.writeByte(e.charCodeAt(n))},toByteArray:function(){return e},toString:function(){var t="";t+="[";for(var n=0;n<e.length;n+=1)0<n&&(t+=","),t+=e[n];return t+"]"}};return t},m=function(e){var t=e,n=0,r=0,i=0,o={read:function(){for(;i<8;){if(n>=t.length){if(0==i)return-1;throw"unexpected end of file./"+i}var e=t.charAt(n);if(n+=1,"="==e)return i=0,-1;e.match(/^\s$/)||(r=r<<6|a(e.charCodeAt(0)),i+=6)}var o=r>>>i-8&255;return i-=8,o}},a=function(e){if(65<=e&&e<=90)return e-65;if(97<=e&&e<=122)return e-97+26;if(48<=e&&e<=57)return e-48+52;if(43==e)return 62;if(47==e)return 63;throw"c:"+e};return o},b=function(e,t,n){for(var r,i,o,a,u,c,l,f,s=(o=r=e,a=i=t,u=new Array(r*i),c={setPixel:function(e,t,n){u[t*o+e]=n},write:function(e){e.writeString("GIF87a"),e.writeShort(o),e.writeShort(a),e.writeByte(128),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(0),e.writeByte(255),e.writeByte(255),e.writeByte(255),e.writeString(","),e.writeShort(0),e.writeShort(0),e.writeShort(o),e.writeShort(a),e.writeByte(0);var t=l(2);e.writeByte(2);for(var n=0;255<t.length-n;)e.writeByte(255),e.writeBytes(t,n,255),n+=255;e.writeByte(t.length-n),e.writeBytes(t,n,t.length-n),e.writeByte(0),e.writeString(";")}},l=function(e){for(var t=1<<e,n=1+(1<<e),r=e+1,i=f(),o=0;o<t;o+=1)i.add(String.fromCharCode(o));i.add(String.fromCharCode(t)),i.add(String.fromCharCode(n));var a,c,l,s=v(),g=(a=s,l=c=0,{write:function(e,t){if(e>>>t!=0)throw"length over";for(;8<=c+t;)a.writeByte(255&(e<<c|l)),t-=8-c,e>>>=8-c,c=l=0;l|=e<<c,c+=t},flush:function(){0<c&&a.writeByte(l)}});g.write(t,r);var d=0,I=String.fromCharCode(u[d]);for(d+=1;d<u.length;){var h=String.fromCharCode(u[d]);d+=1,i.contains(I+h)?I+=h:(g.write(i.indexOf(I),r),i.size()<4095&&(i.size()==1<<r&&(r+=1),i.add(I+h)),I=h)}return g.write(i.indexOf(I),r),g.write(n,r),g.flush(),s.toByteArray()},f=function(){var e={},t=0,n={add:function(r){if(n.contains(r))throw"dup key:"+r;e[r]=t,t+=1},size:function(){return t},indexOf:function(t){return e[t]},contains:function(t){return void 0!==e[t]}};return n},c),g=0;g<t;g+=1)for(var d=0;d<e;d+=1)s.setPixel(d,g,n(d,g));var I=v();s.write(I);for(var h,m,b,w,p,y,M,Z=(b=m=h=0,w="",y=function(e){w+=String.fromCharCode(M(63&e))},M=function(e){if(e<0);else{if(e<26)return 65+e;if(e<52)return e-26+97;if(e<62)return e-52+48;if(62==e)return 43;if(63==e)return 47}throw"n:"+e},(p={}).writeByte=function(e){for(h=h<<8|255&e,m+=8,b+=1;6<=m;)y(h>>>m-6),m-=6},p.flush=function(){if(0<m&&(y(h<<6-m),m=h=0),b%3!=0)for(var e=3-b%3,t=0;t<e;t+=1)w+="="},p.toString=function(){return w},p),S=I.toByteArray(),x=0;x<S.length;x+=1)Z.writeByte(S[x]);return Z.flush(),"data:image/gif;base64,"+Z};return e}();r.stringToBytesFuncs["UTF-8"]=function(e){return function(e){for(var t=[],n=0;n<e.length;n++){var r=e.charCodeAt(n);r<128?t.push(r):r<2048?t.push(192|r>>6,128|63&r):r<55296||57344<=r?t.push(224|r>>12,128|r>>6&63,128|63&r):(n++,r=65536+((1023&r)<<10|1023&e.charCodeAt(n)),t.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|63&r))}return t}(e)},n=function(){return r},e.exports=n()}(t={exports:{}}),t.exports),r={minVersion:1,maxVersion:40,ecLevel:"H",size:500,fill:"#000",background:null,radius:0,quiet:0,mode:0,mSize:.3,mPosX:.5,mPosY:.5,label:"no label",fontname:"sans",fontcolor:"#000",image:null},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function a(e,t,n,r,i,o,a,u){e.isDark(a,u)&&t.rect(r,i,o,o)}function u(e,t,n,r,i,o,a,u){var c,l,f,s,g,d,I,h,v,m,b,w,p,y,M,Z,S,x,j,k=e.isDark,P=r+o,C=i+o,A=n.radius*o,G=a-1,B=a+1,T=u-1,D=u+1,L=k(a,u),z=k(G,T),W=k(G,u),N=k(G,D),J=k(a,D),H=k(B,D),V=k(B,u),R=k(B,T),E=k(a,T);L?(m=t,b=r,w=i,p=P,y=C,M=A,S=!W&&!J,x=!V&&!J,j=!V&&!E,(Z=!W&&!E)?m.moveTo(b+M,w):m.moveTo(b,w),S?(m.lineTo(p-M,w),m.arcTo(p,w,p,y,M)):m.lineTo(p,w),x?(m.lineTo(p,y-M),m.arcTo(p,y,b,y,M)):m.lineTo(p,y),j?(m.lineTo(b+M,y),m.arcTo(b,y,b,w,M)):m.lineTo(b,y),Z?(m.lineTo(b,w+M),m.arcTo(b,w,p,w,M)):m.lineTo(b,w)):(c=t,l=r,f=i,s=P,g=C,d=A,I=W&&J&&N,h=V&&J&&H,v=V&&E&&R,W&&E&&z&&(c.moveTo(l+d,f),c.lineTo(l,f),c.lineTo(l,f+d),c.arcTo(l,f,l+d,f,d)),I&&(c.moveTo(s-d,f),c.lineTo(s,f),c.lineTo(s,f+d),c.arcTo(s,f,s-d,f,d)),h&&(c.moveTo(s-d,g),c.lineTo(s,g),c.lineTo(s,g-d),c.arcTo(s,g,s-d,g,d)),v&&(c.moveTo(l+d,g),c.lineTo(l,g),c.lineTo(l,g-d),c.arcTo(l,g,l+d,g,d)))}function c(e,t,r,i){var o={},a=new n(r,t);a.addData(e),a.make(),i=i||0;var u=a.getModuleCount(),c=a.getModuleCount()+2*i;return o.text=e,o.level=t,o.version=r,o.moduleCount=c,o.isDark=function(e,t){return t-=i,!((e-=i)<0||u<=e||t<0||u<=t)&&a.isDark(e,t)},o.addBlank=function(e,t,n,r){var i=o.isDark,a=1/c;o.isDark=function(o,u){var c=u*a,l=o*a,f=c+a,s=l+a;return i(o,u)&&(f<e||n<c||s<t||r<l)}},o}function l(e,t,n){var r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return new Promise((function(i){var l=o({},n,{image:r});e.width=l.size,e.height=l.size;var f=function(e,t,n,r,i){n=Math.max(1,n||1),r=Math.min(40,r||40);for(var o=n;o<=r;o+=1)try{return c(e,t,o,i)}catch(e){console.log(e)}throw new Error("Unable to generate QrCode")}(t,l.ecLevel,l.minVersion,l.maxVersion,l.quiet);f||i(null);var s,g,d,I,h,v,m,b,w,p,y,M,Z,S,x,j,k,P,C,A,G,B=e.getContext("2d");s=f,g=B,C=(d=l).background,A=d.size,G=d.mode,C&&(g.fillStyle=C,g.fillRect(0,0,A,A)),1===G||2===G?function(e,t,n){var r=n.size,i=n.mSize,o=n.fontname,a=n.label,u=n.mPosX,c=n.mPosY,l=n.mode,f=n.fontcolor,s="bold "+i*r+"px "+o,g=t;g.font=s;var d=g.measureText(a).width/r,I=(1-d)*u,h=(1-i)*c,v=I+d,m=h+i;1===l?e.addBlank(0,h-.01,r,m+.01):e.addBlank(I-.01,h-.01,v+.01,m+.01),t.fillStyle=f,t.font=s,t.fillText(a,I*r,h*r+.75*i*r)}(s,g,d):3!==G&&4!==G||(I=s,h=g,m=(v=d).size,b=v.image,w=v.mSize,p=v.mPosX,y=v.mPosY,M=v.mode,k=(x=(1-(S=(Z=w)*(b.naturalWidth||1)/(b.naturalHeight||1)))*p)+S,P=(j=(1-Z)*y)+Z,3===M?I.addBlank(0,j-.01,m,P+.01):I.addBlank(x-.01,j-.01,k+.01,P+.01),h.drawImage(b,x*m,j*m,S*m,Z*m)),function(e,t,n){var r=e.moduleCount,i=n.size,o=n.radius,c=n.fill,l=i/r,f=a,s=void 0,g=void 0;for(0<o&&o<=.5&&(f=u),t.beginPath(),s=0;s<r;s+=1)for(g=0;g<r;g+=1)f(e,t,n,g*l,s*l,l,s,g);t.fillStyle=c,t.fill()}(f,B,l),i(e)}))}var f=function(){function e(t){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.element=null,this.canvasElement=null,this.image=null,!(t instanceof HTMLDivElement||t instanceof HTMLCanvasElement))throw new TypeError("Please provide a div element or canvas element render a qrCode canvas");t&&t instanceof HTMLDivElement?(this.element=t,this.canvasElement=document.createElement("canvas"),this.element.appendChild(this.canvasElement)):t&&t instanceof HTMLCanvasElement&&(this.canvasElement=t)}return i(e,[{key:"generate",value:function(e,t){var n=this,i=Promise.resolve(),o=Object.assign(r,t);return!this.canvasElement||3!==o.mode&&4!==o.mode?this.canvasElement&&(i=i.then((function(){return l(n.canvasElement,e,o)}))):i=i.then((function(){return t=n.canvasElement,r=e,i=o,new Promise((function(e,n){var o=i.image,a=new Image;a.addEventListener("load",(function(){l(t,r,i,a).then((function(){return e()}))})),a.addEventListener("error",(function(e){console.log(e),n(new Error("Please provide a valid image"))})),o&&"string"==typeof o?a.src=o:n(new TypeError("Please provide a url to an image for Mode DRAW_WITH_IMAGE_STRIP and DRAW_WITH_IMAGE_BOX"))}));var t,r,i})),i.then((function(){try{n.image=n.canvasElement.toDataURL()}catch(e){console.log(e)}}))}},{key:"getImage",value:function(){return this.image}}]),e}();e.qrcode=f,e.modes={NORMAL:0,DRAW_WITH_LABEL_STRIP:1,DRAW_WITH_LABEL_BOX:2,DRAW_WITH_IMAGE_STRIP:3,DRAW_WITH_IMAGE_BOX:4},e.ecLevel={LOW:"L",MEDIUM:"M",QUARTILE:"Q",HIGH:"H"},Object.defineProperty(e,"__esModule",{value:!0})}(t)},"yJ+k":function(e,t,n){e.exports=n.p+"vitex_invite_outer/images/597cfa3f601bb2e296c2d58b3c1421af.png"}});