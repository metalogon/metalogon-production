<template>
    <div class="error-page">
        <h1> Something went wrong. </h1>
        <button type="button" @click="routeToLogin()">Go back to login</button>
    </div>
</template>

<script>
    export default {
        name: 'ErrorPage',
        methods: {
            routeToLogin() {
                this.$router.push('/Login')
            }
        },
        mounted() {
            this.$router.push('/Login')
        }
    }
</script>

<style>

</style>
