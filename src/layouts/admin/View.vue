<template>
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
</template>
<script lang="ts">

export default {
	setup() {
	}
}
</script>