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
                  :destination="personalInfoData.city.city_id"
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
          <div
            class="px-2 mt-6 mb-2"
            v-if="canCheckout()"
          >
            <!-- <v-btn
                block
                variant="tonal"
                size="large"
                :disabled="!canCheckout()"
              >
                Checkout
              </v-btn> -->
            <v-btn
              block
              size="large"
              variant="tonal"
              @click="addTransactionMT"
              :disabled="loadingCreateTransaction"
              :loading="loadingCreateTransaction"
            >
              Pay with MidTrans
            </v-btn>
            <!-- <div class="d-flex my-1 align-center">
              <v-divider />
              <p class="mx-4">
                or
              </p>
              <v-divider />
            </div>
            <paypal-button /> -->
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
import { useAuthStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import PersonalInformation from '@components/transaction/PersonalInformation.vue'
import DeliveryInformation from '@components/transaction/DeliveryInformation.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import PaypalButton from '@components/PaypalButton.vue'
import useMidtrans from '@/composables/useMidtrans'

export default {
	components: {
		PersonalInformation,
		DeliveryInformation,
		PaypalButton,
	},
	setup() {
		const { loadingCreateTransaction, createTransaction } = useMidtrans()
		const {smAndDown} = useDisplay()
		const { cartItems, loadingCartItems, getCartData } = useProduct()
		const { cartData } = storeToRefs(useCartStore())
		const { userData } = storeToRefs(useAuthStore())
		const purchaseStep = ref(0)
		const stepItems = ['Informasi Pembeli', 'Pengiriman']
		const personalInfoData = ref({
			first_name: '',
			last_name: '',
			email: '',
			phone: '',
			address: '',
			city: null as any,
			province: null as any,
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

		const addTransactionMT = () => {
			const transaction_details = {
				order_id: `ORDER-${userData!.value!.id}-${Date.now()}`,
				gross_amount: subtotal.value + deliveryCost.value,
			}
			const item_details = cartItems.value.map(item => {
				return {
					id: item.variant.id.toString(),
					price: item.variant.price,
					quantity: item.quantity,
					name: item.variant.product.name,
				}
			})
			console.log(deliveryInfoData.value)
			item_details.push({
				id: 'delivery',
				price: deliveryCost.value,
				quantity: 1,
				name: `${deliveryInfoData.value.provider_code} | ${deliveryInfoData.value.service.service}`,
			})
			const customer_details = {
				first_name: personalInfoData.value.first_name,
				last_name: personalInfoData.value.last_name,
				email: personalInfoData.value.email,
				phone: personalInfoData.value.phone,
				billing_address: {
					first_name: personalInfoData.value.first_name,
					last_name: personalInfoData.value.last_name,
					email: personalInfoData.value.email,
					phone: personalInfoData.value.phone,
					address: personalInfoData.value.address,
					city: personalInfoData.value.city.city_name,
					postal_code: personalInfoData.value.postal_code,
					country_code: 'IDN',
				},
				shipping_address: {
					first_name: personalInfoData.value.first_name,
					last_name: personalInfoData.value.last_name,
					email: personalInfoData.value.email,
					phone: personalInfoData.value.phone,
					address: personalInfoData.value.address,
					city: personalInfoData.value.city.city_name,
					postal_code: personalInfoData.value.postal_code,
					country_code: 'IDN',
				},
			}

			console.log(transaction_details, item_details, customer_details)
			createTransaction(transaction_details, item_details, customer_details)
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
			addTransactionMT,
			loadingCreateTransaction,
		}
	}
}
</script>
