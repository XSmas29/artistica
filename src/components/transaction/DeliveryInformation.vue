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
          v-model="deliveryFormData.provider_code"
          :items="providersList"
          :loading="loadingProviders"
          item-title="name"
          item-value="code"
          label="Kurir"
          hide-details="auto"
          @update:model-value="loadServices"
          :rules="[required]"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-select
          :items="servicesList"
          :loading="loadingServices"
          item-title="service"
          item-value="code"
          hide-details="auto"
          :item-props="true"
          label="Layanan"
          :disabled="!deliveryFormData.provider_code"
          v-model="deliveryFormData.service"
          :rules="[required]"
          return-object
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props">
              <template #title>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>{{ item.raw.service }}</span>
                  <span>{{ formatCurrency(item.raw.cost) }}</span>
                </v-list-item-title>
              </template>
              <template #subtitle>
                <v-list-item-subtitle class="d-flex flex-column">
                  <span>{{ item.raw.description }}</span>
                  <span class="mt-1">{{ formatETD(item.raw.etd) }}</span>
                </v-list-item-subtitle>
              </template>
            </v-list-item>
          </template>
          <template #selection="{ item }">
            <v-list-item-title>
              <span v-if="item.value">{{ `${item.raw.service} (${formatCurrency(item.raw.cost)})` }}</span>
            </v-list-item-title>
          </template>
        </v-select>
      </v-col>
    </v-row>
  </v-form>
</template>
<script lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { formatCurrency, formatETD } from '@utils/filter'
import { required } from '@helpers/validations'
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
		totalWeight: {
			type: String,
			default: '1000',
		},
		origin: {
			type: String,
			default: '444',
		},
		destination: {
			type: String,
			required: true,
		},
	},
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		const { 
			providersList, loadingProviders, getDeliveryProviders,
			servicesList, loadingServices, getDeliveryServices,
		} = useDelivery()
		const isDeliveryValid = ref(false)
		const deliveryForm = ref(null as any)

		// const deliveryFormData = ref({
		// 	provider_code: '',
      
		// })

		const deliveryFormData = computed({
			get() {
				return props.modelValue
			},
			set(value) {
				emit('update:modelValue', value)
			}
		})

		watch(() => props.destination, () => {
			deliveryForm.value.reset()
		})

		onMounted(() => {
			getDeliveryProviders()
		})

		const loadServices = () => {
			deliveryFormData.value.service = null
			if (deliveryFormData.value.provider_code) {
				getDeliveryServices({
					origin: props.origin,
					destination: props.destination,
					weight: props.totalWeight,
					courier: deliveryFormData.value.provider_code,
				})
			}
		}

		const validate = () => {
			deliveryForm.value.validate()
			
			return isDeliveryValid.value
		}
    
		return {
			isDeliveryValid,
			deliveryForm,

			providersList,
			loadingProviders,

			servicesList,
			loadingServices,
			loadServices,

			deliveryFormData,
      
			formatCurrency,
			formatETD,
			required,
			validate,
		}
	}
}
</script>