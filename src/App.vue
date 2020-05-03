<template>
  <v-app>
    <v-content>
      <BasicToolbar v-if="isLogin" />
      <AdminToolbar v-else />
      <router-view v-on:start-timer="startTimer"></router-view>
    </v-content>
  </v-app>
</template>

<script>
import AdminToolbar from "./components/AdminToolbar.vue";
import BasicToolbar from "./components/BasicToolbar.vue";
import { config } from "./config.js";
import store from "./store";
import axios from "axios";
import router from "./router";

export default {
  name: "App",

  icons: {
    iconfont: "mdiSvg"
  },

  components: { BasicToolbar, AdminToolbar },

  data: () => ({
    timer: null
  }),

  computed: {
    isLogin() {
      // console.log(this.$route.path);
      return this.$route.path == "/login";
    }
  },

  methods: {
    async refreshToken() {
      try {
        const response = await axios.get(
          config.baseURL + "auth/refresh_token",
          {
            headers: store.getters.getTokenHeader
          }
        );

        store.dispatch("refreshUser", response.data);
      } catch (error) {
        console.error(error);
        console.log(error.response);
        if (this.timer != null) {
          clearInterval(this.timer);
          this.timer = null;
        }
        router.push("/login");
      }
    },
    startTimer() {
      if (this.timer != null) {
        clearInterval(this.timer);
        this.timer = null;
      }
      if (store.getters.getExpires != null) {
        console.log(
          "Token expires in " + store.getters.getExpires + " seconds"
        );
        this.timer = setInterval(
          function() {
            this.refreshToken();
          }.bind(this),
          (store.getters.getExpires - 5) * 1000
        );
      }
    }
  }
};
</script>

<style>
.clickable-title {
  cursor: pointer;
}
</style>
