import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "../views/HomePage.vue";
import DomainsPage from "../views/DomainsPage.vue";
import SitesPage from "../views/SitesPage.vue";
import LoginPage from "../views/LoginPage.vue";
import axios from "axios";
import store from "../store";

Vue.prototype.$http = axios;
Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "HomePage",
        component: HomePage,
    },
    {
        path: "/domains",
        name: "DomainsPage",
        component: DomainsPage,
    },
    {
        path: "/sites",
        name: "SitesPage",
        component: SitesPage,
    },
    {
        path: "/login",
        name: "LoginPage",
        component: LoginPage,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.path == "/logout") {
        store.dispatch("unsetUser");
        return next("/login");
    }

    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ["/login"];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = store.getters.getUserUUID;

    if (authRequired && !loggedIn) {
        return next("/login");
    }

    next();
});

export default router;