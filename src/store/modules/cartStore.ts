import { defineStore } from 'pinia'
export const useCartStore = defineStore('cart', {
	state: () => ({
		cartData: [] as any[],
	}),
	getters: {
		getCartData(state) {
			return state.cartData
		}
	},
	actions: {
	},
	persist: true,
})

