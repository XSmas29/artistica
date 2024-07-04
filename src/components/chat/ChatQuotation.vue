<template>
  <v-card
    color="primary"
    variant="flat"
    min-width="280"
  >
    <v-card-title>Produk: {{ message.chat.custom_transaction.product_name }}</v-card-title>
    <v-divider />
    <v-card-text>
      <div class="d-flex">
        <v-img
          :src="message.chat.custom_transaction.images[0].path"
          max-width="160"
          class="mx-auto"
        />
        <div class="ms-4">
          <div>
            <div class="font-weight-light">
              Harga Per Unit
            </div>
            <div>
              {{ formatCurrency(message.quotation_price) }}
            </div>
          </div>
          <div>
            <div class="mt-2 font-weight-light">
              Jumlah
            </div>
            <div>{{ message.chat.custom_transaction.amount }} Unit</div>
          </div>
          <div>
            <div class="mt-2 font-weight-light">
              Total
            </div>
            <div class="text-grey">
              ({{ formatCurrency(message.quotation_price) }} X {{ message.chat.custom_transaction.amount }})
            </div>
            <div class="font-weight-bold">
              {{ formatCurrency(message.quotation_price * message.chat.custom_transaction.amount) }}
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
    <div>
      <v-btn
        block
        variant="tonal"
        prepend-icon="mdi-open-in-new"
        size="large"
      >
        Beli
      </v-btn>
    </div>
  </v-card>
</template>
<script lang="ts">
import { formatCurrency } from '@/helpers/utils'

export default {
	props: {
		message: {
			type: Object,
			required: true,
		},
	},
	setup() {
		return {
			formatCurrency
		}
	}
}
</script>