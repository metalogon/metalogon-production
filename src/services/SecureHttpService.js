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
    get(uri, data) {
        return this.request("get", uri, data)
    },
    put(uri, data) {
        return this.request("put", uri, data)
    },
    post(uri, data) {
        return this.request("post", uri, data)
    },
    delete(uri, data) {
        return this.request("delete", uri, data)
    },
    request(method, uri, data) {
        const options = {
            method: method || "GET",
            uri: uri || "",
            data: data || {}
        }
        var self = this
        return new Promise(function (resolve, reject) {
            axios({ method: options.method, url: URL + "/" + options.uri, headers: self.getHeaders(), data: options.data})
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