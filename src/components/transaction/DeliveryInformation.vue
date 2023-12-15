<template>
  <v-form
    ref="deliveryForm"
    v-model="isDeliveryValid"
    @submit.prevent
    fast-fail
  />
</template>
<script lang="ts">
import { ref } from 'vue'
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
		const isDeliveryValid = ref(false)
		const deliveryForm = ref(null as any)
    
		return {
			isDeliveryValid,
			deliveryForm,
		}
	}
}
</script>