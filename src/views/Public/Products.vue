<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <div
      class="d-flex"
    >
      <template v-if="!smAndDown">
        <div>
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
              @update:model-value="debouncedLoadProduct(true)"
              hide-details="auto"
              variant="solo-filled"
              prepend-inner-icon="mdi-magnify"
            />

            <div class="text-h6 mt-3 mb-2">
              Harga
            </div>
            <div class="d-flex align-center mb-1">
              <v-text-field
                v-model="filterPrice[0]"
                label="Minimal"
                type="number"
                hide-details="auto"
                density="comfortable"
                readonly
                prefix="IDR"
              />
              <p class="mx-1">
                -
              </p>
              <v-text-field
                v-model="filterPrice[1]"
                label="Maksimal"
                type="number"
                readonly
                density="comfortable"
                hide-details="auto"
                prefix="IDR"
              />
            </div>
            <v-range-slider
              class="mb-3"
              v-model="filterPrice"
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
              @update:model-value="debouncedLoadProduct(true)"
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
              class="mb-4"
              :items="materialList"
              label="Jenis Material"
              multiple
              hide-details="auto"
              :loading="loadingMaterialList"
              item-title="name"
              item-value="id"
              clearable
              chips
              @update:model-value="debouncedLoadProduct(true)"
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
            <v-btn
              block
              elevation="0"
              color="accent"
              @click="resetFilter"
            >
              Reset All
            </v-btn>
          </v-card>
        </div>
        <v-divider
          vertical
          class="mx-2"
        />
      </template>
      <div class="flex-grow-1">
        <v-row class="my-1">
          <v-col
            v-if="smAndDown"
            cols="12"
            sm="6"
            class="py-1"
          >
            <v-btn
              prepend-icon="mdi-filter"
              block
              size="x-large"
              variant="tonal"
            >
              Filter
              <v-dialog
                v-model="filterDialog"
                activator="parent"
                width="640px"
              >
                <v-card>
                  <v-toolbar
                    dark
                    color="primary"
                  >
                    <v-toolbar-title>Filter</v-toolbar-title>
                    <v-spacer />
                    <v-toolbar-items>
                      <v-btn
                        icon
                        dark
                        @click="filterDialog = false"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-card-text class="pa-4">
                    <v-text-field
                      v-model="productListFilter.search"
                      label="Search..."
                      single-line
                      @update:model-value="debouncedLoadProduct(true)"
                      hide-details="auto"
                      variant="solo-filled"
                      prepend-inner-icon="mdi-magnify"
                    />
                    <div class="text-h6 mt-3 mb-2">
                      Harga
                    </div>
                    <div class="d-flex align-center mb-1">
                      <v-text-field
                        v-model="filterPrice[0]"
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
                        v-model="filterPrice[1]"
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
                      v-model="filterPrice"
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
                      @update:model-value="debouncedLoadProduct(true)"
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
                      class="mb-4"
                      :items="materialList"
                      label="Jenis Material"
                      multiple
                      hide-details="auto"
                      :loading="loadingMaterialList"
                      item-title="name"
                      item-value="id"
                      clearable
                      chips
                      @update:model-value="debouncedLoadProduct(true)"
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
                    <v-btn
                      block
                      @click="resetFilter"
                    >
                      Reset All
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            offset="0"
            offset-md="6"
            class="py-1"
          >
            <v-select
              v-model="productListSort"
              class="mb-3"
              :items="productListSortOptions"
              label="Urutkan Berdasarkan"
              hide-details="auto"
              item-title="name"
              item-id="id"
              density="comfortable"
              prepend-inner-icon="mdi-sort"
              return-object
              @update:model-value="loadProduct(true)"
            >
              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="item.props.value.icon"
                />
              </template>
            </v-select>
          </v-col>
        </v-row>
        <p class="ma-2">
          Menampilkan produk 
          {{ ((productListPagination.page - 1) * productListPagination.limit) + 1 }} - 
          {{ (productListPagination.page * productListPagination.limit > productCount) ? productCount : (productListPagination.page * productListPagination.limit) }} 
          dari {{ productCount }} produk
        </p>
        <v-card
          class="ma-1"  
          flat
          min-height="100%"
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
        
          <v-row>
            <v-col
              cols="12"
              lg="4"
              sm="6"
              :key="index"
              v-for="(item, index) in productList"
              class="pa-0"
            >
              <v-hover
                v-slot="{ isHovering, props }"
              >
                <v-card
                  rounded
                  v-bind="props"
                  class="ma-2 flex-fill no-decoration"
                >
                  <router-link
                    class="link"
                    :to="{
                      name: 'product-detail',
                      params: {
                        id: item.id
                      }
                    }"
                  >
                    <v-img
                      :src="item.images[0] ? item.images[0].path : productPlaceholder"
                      :lazy-src="productPlaceholder"
                      cover
                      class="text-white"
                      aspect-ratio="1"
                      rounded
                      eager
                      :alt="item.slug"
                    />
                    <v-tooltip
                      location="top center"
                      eager
                      :text="item.name"
                    >
                      <template #activator="tooltipProps">
                        <v-card-title
                          class="text-body-1 font-weight-bold pb-0 px-3 mb-1 product-title"
                          v-bind="tooltipProps.props"
                        >
                          {{ item.name }}
                        </v-card-title>
                      </template>
                    </v-tooltip>
                    <v-card-subtitle class="text-subtitle-1 font-weight-bold px-3 mb-3">
                      {{ item.single_variant ? formatCurrency(item.variants[0].price) : priceRange(item.variants) }}
                    </v-card-subtitle>
                    <v-overlay
                      :model-value="isHovering"
                      contained
                      scrim="true"
                    />
                  </router-link>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
          <!-- <v-card
          class="d-flex flex-wrap mb-4"
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
              
          <v-hover
            v-slot="{ isHovering, props }"
            v-for="(item, index) in productList"
            :key="index"
          >
            <v-card
              rounded
              v-bind="props"
              width="250"
              class="ma-2 flex-fill no-decoration"
            >
              <router-link
                class="link"
                :to="{
                  name: 'product-detail',
                  params: {
                    id: item.id
                  }
                }"
              >
                <v-img
                  :src="item.images[0] ? item.images[0].path : productPlaceholder"
                  :lazy-src="productPlaceholder"
                  cover
                  class="text-white"
                  aspect-ratio="1"
                  rounded
                  eager
                  :alt="item.slug"
                />
                <v-tooltip
                  location="top center"
                  eager
                  :text="item.name"
                >
                  <template #activator="tooltipProps">
                    <v-card-title
                      class="text-body-1 font-weight-bold pb-0 px-3 mb-1 product-title"
                      v-bind="tooltipProps.props"
                    >
                      {{ item.name }}
                    </v-card-title>
                  </template>
                </v-tooltip>
                <v-card-subtitle class="text-subtitle-1 font-weight-bold px-3 mb-3">
                  {{ item.single_variant ? formatCurrency(item.variants[0].price) : priceRange(item.variants) }}
                </v-card-subtitle>
                <v-overlay
                  :model-value="isHovering"
                  contained
                  scrim="true"
                />
              </router-link>
            </v-card>
          </v-hover>
        </v-card> -->
          <v-pagination
            v-model="productListPagination.page"
            :length="Math.ceil(productCount / productListPagination.limit)"
            @update:model-value="loadProduct(false)"
            rounded="circle"
            class="mt-4"
            flat
          />
        </v-card>
      </div>
    </div>
  </xyztransition>
