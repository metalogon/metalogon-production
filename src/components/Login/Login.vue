<template>

    <div class="login">

          <img class="logo" src="../../assets/logo.png" alt="Logo">

          <form class="login-form" v-show="formLoginIsShown" v-on:submit.prevent="loginUser()">
            <input class="login-form__username" type="text" placeholder="email" v-model="email">
            <input class="login-form__password" type="password" placeholder="password" v-model="password">
            <span class="login-form__error">We don't recognize these credentials.</span>
            <button type="submit">LOGIN</button>
            <p class="login-form__switchform">Not registered? <a class="login-form__switchform-link" @click="showRegisterForm">Create an account</a></p>
            <p class="login-form__switchform">Do you have an invitation code? <a class="login-form__switchform-link" @click="showInvitationForm()">Click here</a></p>
          </form>

          <form class="register-form login-form" v-show="formRegisterIsShown" v-on:submit.prevent="registerUser()">
            <input class="login-form__username" type="text" placeholder="First name" v-model="firstName"/>
            <input class="login-form__username" type="text" placeholder="Last name" v-model="lastName"/>
            <input class="login-form__username" type="text" placeholder="E-mail address" v-model="newEmail"/>
            <input class="login-form__password" type="password" placeholder="Password" v-model="newPassword"/>
            <input class="login-form__password" type="password" placeholder="Repeat Password" v-model="repeatedPassword"/>
            <button type="submit">CREATE ACCOUNT</button>
            <p class="login-form__switchform">Already registered? <a class="login-form__switchform-link" @click="showLoginForm()">Sign In</a></p>
            <p class="login-form__switchform">Do you have an invitation code? <a class="login-form__switchform-link" @click="showInvitationForm()">Click here</a></p>
          </form>

          <form class="invitation-form login-form" v-show="formInvitationIsShown" v-on:submit.prevent="invitationUser()">
            <input class="login-form__username" type="text" placeholder="First name" v-model="firstName"/>
            <input class="login-form__username" type="text" placeholder="Last name" v-model="lastName"/>
            <input class="login-form__password" type="password" placeholder="Password" v-model="newPassword"/>
            <input class="login-form__password" type="password" placeholder="Repeat Password" v-model="repeatedPassword"/>
            <input class="login-form__username" type="text" placeholder="Invitation code" v-model="invitationCode"/>
            <button type="submit">GET INVITE</button>
            <p class="login-form__switchform">Already registered? <a class="login-form__switchform-link" @click="showLoginForm()">Sign In</a></p>
          </form>

    </div>

</template>


<script>
  import { mapGetters } from 'vuex'
  import { mapMutations } from 'vuex'
  import bgImage from "../../assets/login-bg-low.jpg"

export default {
    data() {
        return {
          // Signup
          firstName: '',
          lastName: '',
          newEmail: '',
          newPassword: '',
          repeatedPassword: '',
          // Login
          email: '',
          password: '',
          // Invitation
          invitationCode: '',
          // Misc
          formLoginIsShown: true,
          formRegisterIsShown: false,
          formInvitationIsShown: false,
          authService : this.$root.$options.authService,
          secureHTTPService : this.$root.$options.secureHTTPService
        }
    },
    methods: {
        loginUser() {
          this.authService.login({ email: this.email, password: this.password })
            .then(() => {
              // console.log("Login.vue: login success")
              this.$router.push('/')
              this.$store.state.currentClass.name = 'Home'
            })
            .catch(() => {
              $('.login-form__error').css('display', 'block')
              this.$router.push('/login')
            })
        },
        registerUser() {
          if (this.firstName === "" || this.lastName === "" || this.newEmail === "" || this.newPassword === "" || this.repeatedPassword === "") {
            alert("Please complete all the fields.")
          }
          else if (this.newPassword != this.repeatedPassword) {
            alert("Please repeat password correctly.")
          }
          else {
            var capitalizedFirstName = this.firstName[0].toUpperCase() + this.firstName.slice(1).toLowerCase()
            var capitalizedLastName = this.lastName[0].toUpperCase() + this.lastName.slice(1).toLowerCase()
            var body =
            {
              "firstName" : capitalizedFirstName,
              "lastName" : capitalizedLastName,
              "email" : this.newEmail,
              "password" : this.newPassword,
              "role" : ""
            }
            this.secureHTTPService.post("user", body)
            // TODO add a .then here and continue to this.email = .. and this.showLogin
            // only if then is ran, else got to catch (or something) and show post error
            // TODO front show some "successful" screen
            this.email = this.newEmail
            this.showLoginForm()
          }
        },
        invitationUser() {
          if (this.firstName === "" || this.lastName === "" || this.newPassword === "" || this.repeatedPassword === "" || this.invitationCode === "") {
            alert("Please complete all the fields.")
          }
          else if (this.newPassword != this.repeatedPassword) {
            alert("Please repeat password correctly.")
          }
          else {
            var body =
            {
              "firstName" : this.firstName,
              "lastName" : this.lastName,
              "password" : this.newPassword
            }
            this.secureHTTPService.post("user?invitation=" + this.invitationCode, body)
            .then(function(){
              alert("Post invitation successful.")
            })
            .catch(function(err){
              console.log(err)
            })
            //TODO create appropriate feedback with .then and .catch
            this.showLoginForm()
          }
        },
        showRegisterForm() {
          this.formRegisterIsShown = true
          this.formLoginIsShown = false
          this.formInvitationIsShown = false
        },
        showLoginForm() {
          this.formLoginIsShown = true
          this.formRegisterIsShown = false
          this.formInvitationIsShown = false
        },
        showInvitationForm() {
          this.formInvitationIsShown = true
          this.formLoginIsShown = false
          this.formRegisterIsShown = false
        },
        openTab(evt, tabName) {
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " active";
        }
    },
    created() {
    },
    mounted() {
      document.body.style.backgroundImage = "url(" + bgImage + ")"
      document.body.style.backgroundSize = "70%"
      try {
        document.getElementsByClassName('el-loading-mask')[0].style.zIndex = "-1"
      }
      catch (err) {
        // console.log(err)
      }
    }
}
</script>

<style>

/* ==============================================
                #LOGIN
	================================================= */

.login {
  position: relative;
  top: 25%;
  margin: 0 auto;
  max-width: 360px;
  padding: 45px;
  text-align: center;
  background-color: #FFF;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24); 
}

.logo{
	max-width:150px;
	margin: 20px;
}

.login-form__username, .login-form__password {
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
}
.login button {
  text-transform: uppercase;
  outline: 0;
  background: #A90931;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #FFFFFF;
  font-size: 14px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
}
.login button:hover,.login button:active,.login button:focus {
  background: #8F082A;
}
.login .message {
  margin: 15px 0 0;
  color: #b3b3b3;
  font-size: 12px;
}
.login .message a {
  color: #A90931;
  text-decoration: none;
}

.login-form {

}
  .login-form__error {
    display: none;
    color: red;
    font-size: 0.8em;
    text-align: left;
    margin-top: -15px;
    margin-bottom: 10px;
  }

  .login-form__switchform {
    font-size: 0.7em;
  }

    .login-form__switchform-link {
      color: #363636;
    }
    .login-form__switchform-link:hover {
      text-decoration: underline;
    }

</style>