import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
	state: () => ({
		userListPaginationAdmin: {
			limit: 10,
			page: 1,
		},
		userListFilterAdmin: {
			search: null as string | null,
		},
	}),
	getters: {
		
	},
	actions: {
		
	}
})

