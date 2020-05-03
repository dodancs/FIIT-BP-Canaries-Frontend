<template>
  <v-app-bar dark class="primary">
    <v-spacer />
    <router-link
      :to="{ name: 'HomePage' }"
      tag="v-toolbar-title"
      class="headline clickable-title"
    >Canary Frontend</router-link>
    <v-spacer />
  </v-app-bar>
</template>

<script>
export default {
  name: "BasicToolbar"
};
</script>
