import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('transaction', {
	state: () => ({
		transactionListSortOptions: [
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
		],
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
		transactionListSortUser: {
			id: 1,
			name: 'Tanggal Pembelian (Terbaru)',
			field: 'created_at',
			sort: 'ASC',
			icon: 'mdi-sort-ascending',
		},
		transactionListFilterUser: {
			status_ids: [] as number[],
		},
		transactionListPaginationUser: {
			limit: 10,
			page: 1,
		},
	})
})