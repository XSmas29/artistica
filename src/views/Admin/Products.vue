<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
        Daftar Produk

        <v-spacer />

        <v-text-field
          v-model="productListFilter.search"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          label="Search"
          single-line
          flat
          hide-details
          variant="solo-filled"
          @update:model-value="debouncedLoadProduct(true)"
        />
      </v-card-title>
      <v-divider />
      <v-data-table-server
        :loading="loadingProductList"
        :items="productList"
        :items-length="productCount"
        :headers="headerList"
        v-model:expanded="expandedList"
        fixed-header
        multi-sort
        must-sort
        height="100%"
        class="layout"
        v-model:page="productListPaginationAdmin.page"
        v-model:items-per-page="productListPaginationAdmin.limit"
        @update:items-per-page="loadProduct(true)"
        @update:page="loadProduct(false)"
      >
        <template #bottom>
          <v-data-table-footer
            :items-per-page-options="[10, 25, 50]"
            :total-items="productCount"
            :page-text="
              (((productListPaginationAdmin.page - 1) * productListPaginationAdmin.limit) + 1) + '-' + 
                productListPaginationAdmin.page * productListPaginationAdmin.limit
                + ' dari ' + productCount
            "
          />
        </template>
        <template #[`item.no`]="{ index }">
          <td>{{ ((productListPaginationAdmin.page - 1) * productListPaginationAdmin.limit) + index + 1 }}</td>
        </template>
        <template #[`item.image`]="{ item }">
          <td>
            <v-card
              rounded
              class="my-1"
              flat
            >
              <v-img
                :src="item.images[0] ? item.images[0].path : productPlaceholder"
                width="75"
                height="75"
                :lazy-src="productPlaceholder"
              />
            </v-card>
          </td>
        </template>
        <template #[`item.name`]="{ item }">
          <td class="text-body-1 font-weight-medium">
            {{ item.name }}
          </td>
        </template>
        <template #[`item.price`]="{ item }">
          <td>
            {{ priceRange(item.variants) }}
          </td>
        </template>
        <template #[`item.stock`]="{ item }">
          <td>
            {{ totalStock(item.variants) }}
          </td>
        </template>
        <template #[`item.expand`]="{ item }">
          <td>
            <v-btn
              v-if="!item.single_variant"
              icon
              flat
              @click="expandedList.includes(item.id) ? expandedList.splice(expandedList.indexOf(item.id), 1) : expandedList.push(item.id)"
            >
              <v-icon v-if="expandedList.includes(item.id)">
                mdi-chevron-up
              </v-icon>
              <v-icon v-else>
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </td>
        </template>
        <template #expanded-row="{ item }">
          <tr
            v-for="(variant, index) in item.variants"
            :key="index"
          >
            <td
              v-for="header in headerList"
              :key="header.value"
            >
              <template v-if="header.value === 'name'">
                <div class="my-3">
                  <div>
                    {{ item.name }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    SKU: {{ item.variants[index].sku }}
                  </div>
                </div>
              </template>
              <template v-else-if="header.value === 'price'">
                {{ formatCurrency(item.variants[index].price) }}
              </template>
              <template v-else-if="header.value === 'stock'">
                {{ item.variants[index].stock }}
              </template>
            </td>
          </tr>
        </template>
      </v-data-table-server>
    </v-card>
  </XyzTransition>
</template>
<script lang="ts">
import useProduct from '@/composables/useProduct'
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/store/modules'
import { onMounted, ref } from 'vue'
import { priceRange, totalStock, formatCurrency } from '@/utils/filter'
import { productPlaceholder } from '@/utils/global'
import { useDebounceFn } from '@vueuse/core'

export default {
	setup() {
		const { getProductList, loadingProductList, productList, productCount } = useProduct()
		const { productListPaginationAdmin, productListFilter, productListSort } = storeToRefs(useProductStore())

		const loadProduct = async (resetPage: boolean) => {
			if (resetPage) productListPaginationAdmin.value.page = 1
			await getProductList(productListFilter.value, productListPaginationAdmin.value, productListSort.value)
		}

		const debouncedLoadProduct = useDebounceFn((resetPage: boolean) => {
			
			loadProduct(resetPage)
		}, 500)

		const expandedList = ref([] as string[])

		const headerList = ref([
			{
				text: 'No',
				value: 'no',
				title: 'No',
			},
			{
				text: 'Gambar',
				value: 'image',
				title: 'Gambar',
			},
			{
				text: 'Nama Produk',
				value: 'name',
				title: 'Nama Produk',
			},
			{
				text: 'Harga',
				value: 'price',
				title: 'Harga',
			},
			{
				text: 'Stok',
				value: 'stock',
				title: 'Stok',
			},
			{
				text: 'Aksi',
				value: 'action',
				title: 'Aksi',
			},
			{
				text: '',
				value: 'expand',
				title: '',
			},
		])

		onMounted(() => {
			loadProduct(true)
		})

		return {
			priceRange,
			totalStock,
			formatCurrency,
			loadProduct,
			debouncedLoadProduct,

			getProductList,
			loadingProductList,
			productList,
			productCount,
			productListFilter,
			productListPaginationAdmin,

			headerList,
			expandedList,
			productPlaceholder,
		}
	}
}
</script>
<style>
</style>