/**
 * forcejs - REST toolkit for Salesforce.com
 * forcejs/oauth - OAuth User Agent Workflow module
 * Author: Christophe Coenraets @ccoenraets
 * Version: 2.2.1
 */
"use strict";

let instanceCounter = 0;

// if page URL is http://localhost:3000/myapp/index.html, context is /myapp
let context = window.location.pathname.substring(
  0,
  window.location.pathname.lastIndexOf("/")
);

// if page URL is http://localhost:3000/myapp/index.html, serverURL is http://localhost:3000
let serverURL =
  window.location.protocol +
  "//" +
  window.location.hostname +
  (window.location.port ? ":" + window.location.port : "");

// if page URL is http://localhost:3000/myapp/index.html, baseURL is http://localhost:3000/myapp
let baseURL = serverURL + context;

// Reference to the Salesforce OAuth plugin
let oauthPlugin;

let getQueryStringAsObject = url => {
  let obj = {};
  let index = url.indexOf("#");
  if (index > -1) {
    let queryString = decodeURIComponent(url.substr(index + 1));
    let params = queryString.split("&");
    params.forEach(param => {
      let splitter = param.split("=");
      obj[splitter[0]] = splitter[1];
    });
  }
  return obj;
};

module.exports = {
  createInstance: (appId, loginURL, oauthCallbackURL) => {
    return window.cordova
      ? new OAuthCordova(appId, loginURL, oauthCallbackURL)
      : new OAuthWeb(appId, loginURL, oauthCallbackURL);
  }
};

class OAuth {
  constructor(appId, loginURL, oauthCallbackURL) {
    instanceCounter = instanceCounter + 1;
    this.instanceId = instanceCounter;
    this.appId =
      appId ||
      "3MVG9fMtCkV6eLheIEZplMqWfnGlf3Y.BcWdOf1qytXo9zxgbsrUbS.ExHTgUPJeb3jZeT8NYhc.hMyznKU92";
    this.loginURL = loginURL || "https://login.salesforce.com";
    this.oauthCallbackURL = oauthCallbackURL || baseURL + "/oauthcallback.html";
  }

  login() {}

  loginGuest() {}
}

class OAuthCordova extends OAuth {
  login() {
    return new Promise((resolve, reject) => {
      document.addEventListener(
        "deviceready",
        () => {
          oauthPlugin = cordova.require("com.salesforce.plugin.oauth");
          if (!oauthPlugin) {
            console.error("Salesforce Mobile SDK OAuth plugin not available");
            reject("Salesforce Mobile SDK OAuth plugin not available");
            return;
          }
          oauthPlugin.getAuthCredentials(
            function(creds) {
              resolve({
                accessToken: creds.accessToken,
                instanceURL: creds.instanceUrl,
                refreshToken: creds.refreshToken,
                userId: creds.userId
              });
            },
            function(error) {
              console.log(error);
              reject(error);
            }
          );
        },
        false
      );
    });
  }
}

class OAuthWeb extends OAuth {
  login() {
    return new Promise((resolve, reject) => {
      console.log("loginURL: " + this.loginURL);
      console.log("oauthCallbackURL: " + this.oauthCallbackURL);
      const teardown = () => {
        window.removeEventListener("message", windowListener);
        window.removeEventListener("storage", storageListener);
        localStorage.removeItem("oauthCallback");
      };
      const storageListener = event => {
        if (event.key !== "oauthCallback") return;
        const url = event.url.replace(/#.*/, "");
        if (url !== this.oauthCallbackURL) return;
        getOAuthData(event.newValue);
      };
      const getOAuthData = url => {
        const oauthResult = getQueryStringAsObject(url);
        if (oauthResult.state == this.instanceId) {
          if (oauthResult.access_token) {
            return Promise.resolve()
              .then(() => {
                return resolve({
                  appId: this.appId,
                  accessToken: oauthResult.access_token,
                  instanceURL: oauthResult.instance_url,
                  refreshToken: oauthResult.refresh_token,
                  userId: oauthResult.id.split("/").pop()
                });
              })
              .then(result => {
                teardown();
                return result;
              });
          } else {
            reject(oauthResult);
          }
        }
      };
      const windowListener = event => {
        if (
          typeof event.data !== "object" ||
          event.data.type !== "oauthCallback"
        )
          return;

        getOAuthData(event.data.url);
      };

      window.addEventListener("message", windowListener);
      window.addEventListener("storage", storageListener);
      document.addEventListener("oauthCallback", event => {
        let url = event.detail;
        getOAuthData(url);
      });

      let loginWindowURL =
        this.loginURL +
        `/services/oauth2/authorize?client_id=${this.appId}&redirect_uri=${this.oauthCallbackURL}&response_type=token&state=${this.instanceId}`;
      window.open(loginWindowURL, "_blank", "location=no");
    });
  }
  callback(href) {
    var type = "oauthCallback";
    if (window.opener)
      window.opener.postMessage(
        {
          type: type,
          url: href
        },
        "*"
      );
    localStorage.setItem(type, href);
    window.close();
  }
}
