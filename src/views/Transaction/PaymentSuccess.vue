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
        Pembayaran Berhasil
      </v-card-title>   
      <v-card-text class="mt-6 text-center">
        <v-icon
          size="160"
          color="success"
        >
          mdi-check-circle
        </v-icon>
        <div class="text-body-1 my-4">
          Anda telah berhasil melakukan pembayaran
        </div>
        <v-card-actions class="mb-0 pb-0">
          <v-btn
            @click="goTo('home')"
            variant="outlined"
            color="accent"
          >
            Kembali ke Beranda
          </v-btn>
          <v-btn
            @click="goTo('transactions')"
            variant="outlined"
            color="accent"
          >
            Lihat Riwayat Pembelian
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