<template>
    <nav class="head navbar">
        <div class="container">

            <div class="navbar-brand">
                <!-- <router-link to="/" tag="span" class="navbar-item"> -->
                    <span class="navbar-item">
                        <img src="../../assets/logo-white.png" width="112" height="28">
                    </span>
                <!-- </router-link> -->
            </div>

            <div class="navbar-menu">
                <div class="navbar-start">
                                                                                                                    <!-- https://github.com/vuejs/vue-router/issues/800 -->
                    <router-link to="/" class="head__nav-item navbar-item" tag="a" active-class="head__nav-item-active" @click.native="setCurrentClass({name: 'Home'})" exact>Home</router-link>
                    <router-link to="/wiki" class="head__nav-item navbar-item" tag="a" active-class="head__nav-item-active" exact>Wiki</router-link>
                    <!-- <router-link to="/" class="head__nav-item navbar-item" v-show="currentClass.name !== 'Home' && currentRoute !== 'admin' && currentRoute !== 'student' && currentRoute !== 'professor'" tag="a" active-class="head__nav-item-active" exact>Back to {{ currentClass.name }} Class</router-link> -->
                </div>
                <div class="navbar-end">
                    <a class="head__nav-item navbar-item"><p><i class="fa fa-user-circle"></i> {{ usernameRole }}</p></a>
                    <!-- <i class="fa fa-angle-down"></i> -->
                    <a class="head__nav-item navbar-item" @click="logOut()"><p><i class="fa fa-sign-out"></i>Logout</p></a>
                </div>
            </div>
            
        </div>
    </nav>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { mapMutations } from 'vuex'
    import _ from 'lodash'

    export default {
        props: ['userProfile'],
        data() {
            return {
                usernameRole: '',
                authData: {},
                currentRoute: ''
            }
        },
        methods: {
            setCurrentClass(classObject) {
                // console.log('CURRENT_CLASS_SELECT')
                this.$store.commit('CURRENT_CLASS_SELECT', classObject)
            },
            logOut() {
                this.$router.push('/login')
                this.$root.$options.authService.logOff()
                // this.$store.commit('AUTHENTICATED', "logout") // Change store.authenticated to false (becomes true in login)
                // this.$store.commit('SET_USER_PROFILE', {})
            }
        },
        mounted() {
            this.authData = this.$root.$options.authService.getAuthData()
            this.usernameRole = this.authData.firstName + " " + this.authData.lastName[0].toUpperCase() + ". - " + this.authData.role[0].toUpperCase() + this.authData.role.slice(1)
            // this.currentRoute = this.$root.$options.router.currentRoute.name.toLowerCase()
            
            // setInterval(() => {
            //     const authService = this.$root.$options.authService
            //     console.log(authService.getAuthData())

            //     try {
            //         this.authData = authService.getAuthData().data
            //     } 
            //     catch(err) {
            //         return null
            //     }
            // }, 1000)

            document.addEventListener('DOMContentLoaded', function () {

                // Get all "navbar-burger" elements
                var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

                // Check if there are any navbar burgers
                if ($navbarBurgers.length > 0) {

                    // Add a click event on each of them
                    $navbarBurgers.forEach(function ($el) {
                        $el.addEventListener('click', function () {

                            // Get the target from the "data-target" attribute
                            var target = $el.dataset.target;
                            var $target = document.getElementById(target);
                            console.log($target)
                            console.log($el)

                            // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                            $el.classList.toggle('is-active');
                            $target.classList.toggle('is-active');

                        });
                    });
                }

            });
        },
        computed: {
            ...mapGetters([
                'uploadingVideo', 'currentClass'
            ])
        },
    }
</script>

<style>

.head {
    background-color: #A90931;
    display: flex;
}

    .head__nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        color: #FFF;
        margin-left: 60px;
        padding:0;
    }

        .head__nav-item {
            margin-left: 20px;
            padding: 10px 16px;
        }
        .head__nav-item {
            color: #FFFFFF !important;
        }
        .head__nav-item:hover {
            background-color: #8F082A !important;
            color: #FFF;
        }

        .head__nav-item-active {
            background-color: #8F082A;
            border-radius: 3px;
            padding: 10px 16px;
        }

        .navbar-end .head__nav-item i {
            margin-left: 5px;
        }

/* ==============================================
            #STUDENT-REQUESTS
================================================= */

    .badge {
		position:relative;
	}
	.badge[data-badge]:after {
		content:attr(data-badge);
		position:absolute;
		top:3px;
		right:-5px;
		font-size:.7em;
		background:green;
		color:white;
		width:18px;height:18px;
		text-align:center;
		line-height:18px;
		border-radius:50%;
		box-shadow:0 0 1px #333;
	}



.modal-student-requests .el-dialog__body{
    padding: 10px 20px 20px 20px;
}

</style>