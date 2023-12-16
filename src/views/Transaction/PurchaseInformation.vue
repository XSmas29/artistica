<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-row>
      <v-col
        cols="12"
        md="8"
      >
        <v-stepper
          v-model="purchaseStep"
          border
          elevation="0"
          bg-color="primary"
          class="mb-6"
          :mobile="smAndDown"
          min-width="280"
        >
          <template #default="{ prev, next }">
            <v-stepper-header class="elevation-0">
              <template
                v-for="(item, index) in stepItems" 
                :key="index"
              >
                <v-stepper-item
                  :complete="purchaseStep > index + 1"
                  :value="index + 1"
                >
                  {{ item }}
                </v-stepper-item>
                <v-divider
                  v-if="index !== stepItems.length - 1"
                  :key="index"
                />
              </template>
            </v-stepper-header>
            <v-divider />
            <v-stepper-window>
              <v-stepper-window-item
                :value="1"
              >
                <personal-information
                  v-model="personalInfoData"
                  ref="personalInfo"
                />
                <v-stepper-actions
                  @click:prev="prev"
                  @click:next="completePersonalInfo"
                />
              </v-stepper-window-item>
              <v-stepper-window-item
                :value="2"
              >
                <delivery-information
                  v-model="deliveryInfoData"
                  :destination="personalInfoData.city"
                  ref="deliveryInfo"
                />
                <v-stepper-actions
                  @click:prev="prev"
                  @click:next="next"
                />
              </v-stepper-window-item>
              <v-stepper-window-item
                :value="3"
              >
                <v-stepper-actions
                  @click:prev="prev"
                  @click:next="next"
                />
              </v-stepper-window-item>
            </v-stepper-window>
          </template>
        </v-stepper>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card
          variant="tonal"
          rounded
          min-width="280"
        >
          <v-card-title>
            <h3
              class="text-h5 text-center my-2 font-weight-medium"
            >
              Ringkasan Belanja
            </h3>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="d-flex justify-space-between text-body-1">
              <div>
                Subtotal
              </div>
              <div>
                {{ formatCurrency(subtotal) }}
              </div>
            </div>
            <div class="d-flex justify-space-between text-body-1">
              <div>
                Ongkos Kirim
              </div>
              <div>
                {{ formatCurrency(deliveryCost) }}
              </div>
            </div>
          </v-card-text>
          <v-divider />
          <div class="d-flex justify-space-between text-body-1 font-weight-bold pa-4">
            <div>
              Total
            </div>
            <div>
              {{ formatCurrency(subtotal + deliveryCost) }}
            </div>
          </div>
          <div class="pa-2">
            <router-link
              :to="{ name: 'purchase-information' }"
              style="text-decoration: none; color: inherit;"
            >
              <v-btn
                block
                variant="tonal"
                size="large"
                :disabled="!canCheckout()"
              >
                Checkout
              </v-btn>
            </router-link>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </xyztransition>
</template>
<script lang="ts">
import useProduct from '@/composables/useProduct'
import { formatCurrency } from '@utils/filter'
import { useCartStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import PersonalInformation from '@components/transaction/PersonalInformation.vue'
import DeliveryInformation from '@components/transaction/DeliveryInformation.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
export default {
	components: {
		PersonalInformation,
		DeliveryInformation,
	},
	setup() {
		const {smAndDown} = useDisplay()
		const { cartItems, loadingCartItems, getCartData } = useProduct()
		const { cartData } = storeToRefs(useCartStore())
		const purchaseStep = ref(0)
		const stepItems = ['Informasi Pembeli', 'Pengiriman']
		const personalInfoData = ref({
			first_name: '',
			last_name: '',
			email: '',
			phone: '',
			address: '',
			city: '',
			province: '',
			postal_code: '',
		})
		const deliveryInfoData = ref({
			provider_code: '',
			service: null as any,
		})
		const personalInfo = ref(null as any)
		const deliveryInfo = ref(null as any)

		const subtotal = computed(() => {
			return cartItems.value.reduce((a, b) => a + (b.variant.price * b.quantity), 0)
		})

		const deliveryCost = computed(() => {
			if (!deliveryInfoData.value.service) return 0

			return deliveryInfoData.value.service.cost || 0
		})

		const completePersonalInfo = () => {
			if (personalInfo.value.validate()) {
				purchaseStep.value = 2
			}
		}

		const canCheckout = () => {
			if (!personalInfo.value || !deliveryInfo.value) return false
			
			return personalInfo.value.validate() && deliveryInfo.value.validate()
		}

		onMounted(() => {
			loadCartData()
		})
		
		const loadCartData = () => {
			getCartData(cartData.value)
		}

		return {
			formatCurrency,
			cartItems,
			loadingCartItems,
			purchaseStep,
			stepItems,
			personalInfo,
			deliveryInfo,
			completePersonalInfo,
			smAndDown,

			personalInfoData,
			deliveryInfoData,
			subtotal,
			deliveryCost,

			canCheckout,
		}
	}
}
</script>
