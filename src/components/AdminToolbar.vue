<template>
  <v-app-bar dark class="pa-0 main-toolbar primary">
    <v-row class="d-flex flex-row pa-0 fill-height">
      <v-col class="d-flex justify-start pa-0">
        <v-toolbar-items>
          <v-btn class="primary" depressed to="/">Canaries</v-btn>
          <v-btn class="primary" depressed to="/domains">Domains</v-btn>
          <v-btn class="primary" depressed to="/sites">Monitored sites</v-btn>
          <v-btn class="primary" depressed to="/mail">Mail</v-btn>
          <v-btn class="primary" depressed to="/users">Users</v-btn>
        </v-toolbar-items>
      </v-col>
      <v-col class="d-flex justify-space-around pa-0" align-self="center">
        <router-link
          :to="{ name: 'HomePage' }"
          tag="v-toolbar-title"
          class="headline clickable-title"
        >Canary Frontend</router-link>
      </v-col>
      <v-col class="d-flex justify-end pa-0">
        <v-toolbar-items>
          <v-btn class="primary" depressed to="/logout">Logout</v-btn>
        </v-toolbar-items>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
export default {
  name: "AdminToolbar"
};
</script>

<style>
.main-toolbar > div {
  padding: 0 28px;
}
</style>