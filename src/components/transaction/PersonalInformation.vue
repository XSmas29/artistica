<template>
  <v-form
    ref="infoForm"
    v-model="isInfoValid"
    @submit.prevent
    fast-fail
  >
    <div class="text-center mb-3">
      <span class="text-body-2">
        - Data Diri -
      </span>
    </div>
    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          hide-details="auto"
          label="Nama Depan"
          v-model="infoFormData.first_name"
          :rules="[required]"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          hide-details="auto"
          label="Nama Belakang"
          v-model="infoFormData.last_name"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          label="No telepon"
          flat
          v-model="infoFormData.phone"
          type="number"
          hide-spin-buttons
          hide-details="auto"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          hide-details="auto"
          label="Email"
          v-model="infoFormData.email"
          :rules="[required, validEmail]"
        />
      </v-col>
    </v-row>
    <v-divider class="my-6" />
    <div class="text-center mb-3">
      <span class="text-body-2">
        - Alamat Pengiriman -
      </span>
    </div>
    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <v-autocomplete
          hide-details="auto"
          label="Provinsi"
          :loading="loadingProvinces"
          :items="provincesList"
          item-title="province"
          v-model="infoFormData.province"
          :rules="[required]"
          @update:model-value="loadCities"
          return-object
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-autocomplete
          hide-details="auto"
          label="Kota"
          :loading="loadingCities"
          :items="citiesList"
          item-title="city_name"
          v-model="infoFormData.city"
          :rules="[required]"
          :disabled="!infoFormData.province"
          return-object
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          hide-details="auto"
          label="Alamat"
          v-model="infoFormData.address"
          :rules="[required]"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          hide-details="auto"
          label="Kode Pos"
          type="number"
          hide-spin-buttons
          v-model="infoFormData.postal_code"
          :rules="[required]"
        />
      </v-col>
    </v-row>
  </v-form>
</template>
<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import { required, validEmail } from '@helpers/validations'
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
	setup(props, { emit }) {
		const { 
			provincesList, loadingProvinces, getProvinces,
			citiesList, loadingCities, getCities,
		} = useDelivery()

		const infoFormData = computed({
			get() {
				return props.modelValue
			},
			set(value) {
				emit('update:modelValue', value)
			}
		})

		onMounted(() => {
			getProvinces()
		})

		const loadCities = (province: any) => {
			infoFormData.value.city = null
			getCities(+province.province_id)
			validate()
		}

		const isInfoValid = ref(false)
		const infoForm = ref(null as any)

		const validate = () => {
			infoForm.value.validate() 
			
			return isInfoValid.value
		}
    
		return {
			infoFormData,
			isInfoValid,
			infoForm,
			required,
			validEmail,
			validate,

			provincesList,
			loadingProvinces,

			citiesList,
			loadingCities,
			loadCities,

		}
	}
}
</script>