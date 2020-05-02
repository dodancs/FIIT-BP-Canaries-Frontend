<template>
  <v-content>
    <BasicToolbar />
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit="authLogin">
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
  </v-content>
</template>

<script>
import BasicToolbar from "../components/BasicToolbar.vue";

export default {
  name: "LoginPage",
  components: { BasicToolbar },
  data: () => ({
    username: "",
    password: "",
  }),
  methods: {
    authLogin() {
      const credentials = {
        username: this.username,
        password: this.password,
      };
      this.$emit("auth-login", credentials);
    },
  },
};
</script>
