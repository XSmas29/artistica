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
                  v-model="transactionListFilterAdmin.status_ids"
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
                  @update:model-value="debouncedLoadTransaction(true)"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                class="pa-2"
              >
                <v-select
                  v-model="transactionListSortAdmin"
                  :loading="loadingTransactionStatusList"
                  :items="transactionListSortOptions"
                  item-title="name"
                  item-value="id"
                  label="Urutkan Berdasarkan"
                  hide-details="auto"
                  density="comfortable"
                  prepend-inner-icon="mdi-sort"
                  return-object
                  @update:model-value="debouncedLoadTransaction(true)"
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
        :loading="loadingTransactionList"
        :items="transactionList"
        :items-length="transactionCount"
        :headers="headerList"
        fixed-header
        multi-sort
        must-sort
        height="100%"
        class="layout"
        v-model:page="transactionListPaginationAdmin.page"
        v-model:items-per-page="transactionListPaginationAdmin.limit"
        @update:items-per-page="loadTransaction(true)"
        @update:page="loadTransaction(false)"
      >
        <template #[`item.no`]="{ index }">
          {{ ((transactionListPaginationAdmin.page - 1) * transactionListPaginationAdmin.limit) + index + 1 }}
        </template>
        <template #[`item.user`]="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                size="small"
              >
                <v-avatar
                  color="accent"
                >
                  <span class="text-body-1">{{ getInitials(item.customer_name) }}</span>
                </v-avatar>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <h3>{{ item.customer_name }}</h3>
                <p class="text-caption mt-1">
                  {{ item.customer_email }}
                </p>
                <p class="text-caption mt-1">
                  {{ item.customer_phone }}
                </p>
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
        <template #[`item.total_price`]="{ item }">
          {{ formatCurrency(item.total_price) }}
        </template>
        <template #[`item.shipping_cost`]="{ item }">
          {{ formatCurrency(item.shipping_cost) }}
        </template>
        <template #[`item.created_at`]="{ item }">
          {{ formatDateTime(item.created_at) }}
        </template>
        <template #[`item.action`]="{ item }">
          <div class="text-end">
            <v-tooltip
              text="Lihat Detail Transaksi"
              location="top"
            >
              <template #activator="{ props }">
                <router-link
                  :to="{ name: 'admin-transaction-detail', params: { id: item.id } }"
                >
                  <v-btn
                    icon
                    flat
                    density="comfortable"
                    v-bind="props"
                  >
                    <v-icon
                      size="35"
                      color="secondary"
                    >
                      mdi-eye-circle
                    </v-icon>
                  </v-btn>
                </router-link>
              </template>
            </v-tooltip>
          </div>
        </template>
        <template #bottom>
          <v-data-table-footer
            :items-per-page-options="[10, 25, 50]"
            :total-items="transactionCount"
            :page-text="
              (((transactionListPaginationAdmin.page - 1) * transactionListPaginationAdmin.limit) + 1) + '-' + 
                (transactionListPaginationAdmin.page * transactionListPaginationAdmin.limit > transactionCount
                  ? transactionCount
                  : transactionListPaginationAdmin.page * transactionListPaginationAdmin.limit
                )
                + ' dari ' + transactionCount
            "
          />
        </template>
      </v-data-table-server>
    </v-card>
  </xyztransition>
</template>
<script lang="ts">
import { useTransactionStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import useTransaction from '@/composables/useTransaction'
import { useDebounceFn } from '@vueuse/core'
import { formatDateTime, getInitials } from '@helpers/utils'
import { formatCurrency } from '@helpers/utils'

export default {
	setup() {
		const { 
			getTransactionStatusList, loadingTransactionStatusList, transactionStatusList,
			getTransactionList, loadingTransactionList, transactionList, transactionCount,
		} = useTransaction()
		const { transactionListFilterAdmin, transactionListSortAdmin, transactionListPaginationAdmin } = storeToRefs(useTransactionStore())

		const loadTransaction = async (resetPage: boolean) => {
			if (resetPage) transactionListPaginationAdmin.value.page = 1
			await getTransactionList(transactionListFilterAdmin.value, transactionListSortAdmin.value, transactionListPaginationAdmin.value)
		}

		const debouncedLoadTransaction = useDebounceFn((resetPage: boolean) => {
			loadTransaction(resetPage)
		}, 500)

		onMounted(() => {
			getTransactionStatusList()
			loadTransaction(true)
		})

		const headerList = ref([
			{
				text: 'No',
				value: 'no',
				title: 'No',
			},
			{
				text: 'ID',
				value: 'id',
				title: 'ID',
			},
			{
				text: 'Pembeli',
				value: 'user',
				title: 'Pembeli',
			},
			{
				text: 'Total Pembelian',
				value: 'total_price',
				title: 'Total Pembelian',
			},
			{
				text: 'Ongkos Kirim',
				value: 'shipping_cost',
				title: 'Ongkos Kirim',
			},
			{
				text: 'Tanggal Pembelian',
				value: 'created_at',
				title: 'Tanggal Pembelian',
			},
			{
				text: 'Aksi',
				value: 'action',
				title: 'Aksi',
			},
		])

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
		
		return {
			transactionListFilterAdmin,

			loadingTransactionStatusList,
			transactionStatusList,
      
			transactionListSortOptions,
			transactionListSortAdmin,
			transactionListPaginationAdmin,
			debouncedLoadTransaction,
			loadTransaction,

			loadingTransactionList,
			transactionList,
			transactionCount,
			headerList,

			getInitials,
			formatCurrency,
			formatDateTime,
		}
	}
}
</script>
