import { defineStore } from 'pinia'
export const useProductStore = defineStore('product', {
	state: () => ({
		productListPagination: {
			limit: 10,
			offset: 0,
		},
		productListFilter: {
			category_ids: [] as number[],
			material_ids: [] as number[],
			price_max: null as number | null,
			price_min: null as number | null,
			search: null as string | null,
		},
		productListSort: {
			field: 'name',
			sort: 'ASC' as 'ASC' | 'DESC',
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
		}
	},
	actions: {
		changePage(page: number) {
			this.productListPagination.offset = page
		},
		changeLimit(limit: number) {
			this.productListPagination = {
				limit,
				offset: 0,
			}
		}
	}
})

