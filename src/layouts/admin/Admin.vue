<template>
  <v-app>
    <v-layout>
      <nav-bar />
      <app-bar />
      <admin-view />
      <admin-footer />
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import AppBar from './AppBar.vue'
import NavBar from './NavBar.vue'
import AdminView from './View.vue'
import AdminFooter from './Footer.vue'

export default {
	components: {
		AppBar,
		NavBar,
		AdminView,
		AdminFooter,
	},
	data() {
		return {
		}
	},
}
</script>
