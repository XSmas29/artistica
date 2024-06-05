import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('transaction', {
	state: () => ({
		transactionListSortAdmin: {
			id: 1,
			name: 'Tanggal Pembelian (Terbaru)',
			field: 'created_at',
			sort: 'ASC',
			icon: 'mdi-sort-ascending',
		},
		transactionListFilterAdmin: {
			status_ids: [] as number[],
		},
		transactionListPaginationAdmin: {
			limit: 10,
			page: 1,
		},
	})
})