import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('transaction', {
	state: () => ({
		transactionListSort: {
			id: 1,
			name: 'Tanggal Pembelian (Terbaru)',
			field: 'created_at',
			sort: 'ASC',
			icon: 'mdi-sort-ascending',
		},
		transactionListFilter: {
			status_ids: [] as number[],
		},
	}),
	getters: {
		getTransactionListSort(state) {
			return state.transactionListSort
		},
		getTransactionListFilter(state) {
			return state.transactionListFilter
		},
	},
})