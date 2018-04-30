<template>
    <div class="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { mapMutations } from 'vuex'

    import Login from './components/Login/Login.vue'

    export default {
        data() {
            return {

            }
        },
        methods: {
            isLoggedIn () {
                try {
                    if (!!this.$root.$options.authService.getAuthData().token) {
                        return true
                    }
                    else { 
                        return false
                    }
                } 
                catch(err) {
                    return false
                }
            }
        },
        created() {
        },
        mounted() {
            // "Metalogon" label to Loading feature
            this.$loading({ fullscreen: true })
            $('.el-loading-mask .el-loading-spinner').append("<p style='font-size:24px;font-weight:500;margin-top:20px'>Metalogon</p>")
        },
        computed: {
            // ...mapGetters(
            //     ['authenticated']
            // )
        },
        components: {
            'login': Login
        }
    }
</script>

<style>
    [v-cloak] > * { 
        display:none; 
    }
    [v-cloak]::before { 
        content: " ";
        display: block;
        width: 16px;
        height: 16px;
        background-image: url('data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==');
    }

    body {
        font-family: 'Source Sans Pro', 'Proxima Nova Alt', 'Segoe UI', sans-serif;
        font-weight: 400;
        line-height: 24px;
        height: 100%;
    }

    .app {
      width: 100vw; 
      height: 100vh;
      padding: 0;
      margin: 0;
    }

        .head {

        }

        .content {
            margin: auto 120px;
        }

    .fx-dir-col {
        flex-direction: column !important;
    }

    .fx-dir-row {
        flex-direction: row !important;
    }


/* ==============================================
                #APP-SCROLLBAR
	================================================= */

    /* 
    ::-webkit-scrollbar {
	    width: 5px;
        height: 8px;
        background-color: #ddd;
    }

    ::-webkit-scrollbar-thumb {
        background: gray;
        border-radius: 5px;
    }
    */
/* ==============================================
                #LOADING SCREEN
	================================================= */
    
    .el-loading-mask {
      background-color: #F0F3F4 !important; /* e6ecedd1 */
    }

        .el-loading-spinner .path {
        stroke: gray !important;
        stroke-width: 4px !important;
        }

        p.el-loading-text {
            color: gray !important;
        }

        body {
        display: relative;
      }

    /* ==============================================
                #FEATURED
	================================================= */

	.featured {

	}

		.featured__container {
			display:flex;
			flex-wrap: wrap;
		}
			
		.featured__heading {
			background-color: #16324f;
			color: #FFF;
			padding: 9px;
			margin-bottom: 0.5em !important;
			border-radius: 7px;
		}


</style>
