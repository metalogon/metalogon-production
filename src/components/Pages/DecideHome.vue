<template>
    <div class="decide-home" v-bind="decideHome()">
    </div>
</template>

<script>
    export default {
        name: 'DecideHome',
        methods: {
            decideHome() {
                try {
                    const role = this.$root.$options.authService.getAuthData().role
                    // console.log("DecideHome redirecting user to " + role + " home page...")
                    this.$router.push('/' + role)
                }
                catch (err) {
                    console.log("DecideHome redirect failed: no role")
                }
            }
        }
    }
</script>

<style>

</style>
