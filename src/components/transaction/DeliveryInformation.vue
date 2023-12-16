<template>
  <v-form
    ref="deliveryForm"
    v-model="isDeliveryValid"
    @submit.prevent
    fast-fail
  >
    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <v-select
          :items="providersList"
          :loading="loadingProviders"
          item-title="name"
          item-value="code"
          label="Kurir"
        />
      </v-col>
    </v-row>
  </v-form>
</template>
<script lang="ts">
import { onMounted, ref } from 'vue'
import useDelivery from '@composables/useDelivery'

export default {
	props: {
		modelValue: {
			type: Object,
			default: () => {},
		},
		valid: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:modelValue'],
	setup() {
		const { 
			providersList, loadingProviders, getDeliveryProviders,
		} = useDelivery()
		const isDeliveryValid = ref(false)
		const deliveryForm = ref(null as any)

		onMounted(() => {
			getDeliveryProviders()
		})
    
		return {
			isDeliveryValid,
			deliveryForm,

			providersList,
			loadingProviders,
		}
	}
}
</script>