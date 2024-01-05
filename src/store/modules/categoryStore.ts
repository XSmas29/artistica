import { defineStore } from 'pinia'
export const useCategoryStore = defineStore('category', {
	state: () => ({
		categoryListPaginationAdmin: {
			limit: 10,
			page: 1,
		},
		categoryListFilterAdmin: {
			search: null as string | null,
		},
	}),
	getters: {
		
	},
	actions: {
		
	}
})

