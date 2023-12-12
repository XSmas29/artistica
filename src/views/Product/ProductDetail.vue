<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-row
      class="d-flex"
    >
      <v-col
        cols="12"
        md="5"
      >
        <image-gallery
          :images="product.images"
        />
      </v-col>
      <v-col
        cols="12"
        md="7"
      >
        <template v-if="product && product.variants">
          <v-card
            flat
          >
            <v-card-title>
              {{ product.name }}
            </v-card-title>
            <v-card-text>
              <v-chip-group
                v-if="!product.single_variant"
                class="my-2"
                v-model="selectedVariant"
                @update:model-value="checkQuantity"
              >
                <v-chip
                  v-for="(item, i) in product.variants"
                  :key="i"
                  label
                  variant="outlined"
                >
                  {{ item.name }}
                </v-chip>
              </v-chip-group>
              <p class="text-h6 mb-3 font-weight-light">
                {{ formatCurrency(product.variants[selectedVariant].price) }}
              </p>
              <p class="text-subtitle-2 mb-1">
                Stok: {{ product.variants[selectedVariant].stock }}
              </p>
              <v-responsive
                max-width="128px"
                class="mb-8"
              >
                <v-text-field
                  variant="outlined"
                  type="number"
                  hide-details="auto"
                  hide-spin-buttons
                  density="compact"
                  v-model="quantity"
                  class="centered-input"
                  @update:model-value="checkQuantity"
                >
                  <template #prepend-inner>
                    <v-btn
                      icon
                      density="compact"
                      variant="text"
                      @click="reduceQuantity"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>
                  <template #append-inner>
                    <v-btn
                      icon
                      density="compact"
                      variant="text"
                      @click="increaseQuantity"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-responsive>
              <v-row class="mb-6">
                <template v-if="isLoggedIn">
                  <v-col
                    cols="12"
                    sm="6"
                    class="py-1"
                  >
                    <v-btn
                      block
                      color="primary"
                      prepend-icon="mdi-cash"
                      flat
                      :disabled="product.variants[selectedVariant].stock <= 0"
                    >
                      Beli sekarang
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    class="py-1"
                  >
                    <v-btn
                      block
                      color="black"
                      prepend-icon="mdi-cart"
                      flat
                      @click="addToCart"
                      :disabled="product.variants[selectedVariant].stock <= 0"
                    >
                      Masukkan keranjang
                    </v-btn>
                    <v-dialog
                      max-width="500"
                      v-model="dialogAddCart"
                    >
                      <template #default="{ isActive }">
                        <v-card>
                          <v-icon
                            color="success"
                            size="120"
                            class="mx-auto mt-8"
                          >
                            mdi-check-circle
                          </v-icon>
                          <v-card-text class="text-center">
                            <div class="text-h5">
                              Berhasil Memasukkan Barang ke keranjang
                            </div>
                          </v-card-text>
                          <v-card-actions>
                            <v-row class="px-4 mt-2 mb-1">
                              <v-col
                                cols="12"
                                sm="6"
                                class="pa-2"
                              >
                                <v-btn
                                  flat
                                  variant="flat"
                                  color="primary"
                                  @click="isActive.value = false"
                                  block
                                >
                                  Lanjut belanja
                                </v-btn>
                              </v-col>
                              <v-col
                                cols="12"
                                sm="6"
                                class="pa-2"
                              >
                                <router-link
                                  :to="{ name: 'cart' }"
                                  style="text-decoration: none;"
                                >
                                  <v-btn
                                    flat
                                    color="black"
                                    variant="flat"
                                    block
                                  >
                                    Lihat keranjang
                                  </v-btn>
                                </router-link>
                              </v-col>
                            </v-row>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </v-col>
                </template>
                <template v-else>
                  <v-col
                    cols="12"
                    class="py-1"
                  >
                    <v-btn
                      block
                      color="black"
                      prepend-icon="mdi-cash"
                      flat
                      @click="() => $router.push({ name: 'login' })"
                    >
                      Beli sekarang
                    </v-btn>
                  </v-col>
                </template>
              </v-row>
              <v-divider class="mb-6" />
              <p
                v-html="product.description"
                class="mb-8"
              />
            </v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </XyzTransition>
</template>
<script lang="ts">
import { onMounted, ref } from 'vue'
import useProduct from '@composables/useProduct'
import { useRoute } from 'vue-router'
import ImageGallery from '@components/ImageGallery.vue'
import { formatCurrency } from '@utils/filter'
import { useAuthStore, useCartStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
export default {
	components: {
		ImageGallery
	},
	setup() {
		const route = useRoute()
		const { isLoggedIn } = storeToRefs(useAuthStore())
		const { cartData } = storeToRefs(useCartStore())
		const { getProductDetail, loadingProductDetail, product } = useProduct()
		const quantity = ref(1)
		const dialogAddCart = ref(false)

		onMounted(() => {
			const id = +(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)
			getProductDetail(id)
		})

		const reduceQuantity = () => {
			if (quantity.value > 1) {
				quantity.value -= 1
			}
		}

		const increaseQuantity = () => {
			if (quantity.value < product.value.variants[selectedVariant.value].stock) {
				quantity.value += 1
			}
		}

		const checkQuantity = () => {
			if (quantity.value < 1) {
				quantity.value = 1
			} else if (quantity.value > product.value.variants[selectedVariant.value].stock) {
				quantity.value = product.value.variants[selectedVariant.value].stock
			}
		}

		const addToCart = () => {
			if (cartData.value.filter((item: any) => item.variant_id === product.value.variants[selectedVariant.value].id).length > 0) {
				cartData.value = cartData.value.map((item: any) => {
					if (item.variant_id === product.value.variants[selectedVariant.value].id) {
						item.quantity += quantity.value
					}
					
					return item
				})
			} else {
				cartData.value.push({
					product_id: product.value.id,
					variant_id: product.value.variants[selectedVariant.value].id,
					quantity: quantity.value
				})
			}
      
			dialogAddCart.value = true
		}
    
		const selectedVariant = ref(0)
    
		return {
			loadingProductDetail,
			product,
			selectedVariant,
			quantity,
			dialogAddCart,
			isLoggedIn,

			formatCurrency,
			reduceQuantity,
			increaseQuantity,
			checkQuantity,
			addToCart,
		}
	},
}
</script>
<style scoped>
    .centered-input :deep() input {
      text-align: center
    }
</style>