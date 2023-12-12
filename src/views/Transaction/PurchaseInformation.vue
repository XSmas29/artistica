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
        >
          <template #default="{ prev, next }">
            <v-stepper-header class="elevation-0">
              <template
                v-for="(item, index) in stepItems" 
                :key="index"
              >
                <v-stepper-item
                  :complete="purchaseStep > index"
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
                <personal-information v-model="personalInfoData" />
                <v-stepper-actions
                  @click:prev="prev"
                  @click:next="next"
                />
              </v-stepper-window-item>
              <v-stepper-window-item
                :value="2"
              >
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
          min-width="300"
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
                {{ formatCurrency(cartItems.reduce((a, b) => a + (b.variant.price * b.quantity), 0)) }}
              </div>
            </div>
          </v-card-text>
          <v-divider />
          <div class="pa-2">
            <router-link
              :to="{ name: 'purchase-information' }"
              style="text-decoration: none; color: inherit;"
            >
              <v-btn
                block
                variant="tonal"
                size="large"
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
import { onMounted, ref } from 'vue'
import PersonalInformation from '@components/transaction/PersonalInformation.vue'

export default {
	components: {
		PersonalInformation
	},
	setup() {
		const { cartItems, loadingCartItems, getCartData } = useProduct()
		const { cartData } = storeToRefs(useCartStore())
		const purchaseStep = ref(0)
		const stepItems = ['Informasi Pembeli', 'Pengiriman', 'Pembayaran']
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
			personalInfoData,
		}
	}
}
</script>
