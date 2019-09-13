!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.force=t():e.force=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";e.exports={OAuth:n(1),DataService:n(2)}},function(e,t){"use strict";function n(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=0,c=window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/")),u=window.location.protocol+"//"+window.location.hostname+(window.location.port?":"+window.location.port:""),h=u+c,p=void 0,l=function(e){var t={},n=e.indexOf("#");if(n>-1){var r=decodeURIComponent(e.substr(n+1)),o=r.split("&");o.forEach(function(e){var n=e.split("=");t[n[0]]=n[1]})}return t};e.exports={createInstance:function(e,t,n){return window.cordova?new f(e,t,n):new v(e,t,n)}};var d=function(){function e(t,n,r){o(this,e),s+=1,this.instanceId=s,this.appId=t||"3MVG9fMtCkV6eLheIEZplMqWfnGlf3Y.BcWdOf1qytXo9zxgbsrUbS.ExHTgUPJeb3jZeT8NYhc.hMyznKU92",this.loginURL=n||"https://login.salesforce.com",this.oauthCallbackURL=r||h+"/oauthcallback.html"}return i(e,[{key:"login",value:function(){}},{key:"loginGuest",value:function(){}}]),e}(),f=function(e){function t(){return o(this,t),n(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return r(t,e),i(t,[{key:"login",value:function(){return new Promise(function(e,t){document.addEventListener("deviceready",function(){return(p=cordova.require("com.salesforce.plugin.oauth"))?void p.getAuthCredentials(function(t){e({accessToken:t.accessToken,instanceURL:t.instanceUrl,refreshToken:t.refreshToken,userId:t.userId})},function(e){console.log(e),t(e)}):(console.error("Salesforce Mobile SDK OAuth plugin not available"),void t("Salesforce Mobile SDK OAuth plugin not available"))},!1)})}}]),t}(d),v=function(e){function t(){return o(this,t),n(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return r(t,e),i(t,[{key:"login",value:function(){var e=this;return new Promise(function(t,n){console.log("loginURL: "+e.loginURL),console.log("oauthCallbackURL: "+e.oauthCallbackURL);var r=function(){window.removeEventListener("message",s),window.removeEventListener("storage",o),localStorage.removeItem("oauthCallback")},o=function(t){if("oauthCallback"===t.key){var n=t.url.replace(/#.*/,"");n===e.oauthCallbackURL&&i(t.newValue)}},i=function(o){var a=l(o);if(a.state==e.instanceId){if(a.access_token)return Promise.resolve().then(function(){return t({appId:e.appId,accessToken:a.access_token,instanceURL:a.instance_url,refreshToken:a.refresh_token,userId:a.id.split("/").pop()})}).then(function(e){return r(),e});n(a)}},s=function(e){"object"===a(e.data)&&"oauthCallback"===e.data.type&&i(e.data.url)};window.addEventListener("message",s),window.addEventListener("storage",o),document.addEventListener("oauthCallback",function(e){var t=e.detail;i(t)});var c=e.loginURL+("/services/oauth2/authorize?client_id="+e.appId+"&redirect_uri="+e.oauthCallbackURL+"&response_type=token&state="+e.instanceId);window.open(c,"_blank","location=no")})}},{key:"callback",value:function(e){var t="oauthCallback";window.opener&&window.opener.postMessage({type:t,url:e},"*"),localStorage.setItem(t,e),window.close()}}]),t}(d)},function(e,t){"use strict";function n(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var a=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var a=Object.getPrototypeOf(t);return null===a?void 0:e(a,n,r)}if("value"in o)return o.value;var i=o.get;if(void 0!==i)return i.call(r)},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/")),c=window.location.protocol+"//"+window.location.hostname+(window.location.port?":"+window.location.port:""),u=c+s,h=function(e,t){return"/"!==e.charAt(e.length-1)&&(e+="/"),"/"===t.charAt(0)&&(t=t.substr(1)),e+t},p=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=[],r=void 0;for(r in e)e.hasOwnProperty(r)&&(t?n.push(encodeURIComponent(r)+"="+encodeURIComponent(e[r])):n.push(r+"="+e[r]));return n.join("&")},l=function(e){var t=e.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([^?#]*)(\?[^#]*|)(#.*|)$/);return t&&{protocol:t[1],host:t[2],hostname:t[3],port:t[4],path:t[5],params:parseQueryString(t[6]),hash:t[7]}},d=void 0,f={},v=void 0;document.addEventListener("deviceready",function(){try{v=cordova.require("com.salesforce.plugin.network")}catch(e){}},!1),e.exports={createInstance:function(e,t,n){var r=void 0;return r=window.cordova?new g(e,t):new b(e,t),n?f[n]=r:d=r,r},getInstance:function(e){return e?f[e]:d}};var y=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};o(this,e),this.appId=t.appId,this.accessToken=t.accessToken,this.instanceURL=t.instanceURL,this.refreshToken=t.refreshToken,this.userId=t.userId,this.apiVersion=n.apiVersion||"v41.0",this.loginURL=n.loginURL||"https://login.salesforce.com",void 0==n.useProxy?this.useProxy=!(window.cordova||window.SfdcApp||window.sforce||window.LCC):this.useProxy=n.useProxy,this.proxyURL=n.proxyURL||u}return i(e,[{key:"getRequestBaseURL",value:function(){var e=void 0;return e=this.useProxy?this.proxyURL:this.instanceURL?this.instanceURL:c,"/"===e.slice(-1)&&(e=e.slice(0,-1)),e}},{key:"refreshAccessToken",value:function(){}},{key:"getUserId",value:function(){return this.userId}},{key:"request",value:function(e){var t=this;return new Promise(function(n,r){if(!t.accessToken&&!t.refreshToken)return void("function"==typeof errorHandler&&r("No access token. Login and try again."));var o=e.method||"GET",a=t.getRequestBaseURL();"/"!==e.path.charAt(0)&&(e.path="/"+e.path),a+=e.path,e.params&&(a+="?"+p(e.params));var i=new XMLHttpRequest;if(i.onreadystatechange=function(){if(4===i.readyState)if(i.status>199&&i.status<300)if("arraybuffer"==i.responseType)n(i.response);else{try{var o=i.responseText?JSON.parse(i.responseText):void 0}catch(e){var o=i.responseText}n(o)}else 401===i.status&&t.refreshToken?t.refreshAccessToken().then(function(){return t.request(e).then(function(e){return n(e)}).catch(function(e){return r(e)})}).catch(function(){r(i)}):r(i)},i.open(o,a,!0),i.setRequestHeader("Accept","application/json"),i.setRequestHeader("Authorization","Bearer "+t.accessToken),i.setRequestHeader("Cache-Control","no-store"),i.setRequestHeader("X-Connect-Bearer-Urls",!0),e.responseType&&(i.responseType=e.responseType),e.contentType&&i.setRequestHeader("Content-Type",e.contentType),e.headerParams){var s=!0,c=!1,u=void 0;try{for(var h,l=Object.getOwnPropertyNames(e.headerParams)[Symbol.iterator]();!(s=(h=l.next()).done);s=!0){var d=h.value,f=e.headerParams[d];console.log("additional header "+d+" set with "+f),"origin"===d.toLowerCase()?i.withCredentials=!0:i.setRequestHeader(d,f)}}catch(e){c=!0,u=e}finally{try{!s&&l.return&&l.return()}finally{if(c)throw u}}}t.useProxy&&i.setRequestHeader("Target-URL",t.instanceURL),i.send(e.data?JSON.stringify(e.data):void 0)})}},{key:"query",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n={path:"/services/data/"+this.apiVersion+"/query",params:{q:e}};return t?this.batchTransaction(n):this.request(n)}},{key:"queryAll",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n={path:"/services/data/"+this.apiVersion+"/queryAll",params:{q:e}};return t?this.batchTransaction(n):this.request(n)}},{key:"retrieve",value:function(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]&&arguments[3],o={path:"/services/data/"+this.apiVersion+"/sobjects/"+e+"/"+t,params:n?{fields:"string"==typeof n?n:n.join(",")}:void 0};return r?this.batchTransaction(o):this.request(o)}},{key:"getPickListValues",value:function(e,t){var n={path:"/services/data/"+this.apiVersion+"/sobjects/"+e+"/describe"};return t?this.batchTransaction(n):this.request(n)}},{key:"create",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r={method:"POST",contentType:"application/json",path:"/services/data/"+this.apiVersion+"/sobjects/"+e+"/",data:t};return n?this.batchTransaction(r):this.request(r)}},{key:"update",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"POST",r=arguments.length>3&&void 0!==arguments[3]&&arguments[3],o=t.Id||t.id,a=JSON.parse(JSON.stringify(t));delete a.attributes,delete a.Id,delete a.id;var i={method:n,contentType:"application/json",path:"/services/data/"+this.apiVersion+"/sobjects/"+e+"/"+o,params:{_HttpMethod:"PATCH"},data:a};return r?this.batchTransaction(i):this.request(i)}},{key:"del",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r={method:"DELETE",path:"/services/data/"+this.apiVersion+"/sobjects/"+e+"/"+t};return n?this.batchTransaction(r):this.request(r)}},{key:"upsert",value:function(e,t,n,r){var o=arguments.length>4&&void 0!==arguments[4]&&arguments[4],a={method:"PATCH",contentType:"application/json",path:"/services/data/"+this.apiVersion+"/sobjects/"+e+"/"+t+"/"+n,data:r};return o?this.batchTransaction(a):this.request(a)}},{key:"apexrest",value:function(e){var t=void 0;return"string"==typeof e?t={path:e,method:"GET"}:(t=e,"/"!==t.path.charAt(0)&&(t.path="/"+t.path),"/services/apexrest"!==t.path.substr(0,18)&&(t.path="/services/apexrest"+t.path)),t.contentType||(t.contentType="DELETE"==t.method||"GET"==t.method?null:"application/json"),this.request(t)}},{key:"chatter",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n="/services/data/"+this.apiVersion+"/chatter",r=void 0;if(e&&e.substring)r={path:h(n,e)};else{if(!e||!e.path)return new Promise(function(e,t){return t("You must specify a path for the request")});r=e,r.path=h(n,e.path)}var o=r;return t?this.batchTransaction(o):this.request(o)}},{key:"versions",value:function(){return this.request({path:"/services/data/"})}},{key:"resources",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t={path:"/services/data/"+this.apiVersion};return e?this.batchTransaction(t):this.request(t)}},{key:"describeGlobal",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t={path:"/services/data/"+this.apiVersion+"/sobjects"};return e?this.batchTransaction(t):this.request(t)}},{key:"metadata",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n={path:"/services/data/"+this.apiVersion+"/sobjects/"+e};return t?this.batchTransaction(n):this.request(n)}},{key:"describe",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n={path:"/services/data/"+this.apiVersion+"/sobjects/"+e+"/describe"};return t?this.batchTransaction(n):this.request(n)}},{key:"describeLayout",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];t=t||"";var r={path:"/services/data/"+this.apiVersion+"/sobjects/"+e+"/describe/layouts/"+t};return n?this.batchTransaction(r):this.request(r)}},{key:"reports",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];""!==e&&(e="/"+e);var n={path:"/services/data/"+this.apiVersion+"/analytics/reports"+e};return t?this.batchTransaction(n):this.request(n)}},{key:"dashboard",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];""!==e&&(e="/"+e);var n={path:"/services/data/"+this.apiVersion+"/analytics/dashboards"+e};return t?this.batchTransaction(n):this.request(n)}},{key:"queryMore",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=l(e),r={path:n.path,params:n.params};return t?this.batchTransaction(r):this.request(r)}},{key:"search",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n={path:"/services/data/"+this.apiVersion+"/search",params:{q:e}};return t?this.batchTransaction(n):this.request(n)}},{key:"batchTransaction",value:function(e){return e.method||(e.method="GET"),"/"!==e.path.charAt(0)&&(e.path="/"+e.path),e.params?e.url=e.path+"?"+p(e.params,!1):e.url=e.path,e.hasOwnProperty("data")&&(e.body=e.data,delete e.data),delete e.params,delete e.path,new Promise(function(t,n){return t(e)})}},{key:"batch",value:function(e){for(var t=0;t<e.length;t++)delete e[t].contentType,e[t].hasOwnProperty("body")&&(e[t].richInput=e[t].body,delete e[t].body);return this.request({method:"POST",contentType:"application/json",path:"/services/data/"+this.apiVersion+"/composite/batch",data:{batchRequests:e}})}},{key:"composite",value:function(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=0;n<e.length;n++)delete e[n].contentType;return t?this.request({method:"POST",contentType:"application/json",path:"/services/data/"+this.apiVersion+"/composite/tree/"+t+"/",data:{records:e}}):this.request({method:"POST",contentType:"application/json",path:"/services/data/"+this.apiVersion+"/composite",data:{compositeRequest:e}})}}]),e}(),b=function(e){function t(){return o(this,t),n(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return r(t,e),i(t,[{key:"refreshAccessToken",value:function(){var e=this;return new Promise(function(t,n){if(!e.refreshToken)return console.log("Missing refreshToken"),void n("Missing refreshToken");if(!e.appId)return console.log("Missing appId"),void n("Missing appId");var r=new XMLHttpRequest,o={grant_type:"refresh_token",refresh_token:e.refreshToken,client_id:e.appId},a=e.useProxy?e.proxyURL:e.loginURL;a=a+"/services/oauth2/token?"+p(o),r.onreadystatechange=function(){if(4===r.readyState)if(200===r.status){console.log("Token refreshed");var o=JSON.parse(r.responseText);e.accessToken=o.access_token,t()}else console.log("Error while trying to refresh token: "+r.responseText),n()},r.open("POST",a,!0),e.useProxy||r.setRequestHeader("Target-URL",e.loginURL),r.send()})}}]),t}(y),g=function(e){function t(){return o(this,t),n(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return r(t,e),i(t,[{key:"refreshAccessToken",value:function(){var e=this;return new Promise(function(t,n){document.addEventListener("deviceready",function(){var r=void 0;try{r=cordova.require("com.salesforce.plugin.oauth")}catch(e){}return r?void r.authenticate(function(n){e.accessToken=n.accessToken,t()},function(){console.error("Error refreshing oauth access token using the oauth plugin"),n()}):(console.error("Salesforce Mobile SDK OAuth plugin not available"),void n("Salesforce Mobile SDK OAuth plugin not available"))},!1)})}},{key:"computeEndPointIfMissing",value:function(e,t){if(void 0!==e)return{endPoint:e,path:t};var n=t.split("/").filter(function(e){return""!==e});return n.length>=2?{endPoint:"/"+n.slice(0,2).join("/"),path:"/"+n.slice(2).join("/")}:{endPoint:"",path:t}}},{key:"request",value:function(e){var n=this;return v?e.hasOwnProperty("direct")&&e.direct?(e.responseType="arraybuffer",a(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"request",this).call(this,e)):new Promise(function(t,r){var o=n.computeEndPointIfMissing(e.endPoint,e.path);void 0===e.params&&(e.params={}),"q"in e.params&&(e.params.q=e.params.q.replace(/[\n]/g," ")),v.sendRequest(o.endPoint,o.path,t,r,e.method,e.data||e.params,e.headerParams)}):a(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"request",this).call(this,e)}}]),t}(y)}])});