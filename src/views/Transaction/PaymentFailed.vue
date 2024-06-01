<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-card
      max-width="480"
      class="rounded-lg pa-2 mx-auto my-6"
      variant="tonal"
    >
      <v-card-title class="text-center">
        Pembayaran Gagal
      </v-card-title>   
      <v-card-text class="mt-6 text-center">
        <v-icon
          size="160"
          color="error"
        >
          mdi-close-circle
        </v-icon>
        <div class="text-body-1 my-4">
          Anda gagal melakukan pembayaran
        </div>
        <v-card-actions class="d-flex flex-column mb-0 pb-0">
          <v-btn
            @click="goTo('home')"
            variant="outlined"
            color="accent"
          >
            Kembali ke Beranda
          </v-btn>
        </v-card-actions>
      </v-card-text>   
    </v-card>
  </XyzTransition>
</template>
<script lang="ts">
import { goTo } from '@helpers/utils'

export default {
	setup() {
		return {
			goTo
		}
	}
}
</script>