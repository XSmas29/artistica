<template>
  <v-app>
    <nav-bar />
    <app-bar />
    <v-main>
      <v-container
        fill-height
        fluid
      >
        <admin-view />
        <admin-footer />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import AppBar from './AppBar.vue'
import NavBar from './NavBar.vue'
import AdminView from './View.vue'
import AdminFooter from './Footer.vue'
import { useDisplay } from 'vuetify'

export default {
	components: {
		AppBar,
		NavBar,
		AdminView,
		AdminFooter,
	},
	setup() {
		const { mdAndDown } = useDisplay()
		
		return {
			mdAndDown,
		}
	}
}
</script>
