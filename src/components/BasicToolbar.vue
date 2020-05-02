<template>
  <v-app-bar dark>
    <v-spacer />
    <router-link
      :to="{ name: 'HomePage' }"
      tag="v-toolbar-title"
      class="headline"
      >Canary Front-end</router-link
    >
    <v-spacer />
  </v-app-bar>
</template>

<script>
export default {
  name: "BasicToolbar",
};
</script>
