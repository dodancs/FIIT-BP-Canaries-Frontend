<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-alert
                border="right"
                colored-border
                type="error"
                elevation="2"
                v-model="error"
              >{{errorMessage}}: {{errorDetails}}</v-alert>

              <v-form @submit.prevent="authLogin">
                <v-text-field
                  label="Username"
                  name="username"
                  prepend-icon="person"
                  type="text"
                  v-model="username"
                />

                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="lock"
                  type="password"
                  v-model="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="authLogin">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="loading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text class="pa-5">
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import { config } from "../config.js";
import axios from "axios";
import router from "../router";

export default {
  name: "LoginPage",
  components: {},
  data: () => ({
    username: "",
    password: "",
    loading: false,
    error: false,
    errorMessage: "",
    errorDetails: ""
  }),
  methods: {
    async authLogin() {
      this.loading = true;
      const credentials = {
        username: this.username,
        password: this.password
      };
      // this.$emit("auth-login", credentials);
      try {
        const response = await axios.post(config.baseURL + "auth/login", {
          username: credentials.username,
          password: credentials.password
        });
        // console.log(response);

        this.$store.dispatch("setUser", response.data);
        this.$emit("start-timer");

        router.push("/");
      } catch (error) {
        console.error(error);
        console.log(error.response);
        this.errorMessage = error.response.data.message;
        this.errorDetails = error.response.data.details;
        this.error = true;
        this.loading = false;
      }
    }
  }
};
</script>

