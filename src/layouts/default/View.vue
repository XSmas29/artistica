<template>
  <v-main>
    <v-container
      fill-height
      :fluid="mdAndDown"
    >
      <v-breadcrumbs
        :items="breadcrumbs"
        v-if="breadcrumbs.length > 1"
      >
        <template #divider>
          <v-icon icon="mdi-chevron-right" />
        </template>
      </v-breadcrumbs>
        
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'

export default {
	setup() {
		const route = useRoute()
		const breadcrumbs: any = computed(() => route.meta.breadcrumbs)
		const { mdAndDown, name } = useDisplay()
		
		return {
			breadcrumbs,
			mdAndDown,
			name
		}
	}
}
</script>
