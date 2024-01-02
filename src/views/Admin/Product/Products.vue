<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-card flat>
      <div class="d-flex justify-end">
        <router-link
          :to="{ name: 'admin-product-add' }"
        >
          <v-btn
            flat
            color="success"
          >
            <v-icon>mdi-plus</v-icon>
            Tambah Produk
          </v-btn>
        </router-link>
      </div>
      <v-card-title class="d-flex align-center px-0">
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
        <template #[`header.action`]="{ column }">
          <div class="text-end">
            {{ column.title }}
          </div>
        </template>
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
          {{ ((productListPaginationAdmin.page - 1) * productListPaginationAdmin.limit) + index + 1 }}
        </template>
        <template #[`item.image`]="{ item }">
          <v-img
            :src="item.images[0] ? item.images[0].path : productPlaceholder"
            width="75"
            height="75"
            :lazy-src="productPlaceholder"
            class="rounded-lg my-1"
          />
        </template>
        <template #[`item.name`]="{ item }">
          <p class="text-body-1 font-weight-medium">
            {{ item.name }}
          </p>
        </template>
        <template #[`item.price`]="{ item }">
          {{ priceRange(item.variants) }}
        </template>
        <template #[`item.stock`]="{ item }">
          {{ totalStock(item.variants) }}
        </template>
        <template #[`item.expand`]="{ item }">
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
        <template #[`item.action`]="{ item }">
          <div class="text-end">
            <v-btn
              icon
              flat
              density="comfortable"
            >
              <v-icon
                size="35"
                color="warning"
              >
                mdi-pencil-circle
              </v-icon>
            </v-btn>
            <v-dialog
              max-width="500"
            >
              <template #activator="{ props }">
                <v-btn
                  icon
                  flat
                  density="comfortable"
                  v-bind="props"
                >
                  <v-icon
                    color="error"
                    size="35"
                  >
                    mdi-delete-circle
                  </v-icon>
                </v-btn>
              </template>
              <template #default="{ isActive }">
                <v-card
                  title="Hapus Produk?"
                >
                  <v-card-text>
                    Yakin mau menghapus produk <b>{{ item.name }}</b>?
                  </v-card-text>
                  
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      text="Hapus"
                      color="error"
                      :loading="loadingRemoveProduct"
                      @click="deleteProduct(item.id)"
                    />
                    <v-btn
                      text="Batal"
                      @click="isActive.value = false"
                    />
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </div>
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
		const { 
			getProductList, loadingProductList, productList, productCount,
			removeProduct, loadingRemoveProduct,
		} = useProduct()
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

		const deleteProduct = (id: number) => {
			removeProduct(id).then(() => {
				loadProduct(true)
			})
		}

		return {
			priceRange,
			totalStock,
			formatCurrency,
			loadProduct,
			debouncedLoadProduct,
      
			deleteProduct,
			loadingRemoveProduct,

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