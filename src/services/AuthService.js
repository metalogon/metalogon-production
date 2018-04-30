import Vue from 'vue';
import secureHTTPService from './SecureHttpService'

class AuthService {
    constructor() {
        // console.log("authService constructor called")
        var localStorageAuthData = JSON.parse(window.localStorage.getItem('authData'))
        if (!!localStorageAuthData) {
            // Initialize authData with data from local storage
            // console.log(window.localStorage.getItem('authData'))
            this.authData = JSON.parse(window.localStorage.getItem('authData'))
            // console.log("Autologin.", this.authData)
        }
        else {
            // If local storage does not have authData, initialize to null
            this.authData = null
            // console.log("No autologin.")
        }
    }

    login(value, cb) {
        this.authData = {
            'token': "",
            'userId': "",
            'role': "",
            'firstName': "",
            'lastName': "",
            'email': ""
        }
        // console.log("authService: first time login")
        return this.postLogin(value)
        .then(() => this.getUserDetails())
    }

    postLogin(value) {
        var self = this
        
        return new Promise(function(resolve, reject) {
            try {
                // Post login to get token, userId, role
                secureHTTPService.post("login", value)
                .then((loginResponse) => {
                    // Save loginResponse to authData so we are authorized to get user details
                    self.authData.token = loginResponse.data.data.token
                    self.authData.userId = loginResponse.data.data.id
                    self.authData.role = loginResponse.data.data.role
                    resolve() 
                }) // post then
                .catch((err) => {
                    console.log("authService: login failed: ", err)
                    reject(err)
                })
            } catch (err) {console.log(err)}
        })
    }
    
    getUserDetails() {
        var self = this
        return new Promise(function(resolve, reject) {
            try {
                secureHTTPService.get("user/" + self.authData.userId)
                .then((userDetailsResponse) => {
                    // Save userData in authData for this session
                    self.authData.firstName = userDetailsResponse.data.data.firstName
                    self.authData.lastName = userDetailsResponse.data.data.lastName
                    self.authData.email = userDetailsResponse.data.data.email

                    // Save userData in localStorage so the user is "remembered"
                    localStorage.setItem('authData', JSON.stringify(self.authData))
                    
                    // Login complete, resolve
                    resolve()
                }) // get then
                .catch((err) => {
                    console.log("get user details failed: ", err)
                    reject(err)
                })
            } catch (err) {console.log(err)}
        })
        
    }

    logOff() {
        this.authData = null
        window.localStorage.removeItem('authData')
    }

    isAuthenticated() {
        var self = this
        return new Promise(function (resolve, reject) {
            if (self.authData) {
                resolve()
            }
            else {
                reject()
            }
        })
    }

    getAuthData() {
        return this.authData
    }

    // setAuthData(value) {
    //     this.authData = value
    // }
}

var authService = new AuthService()
export default authService