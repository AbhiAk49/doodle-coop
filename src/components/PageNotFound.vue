<template>
  <v-card>
    <v-system-bar></v-system-bar>
    <v-toolbar flat>
      <v-toolbar-title>Page Not Found</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-banner single-line>
      <p>
        The page you are looking for does not seem to exist. You may want to go
        <router-link :to="{ name: 'home' }">Home</router-link>
      </p>
    </v-banner>
    <v-card-text class="grey lighten-4">
      <v-sheet max-width="800" height="300" class="mx-auto"></v-sheet>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'PageNotFound',
};
</script>

<style scoped></style>
