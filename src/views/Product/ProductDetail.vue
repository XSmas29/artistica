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
                @update:model-value="checkAmount"
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
                  v-model="amount"
                  class="centered-input"
                  @update:model-value="checkAmount"
                >
                  <template #prepend-inner>
                    <v-btn
                      icon
                      density="compact"
                      variant="text"
                      @click="reduceAmount"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>
                  <template #append-inner>
                    <v-btn
                      icon
                      density="compact"
                      variant="text"
                      @click="increaseAmount"
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
                    >
                      Masukkan keranjang
                    </v-btn>
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
import { useAuthStore } from '@/store/modules'

export default {
	components: {
		ImageGallery
	},
	setup() {
		const route = useRoute()
		const { isLoggedIn } = useAuthStore()
		const { getProductDetail, loadingProductDetail, product } = useProduct()
		const amount = ref(1)

		onMounted(() => {
			const id = +(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)
			getProductDetail(id)
		})

		const reduceAmount = () => {
			if (amount.value > 1) {
				amount.value -= 1
			}
		}

		const increaseAmount = () => {
			if (amount.value < product.value.variants[selectedVariant.value].stock) {
				amount.value += 1
			}
		}

		const checkAmount = () => {
			if (amount.value < 1) {
				amount.value = 1
			} else if (amount.value > product.value.variants[selectedVariant.value].stock) {
				amount.value = product.value.variants[selectedVariant.value].stock
			}
		}
    
		const selectedVariant = ref(0)
    
		return {
			loadingProductDetail,
			product,
			selectedVariant,
			amount,

			formatCurrency,
			reduceAmount,
			increaseAmount,
			checkAmount,

			isLoggedIn
		}
	},
}
</script>
<style scoped>
    .centered-input >>> input {
      text-align: center
    }
</style>