import { defineStore } from 'pinia'

export const usePageStore = defineStore('page', {
	state: () => ({
		currentTab: 1,
	}),
	getters: {
	},
	actions: {
		setPage(tab: number) {
			this.currentTab = tab
		},
		reset() {
			this.currentTab = 1
		},
	}
})

