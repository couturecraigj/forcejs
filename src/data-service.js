/**
 * forcejs - REST toolkit for Salesforce.com
 * forcejs/data-service - Salesforce APIs data service module
 * Author: Christophe Coenraets @ccoenraets
 * Version: 2.2.1
 */
"use strict";

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

let joinPaths = (path1, path2) => {
  if (path1.charAt(path1.length - 1) !== "/") path1 = path1 + "/";
  if (path2.charAt(0) === "/") path2 = path2.substr(1);
  return path1 + path2;
};

let toQueryString = (obj, encode = true) => {
  let parts = [],
    i;
  for (i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (encode) {
        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
      } else {
        parts.push(i + "=" + obj[i]);
      }
    }
  }
  return parts.join("&");
};

let parseUrl = url => {
  let match = url.match(
    /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([^?#]*)(\?[^#]*|)(#.*|)$/
  );
  return (
    match && {
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      path: match[5],
      params: parseQueryString(match[6]),
      hash: match[7]
    }
  );
};

// Keeps track of single instance when instance is created with singleton form of createInstance:
// createInstance(oauth, options) with no third parameter (name of the instance)
let singleton;

// Keeps track of named instances when app needs data from multiple Salesforce orgs. For example:
// let org1 = ForceService.createInstance(oauth, options, "org1");
// let org2 = ForceService.createInstance(oauth, options, "org2");
let namedInstances = {};

// Reference to the Salesforce Network plugin
let networkPlugin;

document.addEventListener(
  "deviceready",
  function() {
    try {
      networkPlugin = cordova.require("com.salesforce.plugin.network");
    } catch (e) {
      // fail silently
    }
  },
  false
);

module.exports = {
  createInstance: (oauth, options, name) => {
    let instance;
    if (window.cordova) {
      instance = new ForceServiceCordova(oauth, options);
    } else {
      instance = new ForceServiceWeb(oauth, options);
    }
    if (name) {
      namedInstances[name] = instance;
    } else {
      singleton = instance;
    }
    return instance;
  },

  getInstance: name => {
    return name ? namedInstances[name] : singleton;
  }
};

class ForceService {
  constructor(oauth = {}, options = {}) {
    this.appId = oauth.appId; // Used in refreshAccessToken()
    this.accessToken = oauth.accessToken;
    this.instanceURL = oauth.instanceURL;
    this.refreshToken = oauth.refreshToken;
    this.userId = oauth.userId;

    this.apiVersion = options.apiVersion || "v41.0";
    this.loginURL = options.loginURL || "https://login.salesforce.com";

    // Whether or not to use a CORS proxy. Defaults to false if app running in Cordova, in a VF page,
    // or using the Salesforce console. Can be overriden in init()
    if (options.useProxy == undefined) {
      this.useProxy =
        window.cordova || window.SfdcApp || window.sforce || window.LCC
          ? false
          : true;
    } else {
      this.useProxy = options.useProxy;
    }

    // Only required when using REST APIs in an app hosted on your own server to avoid cross domain policy issues
    // To override default, pass proxyURL in init(props)
    this.proxyURL = options.proxyURL || baseURL;
  }

  /**
   * Determines the request base URL.
   */
  getRequestBaseURL() {
    let url;

    if (this.useProxy) {
      url = this.proxyURL;
    } else if (this.instanceURL) {
      url = this.instanceURL;
    } else {
      url = serverURL;
    }

    // dev friendly API: Remove trailing "/" if any so url + path concat always works
    if (url.slice(-1) === "/") {
      url = url.slice(0, -1);
    }
    return url;
  }

  refreshAccessToken() {}

  getUserId() {
    return this.userId;
  }

  /**
   * Lets you make any Salesforce REST API request.
   * @param obj - Request configuration object. Can include:
   *  method:  HTTP method: GET, POST, etc. Optional - Default is "GET"
   *  path:    path in to the Salesforce endpoint - Required
   *  params:  queryString parameters as a map - Optional
   *  data:  JSON object to send in the request body - Optional
   */
  request(obj) {
    return new Promise((resolve, reject) => {
      if (!this.accessToken && !this.refreshToken) {
        if (typeof errorHandler === "function") {
          reject("No access token. Login and try again.");
        }
        return;
      }

      var method = obj.method || "GET",
        url = this.getRequestBaseURL();

      // dev friendly API: Add leading "/" if missing so url + path concat always works
      if (obj.path.charAt(0) !== "/") {
        obj.path = "/" + obj.path;
      }

      url = url + obj.path;

      if (obj.params) {
        url += "?" + toQueryString(obj.params);
      }

    //   if ("fetch" in window) {
      if (false) {
        const headers = {
          Accept: "application/json",
          Authorization: "Bearer " + this.accessToken,
          "Cache-Control": "no-store",
          "X-Connect-Bearer-Urls": true,
          "Content-Type": obj.contentType || "application/json"
        };
        if (obj.headerParams) {
          for (let headerName of Object.getOwnPropertyNames(obj.headerParams)) {
            let headerValue = obj.headerParams[headerName];
            if (headerName.toLowerCase() === "origin") {
            } else {
              headers[headerName] = headerValue;
            }
          }
        }
        if (this.useProxy) {
          headers["Target-URL"] = this.instanceURL;
        }
        fetch(url, {
          method,
          headers,
          body: JSON.stringify(obj.data)
        })
          .then(resolve)
          .catch(reject);
      } else {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status > 199 && xhr.status < 300) {
              if (xhr.responseType == "arraybuffer") {
                resolve(xhr.response);
              } else {
                try {
                  var json = xhr.responseText
                    ? JSON.parse(xhr.responseText)
                    : undefined;
                } catch (err) {
                  var json = xhr.responseText;
                }
                resolve(json);
              }
            } else if (xhr.status === 401 && this.refreshToken) {
              this.refreshAccessToken()
                // Try again with the new token
                .then(() =>
                  this.request(obj)
                    .then(data => resolve(data))
                    .catch(error => reject(error))
                )
                .catch(() => {
                  reject(xhr);
                });
            } else {
              reject(xhr);
            }
          }
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer " + this.accessToken);
        xhr.setRequestHeader("Cache-Control", "no-store");
        // See http://www.salesforce.com/us/developer/docs/chatterapi/Content/intro_requesting_bearer_token_url.htm#kanchor36
        xhr.setRequestHeader("X-Connect-Bearer-Urls", true);

        if (obj.responseType) {
          xhr.responseType = obj.responseType;
        }

        if (obj.contentType) {
          xhr.setRequestHeader("Content-Type", obj.contentType);
        }
        if (obj.headerParams) {
          for (let headerName of Object.getOwnPropertyNames(obj.headerParams)) {
            let headerValue = obj.headerParams[headerName];
            console.log(
              "additional header " + headerName + " set with " + headerValue
            );
            if (headerName.toLowerCase() === "origin") {
              xhr.withCredentials = true;
            } else {
              xhr.setRequestHeader(headerName, headerValue);
            }
          }
        }
        if (this.useProxy) {
          xhr.setRequestHeader("Target-URL", this.instanceURL);
        }
        xhr.send(obj.data ? JSON.stringify(obj.data) : undefined);
      }
    });
  }

  /**
   * Convenience function to execute a SOQL query
   * @param soql
   * @param batch
   */
  query(soql, batch = false) {
    let r = {
      path: "/services/data/" + this.apiVersion + "/query",
      params: { q: soql }
    };
    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Convenience function to execute a SOQL queryAll
   * @param soql
   * @param batch
   */
  queryAll(soql, batch = false) {
    let r = {
      path: "/services/data/" + this.apiVersion + "/queryAll",
      params: { q: soql }
    };
    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Convenience function to retrieve a single record based on its Id
   * @param objectName
   * @param id
   * @param fields
   * @param batch
   */
  retrieve(objectName, id, fields, batch = false) {
    let r = {
      path:
        "/services/data/" +
        this.apiVersion +
        "/sobjects/" +
        objectName +
        "/" +
        id,
      params: fields
        ? { fields: typeof fields === "string" ? fields : fields.join(",") }
        : undefined
    };
    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Convenience function to retrieve picklist values from a SalesForce Field
   * @param objectName
   * @param batch
   */
  getPickListValues(objectName, batch) {
    let r = {
      path:
        "/services/data/" +
        this.apiVersion +
        "/sobjects/" +
        objectName +
        "/describe"
    };
    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Convenience function to create a new record
   * @param objectName
   * @param data
   * @param batch
   */
  create(objectName, data, batch = false) {
    let r = {
      method: "POST",
      contentType: "application/json",
      path:
        "/services/data/" + this.apiVersion + "/sobjects/" + objectName + "/",
      data: data
    };
    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Convenience function to update a record. You can either pass the sobject returned by retrieve or query or a simple JavaScript object.
   * @param objectName
   * @param data The object to update. Must include the Id field.
   * @param method In some cases a PATCH is needed instead of a POST
   * @param batch
   */
  update(objectName, data, method = "POST", batch = false) {
    let id = data.Id || data.id,
      fields = JSON.parse(JSON.stringify(data));

    delete fields.attributes;
    delete fields.Id;
    delete fields.id;

    let r = {
      method: method,
      contentType: "application/json",
      path:
        "/services/data/" +
        this.apiVersion +
        "/sobjects/" +
        objectName +
        "/" +
        id,
      params: { _HttpMethod: "PATCH" },
      data: fields
    };

    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Convenience function to delete a record
   * @param objectName
   * @param id
   * @param batch
   */
  del(objectName, id, batch = false) {
    let r = {
      method: "DELETE",
      path:
        "/services/data/" +
        this.apiVersion +
        "/sobjects/" +
        objectName +
        "/" +
        id
    };

    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Convenience function to upsert a record
   * @param objectName
   * @param externalIdField
   * @param externalId
   * @param data
   * @param batch
   */
  upsert(objectName, externalIdField, externalId, data, batch = false) {
    let r = {
      method: "PATCH",
      contentType: "application/json",
      path:
        "/services/data/" +
        this.apiVersion +
        "/sobjects/" +
        objectName +
        "/" +
        externalIdField +
        "/" +
        externalId,
      data: data
    };

    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Convenience function to invoke APEX REST endpoints
   * @param pathOrParams
   */
  apexrest(pathOrParams) {
    let obj;

    if (typeof pathOrParams === "string") {
      obj = { path: pathOrParams, method: "GET" };
    } else {
      obj = pathOrParams;

      if (obj.path.charAt(0) !== "/") {
        obj.path = "/" + obj.path;
      }

      if (obj.path.substr(0, 18) !== "/services/apexrest") {
        obj.path = "/services/apexrest" + obj.path;
      }
    }

    if (!obj.contentType) {
      obj.contentType =
        obj.method == "DELETE" || obj.method == "GET"
          ? null
          : "application/json";
    }

    return this.request(obj);
  }

  /**
   * Convenience function to invoke the Chatter API
   * @param pathOrParams
   * @param batch
   */
  chatter(pathOrParams, batch = false) {
    let basePath = "/services/data/" + this.apiVersion + "/chatter";
    let params;

    if (pathOrParams && pathOrParams.substring) {
      params = { path: joinPaths(basePath, pathOrParams) };
    } else if (pathOrParams && pathOrParams.path) {
      params = pathOrParams;
      params.path = joinPaths(basePath, pathOrParams.path);
    } else {
      return new Promise((resolve, reject) =>
        reject("You must specify a path for the request")
      );
    }

    let r = params;

    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Lists summary information about each Salesforce.com version currently
   * available, including the version, label, and a link to each version's
   * root.
   */
  versions() {
    return this.request({
      path: "/services/data/"
    });
  }

  /**
   * Lists available resources for the client's API version, including
   * resource name and URI.
   * @param batch
   */
  resources(batch = false) {
    let r = {
      path: "/services/data/" + this.apiVersion
    };
    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Lists the available objects and their metadata for your organization's
   * data.
   * @param batch
   */
  describeGlobal(batch = false) {
    let r = {
      path: "/services/data/" + this.apiVersion + "/sobjects"
    };

    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Describes the individual metadata for the specified object.
   * @param objectName object name; e.g. "Account"
   * @param batch
   */
  metadata(objectName, batch = false) {
    let r = {
      path: "/services/data/" + this.apiVersion + "/sobjects/" + objectName
    };

    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Completely describes the individual metadata at all levels for the
   * specified object.
   * @param objectName object name; e.g. "Account"
   * @param batch
   */
  describe(objectName, batch = false) {
    let r = {
      path:
        "/services/data/" +
        this.apiVersion +
        "/sobjects/" +
        objectName +
        "/describe"
    };

    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Fetches the layout configuration for a particular sobject name and record type id.
   * @param batch
   */
  describeLayout(objectName, recordTypeId, batch = false) {
    recordTypeId = recordTypeId || "";
    let r = {
      path:
        "/services/data/" +
        this.apiVersion +
        "/sobjects/" +
        objectName +
        "/describe/layouts/" +
        recordTypeId
    };

    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * list all created reports
   * @param id return a specific report
   * @param batch
   * @returns {*}
   */
  reports(id = "", batch = false) {
    if (id !== "") {
      id = "/" + id;
    }
    let r = {
      path: "/services/data/" + this.apiVersion + "/analytics/reports" + id
    };

    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Lists all created dashboard
   * @param id return a specific dashboard
   * @param batch
   * @returns {*}
   */
  dashboard(id = "", batch = false) {
    if (id !== "") {
      id = "/" + id;
    }
    let r = {
      path: "/services/data/" + this.apiVersion + "/analytics/dashboards" + id
    };

    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Queries the next set of records based on pagination.
   * This should be used if performing a query that retrieves more than can be returned
   * in accordance with http://www.salesforce.com/us/developer/docs/api_rest/Content/dome_query.htm
   *
   * @param url - the url retrieved from nextRecordsUrl or prevRecordsUrl
   * @param batch
   */
  queryMore(url, batch = false) {
    let obj = parseUrl(url);
    let r = {
      path: obj.path,
      params: obj.params
    };

    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * Executes the specified SOSL search.
   * @param sosl a string containing the search to execute - e.g. "FIND
   *             {needle}"
   * @param batch
   */
  search(sosl, batch = false) {
    let r = {
      path: "/services/data/" + this.apiVersion + "/search",
      params: { q: sosl }
    };
    if (batch) return this.batchTransaction(r);
    return this.request(r);
  }

  /**
   * return request object
   * @param r
   * @return {Promise}
   */
  batchTransaction(r) {
    if (!r["method"]) {
      r["method"] = "GET";
    }

    // dev friendly API: Add leading "/" if missing so url + path concat always works
    if (r.path.charAt(0) !== "/") {
      r.path = "/" + r.path;
    }
    if (r.params) {
      r.url = r.path + "?" + toQueryString(r.params, false);
    } else {
      r.url = r.path;
    }

    // a composite call need “body” instead of “data”
    if (r.hasOwnProperty("data")) {
      r.body = r.data;
      delete r.data;
    }
    delete r.params;
    delete r.path;

    return new Promise((resolve, reject) => resolve(r));
  }

  /**
   * execute batch rest calls
   * @param requests
   * @return {*}
   */
  batch(requests) {
    // remove not used attributes
    for (let i = 0; i < requests.length; i++) {
      delete requests[i]["contentType"];
      if (requests[i].hasOwnProperty("body")) {
        requests[i]["richInput"] = requests[i]["body"];
        delete requests[i]["body"];
      }
    }

    return this.request({
      method: "POST",
      contentType: "application/json",
      path: "/services/data/" + this.apiVersion + "/composite/batch",
      data: {
        batchRequests: requests
      }
    });
  }

  /**
   * execute composite call
   * @param requests
   * @param treeObject execute composite tree call, treeObject have to be the object name
   * @returns {*}
   */
  composite(requests, treeObject = "") {
    // remove not used attributes
    for (let i = 0; i < requests.length; i++) {
      delete requests[i]["contentType"];
    }

    if (treeObject) {
      return this.request({
        method: "POST",
        contentType: "application/json",
        path:
          "/services/data/" +
          this.apiVersion +
          "/composite/tree/" +
          treeObject +
          "/",
        data: {
          records: requests
        }
      });
    } else {
      return this.request({
        method: "POST",
        contentType: "application/json",
        path: "/services/data/" + this.apiVersion + "/composite",
        data: {
          compositeRequest: requests
        }
      });
    }
  }
}

class ForceServiceWeb extends ForceService {
  refreshAccessToken() {
    return new Promise((resolve, reject) => {
      if (!this.refreshToken) {
        console.log("Missing refreshToken");
        reject("Missing refreshToken");
        return;
      }

      if (!this.appId) {
        console.log("Missing appId");
        reject("Missing appId");
        return;
      }

      let xhr = new XMLHttpRequest(),
        params = {
          grant_type: "refresh_token",
          refresh_token: this.refreshToken,
          client_id: this.appId
        },
        url = this.useProxy ? this.proxyURL : this.loginURL;

      url = url + "/services/oauth2/token?" + toQueryString(params);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log("Token refreshed");
            let res = JSON.parse(xhr.responseText);
            this.accessToken = res.access_token;
            resolve();
          } else {
            console.log(
              "Error while trying to refresh token: " + xhr.responseText
            );
            reject();
          }
        }
      };

      xhr.open("POST", url, true);
      if (!this.useProxy) {
        xhr.setRequestHeader("Target-URL", this.loginURL);
      }
      xhr.send();
    });
  }
}

class ForceServiceCordova extends ForceService {
  refreshAccessToken() {
    return new Promise((resolve, reject) => {
      document.addEventListener(
        "deviceready",
        () => {
          let oauthPlugin;
          try {
            oauthPlugin = cordova.require("com.salesforce.plugin.oauth");
          } catch (e) {
            // fail silently
          }
          if (!oauthPlugin) {
            console.error("Salesforce Mobile SDK OAuth plugin not available");
            reject("Salesforce Mobile SDK OAuth plugin not available");
            return;
          }
          oauthPlugin.authenticate(
            response => {
              this.accessToken = response.accessToken;
              resolve();
            },
            function() {
              console.error(
                "Error refreshing oauth access token using the oauth plugin"
              );
              reject();
            }
          );
        },
        false
      );
    });
  }

  /**
   * @param path: full path or path relative to end point - required
   * @param endPoint: undefined or endpoint - optional
   * @return object with {endPoint:XX, path:relativePathToXX}
   *
   * For instance for undefined, "/services/data"     => {endPoint:"/services/data", path:"/"}
   *                  undefined, "/services/apex/abc" => {endPoint:"/services/apex", path:"/abc"}
   *                  "/services/data, "/versions"    => {endPoint:"/services/data", path:"/versions"}
   */
  computeEndPointIfMissing(endPoint, path) {
    if (endPoint !== undefined) {
      return { endPoint: endPoint, path: path };
    } else {
      let parts = path.split("/").filter(function(s) {
        return s !== "";
      });
      if (parts.length >= 2) {
        return {
          endPoint: "/" + parts.slice(0, 2).join("/"),
          path: "/" + parts.slice(2).join("/")
        };
      } else {
        return { endPoint: "", path: path };
      }
    }
  }

  request(obj) {
    if (networkPlugin) {
      // ignore the SF Cordova plugin and execute a xhr call
      if (obj.hasOwnProperty("direct") && obj.direct) {
        obj.responseType = "arraybuffer";
        return super.request(obj);
      } else {
        return new Promise((resolve, reject) => {
          let obj2 = this.computeEndPointIfMissing(obj.endPoint, obj.path);
          if (obj.params === undefined) {
            obj.params = {};
          }
          if ("q" in obj.params) {
            obj.params.q = obj.params.q.replace(/[\n]/g, " ");
          }
          networkPlugin.sendRequest(
            obj2.endPoint,
            obj2.path,
            resolve,
            reject,
            obj.method,
            obj.data || obj.params,
            obj.headerParams
          );
        });
      }
    } else {
      return super.request(obj);
    }
  }
}
