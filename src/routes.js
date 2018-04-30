import Vue from 'vue';
import VueRouter from 'vue-router';
import { store } from './store/store'

import authService from './services/AuthService'
import Login from './components/Login/Login.vue'
import DecideHome from './components/Pages/DecideHome.vue'
import ErrorPage from './components/Pages/ErrorPage.vue'
// import Admin from './components/Admin/Admin.vue'
// import Professor from './components/Admin/Professor.vue'
// import Student from './components/Admin/Student.vue'
import Home from './components/Admin/Home.vue'
import Video from './components/Pages/Video.vue'
import Wiki from './components/Pages/Wiki.vue'
import WikiTerm from './components/Pages/WikiTerm.vue'

const requiresAuth = (to, from, next) => {
    authService.isAuthenticated()
        .then(() => {
            // console.log("Router: authenticated, redirecting to \"next\"")
            next()
        })
        .catch(() => {
            // console.log("Router: not authenticated, redirecting to Login")
            next('/login')
        })
}

export const routes = [
    { 
        path: '/', 
        component: DecideHome,
        beforeEnter: requiresAuth
    },
    { 
        path: '/DecideHome', 
        component: DecideHome,
        beforeEnter: requiresAuth
    },
    { 
        path: '/ErrorPage', 
        component: ErrorPage,
    },
    { 
        name: 'Login', 
        path: '/login', 
        component: Login
        // TODO: Needs to be redirected to home if user already logged in and puts /login in URL
    },
    { 
        name: 'Admin', 
        path: '/administrator', 
        component: Home, 
        beforeEnter: requiresAuth
    },
    { 
        name: 'Professor', 
        path: '/professor', 
        component: Home, 
        beforeEnter: requiresAuth 
    },
    { 
        name: 'Student', 
        path: '/student', 
        component: Home, 
        beforeEnter: requiresAuth 
    },
    { 
        name: 'Video', 
        path: '/video/:id', 
        component: Video, 
        beforeEnter: requiresAuth
    },
    { 
        name: 'Wiki', 
        path: '/wiki', 
        component: Wiki, 
        beforeEnter: requiresAuth
    },
    { 
        name: 'WikiTerm', 
        path: '/wiki-term', 
        component: WikiTerm, 
        beforeEnter: requiresAuth
    }
]