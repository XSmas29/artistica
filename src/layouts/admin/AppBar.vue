<template>
  <v-app-bar
    color="primary"
    density="comfortable"
    flat
  >
    <template
      #prepend
      v-if="smAndDown"
    >
      <v-app-bar-nav-icon @click="toggleNavbar" />
    </template>
    <v-app-bar-title>{{ route.meta.pageTitle }}</v-app-bar-title>
  </v-app-bar>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { inject, Ref } from 'vue'

export default {
	setup() {
		const { smAndDown } = useDisplay()
		const route = useRoute()
		const showNavBar = inject('showNavBar') as Ref<boolean>

		const toggleNavbar = () => {
			showNavBar.value = !showNavBar.value
		}
		
		return {
			route,
			smAndDown,
			toggleNavbar,
			showNavBar
		}
	},
}
</script>
