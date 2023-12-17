<template>
  <v-main>
    <v-container
      fill-height
      :fluid="mdAndDown"
    >
      <v-overlay
        class="align-center justify-center"
      >
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        />
      </v-overlay>
      <router-view />
    </v-container>
  </v-main>
</template>
<script lang="ts">
import { useDisplay } from 'vuetify'

export default {
	setup() {
		const { mdAndDown } = useDisplay()
		
		return {
			mdAndDown,
		}
	}
}
</script>