<template>
  <v-app
    style="background-image: url('https://source.unsplash.com/1280x720/?canary+bird');background-size: cover;background-position:center;"
  >
    <v-content>
      <router-view v-on:auth-login="authLogin"></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { BASE_URL } from "./config.js";

export default {
  name: "App",

  icons: {
    iconfont: "mdiSvg", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },

  components: {},

  data: () => ({}),

  methods: {
    async authLogin(credentials) {
      console.log("Hey " + credentials.username + "!");

      try {
        const response = await this.$http.post(BASE_URL + "auth/login");
        console.log(response);
      } catch (error) {
        console.error(error);
        console.log(error.response);
      }
    },
  },
};
</script>

<style>
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
  cursor: pointer;
}
</style>
