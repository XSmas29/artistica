<template>
  <v-main>
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
  </v-main>
</template>

<script lang="ts" setup>
</script>
