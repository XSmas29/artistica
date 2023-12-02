import { defineStore } from 'pinia'
export const useProductStore = defineStore('product', {
	state: () => ({
		productListPagination: {
			limit: 12,
			page: 1,
		},
		productListFilter: {
			category_ids: [] as number[],
			material_ids: [] as number[],
			price_max: null as number | null,
			price_min: null as number | null,
			search: null as string | null,
		},
		productListSort: {
			id: 1,
			name: 'Name (A-Z)',
			field: 'name',
			sort: 'ASC' as 'ASC' | 'DESC',
			icon: 'mdi-sort-ascending',
		}
	}),
	getters: {
		getProductListPagination(state) {
			return state.productListPagination
		},
		getProductListFilter(state) {
			return state.productListFilter
		},
		getProductListSort(state) {
			return state.productListSort
		},
	},
	actions: {
		changePage(page: number) {
			this.productListPagination.page = page
		},
		changeLimit(limit: number) {
			this.productListPagination = {
				limit,
				page: 1,
			}
		}
	}
})

