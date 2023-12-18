<template>
  <v-app-bar
    color="primary"
    density="comfortable"
    flat
  >
    <v-app-bar-title>{{ route.meta.pageTitle }}</v-app-bar-title>
  </v-app-bar>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'
export default {
	setup() {
		const route = useRoute()
		
		return {
			route,
		}
	},
}
</script>
