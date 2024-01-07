import { defineStore } from 'pinia'
export const useMaterialStore = defineStore('material', {
	state: () => ({
		materialListPaginationAdmin: {
			limit: 10,
			page: 1,
		},
		materialListFilterAdmin: {
			search: null as string | null,
		},
	}),
	getters: {
		
	},
	actions: {
		
	}
})

