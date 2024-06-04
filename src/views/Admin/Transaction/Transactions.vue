<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-card flat>
      <v-card-title class="d-flex align-center px-0">
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            Daftar Transaksi
          </v-col>
          <v-col
            cols="12"
            md="8"
          >
            <v-row>
              <v-col
                cols="12"
                sm="6"
                class="pa-2"
              >
                <v-select
                  v-model="transactionListFilter.status_ids"
                  :loading="loadingTransactionStatusList"
                  :items="transactionStatusList"
                  multiple
                  item-title="status"
                  item-value="id"
                  label="Filter Status"
                  hide-details="auto"
                  chips
                  clearable
                  density="comfortable"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                class="pa-2"
              >
                <v-select
                  v-model="transactionListSort"
                  :loading="loadingTransactionStatusList"
                  :items="transactionListSortOptions"
                  item-title="name"
                  item-value="id"
                  label="Urutkan Berdasarkan"
                  hide-details="auto"
                  density="comfortable"
                  prepend-inner-icon="mdi-sort"
                  return-object
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
          </v-col>
        </v-row>
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
      />
    </v-card>
  </xyztransition>
</template>
<script lang="ts">
import { useTransactionStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import useTransaction from '@/composables/useTransaction'

export default {
	setup() {
		const { 
			getTransactionStatusList, loadingTransactionStatusList, transactionStatusList,
		} = useTransaction()
		const { transactionListFilter, transactionListSort } = storeToRefs(useTransactionStore())

		const transactionListSortOptions = ref([
			{
				id: 1,
				name: 'Tanggal Pembelian (Terbaru)',
				field: 'created_at',
				sort: 'ASC',
				icon: 'mdi-sort-ascending',
			},
			{
				id: 2,
				name: 'Tanggal Pembelian (Terlama)',
				field: 'created_at',
				sort: 'DESC',
				icon: 'mdi-sort-descending',
			},
		])

		onMounted(() => {
			getTransactionStatusList()
		})
		
		return {
			transactionListFilter,

			loadingTransactionStatusList,
			transactionStatusList,
      
			transactionListSortOptions,
			transactionListSort,
		}
	}
}
</script>
