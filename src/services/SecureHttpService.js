import Vue from 'vue';
import axios from 'axios';
// import Config
import authService from './AuthService'
import {ourApp} from '../main'
// var apiURLLocal = "http://localhost:3000"
var URL = "https://metalogon-api.herokuapp.com/rest"
// var URL = "http://agtheodorides.dyndns.org:84/rest"
export default {
    getHeaders() {
        try {
            // console.log("httpservice, authdata: ", authService.getAuthData().token)
            return {token: authService.getAuthData().token}
        }
        catch (err) {
            // console.log("SecureHttpService: getHeaders: ", err)
            return {} 
        }
    },
    get(uri, qs, params) {
        return this.request("get", uri, qs, params)
    },
    put(uri, qs, params) {
        return this.request("put", uri, qs, params)
    },
    post(uri, qs, params) {
        return this.request("post", uri, qs, params)
    },
    delete(uri, qs, params) {
        return this.request("delete", uri, qs, params)
    },
    request(Method, uri, qs, Params) {
        const options = {
            Method: Method || "GET",
            uri: uri || "",
            qs: qs,
            Params: Params
        }
        // options.uri = uri | "";
        // console.log("Options:", options)
        // console.log("Method: ", Method)
        // console.log("URL+/+URI: ", URL + "/" + uri)
        // console.log("qs: ", qs)
        // console.log("params: ", Params)
        // console.log("headers: ", this.getHeaders())
        var self = this
        return new Promise(function (resolve, reject) {
            // axios[method](URL + "/" + uri, qs, params,self.getHeaders())
            axios({ method: options.Method, url: URL + "/" + options.uri, headers: self.getHeaders(), data: options.qs, params: options.Params })
                .then(function (response) {
                    // See https://en.wikipedia.org/wiki/List_of_HTTP_status_codes for more status codes
                    // console.log("Resolved.")
                    resolve(response)
                })
                .catch(function (err) {
                    if (err.response.status == "401") {
                        console.log("secureHTTPService: response status 401")
                        localStorage.clear()
                        ourApp.$router.push('/Login')
                        ourApp.$router.push('/ErrorPage')
                        reject()
                    }
                    else if (err.response.status == "404") {
                        console.log("secureHTTPService: response status 404")
                        // localStorage.clear()
                        // ourApp.$router.push('/Login')
                        // ourApp.$router.push('/ErrorPage')
                        reject()
                    }
                    // localStorage.clear()
                    // ourApp.$router.push('/Login')
                    reject(err)
                })
        });
    }
}