</template>
<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useProductStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import useProduct from '@composables/useProduct'
import useCategory from '@composables/useCategory'
import useMaterial from '@composables/useMaterial'
import { formatCurrency, priceRange, productPlaceholder } from '@helpers/utils'
import { useDebounceFn } from '@vueuse/core'
import { useDisplay } from 'vuetify'

export default {
	setup() {
		const { smAndDown } = useDisplay()
		const { productListPagination, productListFilter, productListSort } = storeToRefs(useProductStore())
		const { getProductList, loadingProductList, productList, productCount } = useProduct()

		const { getCategoryList, loadingCategoryList, categoryList } = useCategory()
		const { getMaterialList, loadingMaterialList, materialList } = useMaterial()

		const filterPrice = ref([0, 0])
		const filterDialog = ref(false)

		const productListSortOptions = ref([
			{
				id: 1,
				name: 'Name (A-Z)',
				field: 'name',
				sort: 'ASC',
				icon: 'mdi-sort-ascending',
			},
			{
				id: 2,
				name: 'Name (Z-A)',
				field: 'name',
				sort: 'DESC',
				icon: 'mdi-sort-descending',
			},
			{
				id: 3,
				name: 'Price (Low-High)',
				field: 'price',
				sort: 'ASC',
				icon: 'mdi-sort-ascending',
			},
			{
				id: 4,
				name: 'Price (High-Low)',
				field: 'price',
				sort: 'DESC',
				icon: 'mdi-sort-descending',
			}
		])

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

			debouncedLoadProduct(true)
		}

		const toggleMaterial = () => {
			if (allMaterials.value) {
				productListFilter.value.material_ids = []
			} else {
				productListFilter.value.material_ids = materialList.value.map((item: any) => item.id)
			}

			debouncedLoadProduct(true)
		}
    
		onMounted(() => {
			loadProduct(false).then(() => {
				filterPrice.value = [price_min.value, price_max.value]
			})
			getCategoryList()
			getMaterialList()
		})

		const loadProduct = async (resetPage: boolean) => {
			if (resetPage) productListPagination.value.page = 1
			await getProductList(productListFilter.value, productListPagination.value, productListSort.value).then(({products}: any) => {
				price_min.value = products.price_min
				price_max.value = products.price_max
			})
		}

		const debouncedLoadProduct = useDebounceFn((resetPage: boolean) => {
			
			loadProduct(resetPage)
		}, 500)

		const setPriceFilter = (value: number[]) => {
			productListFilter.value.price_min = value[0]
			productListFilter.value.price_max = value[1]
			debouncedLoadProduct(true)
		}

		const resetFilter = () => {
			productListFilter.value = {
				search: '',
				category_ids: [],
				material_ids: [],
				price_min: price_min.value,
				price_max: price_max.value
			}
			filterPrice.value = [price_min.value, price_max.value]
			debouncedLoadProduct(true)
		}
		
		return {
			productPlaceholder,
			smAndDown,

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
			productListSort,
			loadProduct,
			resetFilter,
      
			productListSortOptions,
			productListPagination,
			productList,
			productCount,
			filterPrice,
			filterDialog,

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
.link {
  text-decoration: none; 
  color: inherit;
}
</style>