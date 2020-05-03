import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.use(Vuex)

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
    theme: {
        dark: true
    }
}).$mount('#app')