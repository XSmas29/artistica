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
        <template v-if="cartItems.length > 0">
          <v-card
          
            v-for="(item, index) in cartItems"
            :key="item.id"
            variant="tonal"
            rounded
            class="my-2"
            min-width="300"
          >
            <router-link 
              :to="{ name: 'product-detail', params: { id: item.variant.product.id } }"
              style="text-decoration: none; color: inherit;"
            >
              <v-card-title v-if="item.variant.product.single_variant">
                {{ item.variant.product.name }}
              </v-card-title>
              <v-card-title v-else>
                {{ item.variant.product.name }} | {{ item.variant.name }}
              </v-card-title>
            </router-link>
            <!-- <v-img
            height="200"
            :src="item.images[0] ? item.images[0].path : item.product.images[0].path"
            cover
            class="text-white"
          >
        </v-img> -->
            <v-card-text class="pt-1">
              <div class="d-flex">
                <div>
                  <v-img
                    :src="item.variant.images[0] ? item.variant.images[0].path : item.variant.product.images[0].path"
                    width="100"
                    class="rounded mt-1"
                  />
                </div>
                <v-spacer />
                <div class=" align-self-end">
                  <div class="font-weight-medium ms-4 text-body-1 mb-1 text-end">
                    {{ formatCurrency(item.variant.price) }}
                  </div>
                  <div class="d-flex align-center">
                    <v-btn
                      icon
                      flat
                      @click="deleteCart(index)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <div>
                      <v-responsive
                        max-width="128px"
                      >
                        <v-text-field
                          variant="outlined"
                          type="number"
                          hide-details="auto"
                          hide-spin-buttons
                          density="compact"
                          v-model="item.quantity"
                          class="centered-input"
                          @update:model-value="checkQuantity"
                        >
                          <template #prepend-inner>
                            <v-btn
                              icon
                              density="compact"
                              variant="text"
                              @click="reduceQuantity(index)"
                            >
                              <v-icon>mdi-minus</v-icon>
                            </v-btn>
                          </template>
                          <template #append-inner>
                            <v-btn
                              icon
                              density="compact"
                              variant="text"
                              @click="increaseQuantity(index)"
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </template>
                        </v-text-field>
                      </v-responsive>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </template>
        <template v-else>
          <v-card
            variant="text"
            rounded
            class="my-2"
            min-width="300"
          >
            <v-card-title>
              <h3
                class="text-h5 text-center my-2 font-weight-medium"
              >
                Keranjang Kosong
              </h3>
            </v-card-title>
            <v-card-actions class="mt-4">
              <v-spacer />
              <router-link
                :to="{ name: 'products' }"
                style="text-decoration: none; color: inherit;"
              >
                <v-btn
                  block
                  variant="tonal"
                  size="large"
                >
                  Belanja Sekarang
                </v-btn>
              </router-link>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </template>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card
          variant="tonal"
          rounded
          class="my-2"
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
                Total
              </div>
              <div>
                {{ formatCurrency(cartItems.reduce((a, b) => a + (b.variant.price * b.quantity), 0)) }}
              </div>
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn
              block
              variant="tonal"
              :disabled="cartItems.length < 1"
            >
              Checkout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </xyztransition>
</template>
<script lang="ts">
import useProduct from '@/composables/useProduct'
import { onMounted } from 'vue'
import { useCartStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { formatCurrency } from '@utils/filter'

export default {
	setup() {
		const { cartItems, loadingCartItems, getCartData } = useProduct()
		const { cartData } = storeToRefs(useCartStore())
		onMounted(() => {
			loadCartData()
		})

		const loadCartData = () => {
			// const variant_ids = cartData.value.map((item: any) => item.variant_id)
			getCartData(cartData.value)
		}

		const checkQuantity = (val: any) => {
			console.log(val)

			// if (quantity.value < 1) {
			// 	quantity.value = 1
			// } else if (quantity.value > product.value.variants[selectedVariant.value].stock) {
			// 	quantity.value = product.value.variants[selectedVariant.value].stock
			// }
		}

		const reduceQuantity = (index: number) => {
			if (cartData.value[index].quantity > 1) {
				cartData.value[index].quantity -= 1
				cartItems.value[index].quantity -= 1
			}
		}

		const increaseQuantity = (index: number) => {
			console.log(cartItems.value[index].variant.stock)
			if (cartData.value[index].quantity < cartItems.value[index].variant.stock) {
				cartData.value[index].quantity += 1
				cartItems.value[index].quantity += 1
			}
		}

		const deleteCart = (index: number) => {
			cartData.value.splice(index, 1)
			cartItems.value.splice(index, 1)
		}

		return {
			cartItems,
			loadingCartItems,

			checkQuantity,
			reduceQuantity,
			increaseQuantity,
			deleteCart,
			formatCurrency
		}
	}
}
</script>
<style scoped>
    .centered-input >>> input {
      text-align: center
    }
</style>