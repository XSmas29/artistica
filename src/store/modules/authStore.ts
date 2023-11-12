import { defineStore } from 'pinia'
import { UserData } from '@utils/types'
export const useAuthStore = defineStore('auth', {
	state: () => ({
		userData: null as UserData | null,
	}),
	getters: {
		isLoggedIn(state) {
			return !!state.userData
		}
	},
	actions: {
		set(userData: UserData) {
			this.userData = userData
		},
		reset() {
			this.userData = null
		},
		logout() {
			this.reset()
			localStorage.removeItem('token')
		}
	}
})

