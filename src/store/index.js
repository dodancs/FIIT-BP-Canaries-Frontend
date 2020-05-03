import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
        },
        refreshUser(state, payload) {
            state.user.token = payload.token;
            state.user.token_type = payload.token_type;
            state.user.expires = payload.expires;
        }
    },
    actions: {
        setUser({
            commit
        }, payload) {
            commit('setUser', payload);
        },
        unsetUser({ commit }) {
            commit('setUser', null);
        },
        refreshUser({
            commit
        }, payload) {
            commit('refreshUser', payload);
        }
    },
    getters: {
        getUserUUID(state) {
            if (state.user != null)
                return state.user.uuid;
            else
                return null;



        },
        getUserPerms(state) {
            if (state.user != null)
                return state.user.permissions;
            else
                return null;



        },
        getTokenHeader(state) {
            if (state.user != null)
                return {
                    'Authorization': state.user.token_type + ' ' + state.user.token
                }
            else
                return null;



        },
        getExpires(state) {
            if (state.user != null)
                return state.user.expires;
            else
                return null;



        }
    },
    modules: {}
})