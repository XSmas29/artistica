<template>
  <div
    class="d-flex"
  >
    <div>
      <div>Filter</div>
      <v-card
        rounded
        variant="flat"
        width="320px"
        class="px-3 py-3 mx-1"
        color="primary"
      >
        <v-text-field
          v-model="productListFilter.search"
          label="Search..."
          single-line
          @update:model-value="debouncedLoadProduct"
          hide-details="auto"
          variant="solo-filled"
          prepend-inner-icon="mdi-magnify"
        />
        <div class="text-h6 mb-2">
          Harga
        </div>
        <div class="d-flex align-center mb-1">
          <v-text-field
            v-model="productListFilter.price_min"
            label="Minimal"
            type="number"
            hide-details="auto"
            density="compact"
            readonly
            prefix="IDR"
          />
          <p class="mx-1">
            -
          </p>
          <v-text-field
            v-model="productListFilter.price_max"
            label="Maksimal"
            type="number"
            readonly
            density="compact"
            hide-details="auto"
            prefix="IDR"
          />
        </div>
        <v-range-slider
          class="mb-3"
          @update:model-value="setPriceFilter"
          :min="price_min"
          :max="price_max"
          :step="5000"
          strict
          density="compact"
          elevation="0"
          hide-details="auto"
          hide-spin-buttons
          name="price"
          thumb-size="16"
        />
        <v-select
          v-model="productListFilter.category_ids"
          class="mb-3"
          :items="categoryList"
          label="Jenis Perhiasan"
          multiple
          hide-details="auto"
          :loading="loadingCategoryList"
          item-title="name"
          item-value="id"
          @update:model-value="debouncedLoadProduct"
          chips
          clearable
        >
          <template #prepend-item>
            <v-list-item
              title="Semua"
              @click="toggleCategory"
            >
              <template #prepend>
                <v-checkbox-btn
                  :indeterminate="productListFilter.category_ids.length > 0 && productListFilter.category_ids.length < categoryList.length"
                  v-model="allCategories"
                />
              </template>
            </v-list-item>
    
            <v-divider class="mt-2" />
          </template>
        </v-select>
        <v-select
          v-model="productListFilter.material_ids"
          class="mb-3"
          :items="materialList"
          label="Jenis Material"
          multiple
          hide-details="auto"
          :loading="loadingMaterialList"
          item-title="name"
          item-value="id"
          clearable
          chips
          @update:model-value="debouncedLoadProduct"
        >
          <template #prepend-item>
            <v-list-item
              title="Semua"
              @click="toggleMaterial"
            >
              <template #prepend>
                <v-checkbox-btn
                  :indeterminate="productListFilter.material_ids.length > 0 && productListFilter.material_ids.length < materialList.length"
                  v-model="allMaterials"
                />
              </template>
            </v-list-item>
    
            <v-divider class="mt-2" />
          </template>
        </v-select>
      </v-card>
    </div>
    <v-card
      class="d-flex flex-wrap justify-center"
      flat
    >
      <v-overlay
        :model-value="loadingProductList"
        class="align-center justify-center"
        contained
      >
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        />
      </v-overlay>
      <v-card
        rounded
        height="335"
        width="260"
        v-for="(item, index) in productList"
        :key="index"
        class="ma-2"
      >
        <v-card rounded>
          <v-img
            height="260"
            :src="item.images[0]?.path"
            cover
            class="text-white"
            aspect-ratio="1"
            rounded
            eager
            :alt="item.slug"
          />
        </v-card>
        <v-tooltip
          location="top center"
          eager
          :text="item.name"
        >
          <template #activator="{ props }">
            <v-card-title
              class="text-body-1 font-weight-bold pb-0 px-3 mb-1 product-title"
              v-bind="props"
            >
              {{ item.name }}
            </v-card-title>
          </template>
        </v-tooltip>
        <v-card-subtitle class="text-subtitle-1 font-weight-bold px-3">
          {{ item.single_variant ? formatCurrency(item.variants[0].price) : priceRange(item.variants) }}
        </v-card-subtitle>
      </v-card>
    </v-card>
  </div>
</template>
<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useProductStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import useProduct from '@composables/useProduct'
import useCategory from '@composables/useCategory'
import useMaterial from '@composables/useMaterial'
import { formatCurrency } from '@utils/filter'
import { useDebounceFn } from '@vueuse/core'
export default {
	setup() {
		const { getProductListPagination, getProductListFilter, getProductListSort } = useProductStore()
		const { productListPagination, productListFilter } = storeToRefs(useProductStore())
		const { getProductList, loadingProductList, productList } = useProduct()

		const { getCategoryList, loadingCategoryList, categoryList } = useCategory()
		const { getMaterialList, loadingMaterialList, materialList } = useMaterial()

		const price_min = ref(0)
		const price_max = ref(0)

		const allCategories = computed(() => {
			return productListFilter.value.category_ids.length === categoryList.value.length
		})
		const allMaterials = computed(() => {
			return productListFilter.value.material_ids.length === materialList.value.length
		})

		const toggleCategory = () => {
			if (allCategories.value) {
				productListFilter.value.category_ids = []
			} else {
				productListFilter.value.category_ids = categoryList.value.map((item: any) => item.id)
			}

			debouncedLoadProduct()
		}

		const toggleMaterial = () => {
			if (allMaterials.value) {
				productListFilter.value.material_ids = []
			} else {
				productListFilter.value.material_ids = materialList.value.map((item: any) => item.id)
			}

			debouncedLoadProduct()
		}
    
		onMounted(() => {
			loadProduct()
			getCategoryList()
			getMaterialList()
		})

		const loadProduct = () => {
			getProductList(getProductListFilter, getProductListPagination, getProductListSort).then(({products}: any) => {
				price_min.value = products.price_min
				price_max.value = products.price_max
			})
		}

		const debouncedLoadProduct = useDebounceFn(() => {
			loadProduct()
		}, 750)

		const setPriceFilter = (value: number[]) => {
			productListFilter.value.price_min = value[0]
			productListFilter.value.price_max = value[1]
			debouncedLoadProduct()
		}

		const priceRange = (variants: any) => {
			if (variants.length === 1) {
				return formatCurrency(variants[0].price)
			} else {
				const price_min = variants.reduce((prev: any, curr: any) => prev.price < curr.price ? prev : curr)
				const price_max = variants.reduce((prev: any, curr: any) => prev.price > curr.price ? prev : curr)
				if (price_min.price === price_max.price) {
					return formatCurrency(price_min.price)
				}
				
				return `${formatCurrency(price_min.price)} - ${formatCurrency(price_max.price)}`
			}
		}
		
		return {
			loadingProductList,
			loadingCategoryList,
			loadingMaterialList,

			formatCurrency,
			setPriceFilter,
			allCategories,
			allMaterials,
			debouncedLoadProduct,
			toggleCategory,
			toggleMaterial,
			priceRange,
      
			productListPagination,
			productList,
			getProductListFilter,
			productListFilter,
			categoryList,
			materialList,
			price_min,
			price_max,
      
		}
	}
}
</script>
<style scoped>
</style>