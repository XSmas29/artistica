import { defineStore } from 'pinia'
import useUser from '@composables/useUser'
import { UserData } from '@utils/types'
export const useAuthStore = defineStore('auth', {
  state: () => ({
    userData: null as UserData | null,
  }),
  actions: {
    set(userData: UserData) {
      this.userData = userData
    },
    reset() {
      this.userData = null
    },
  }
})

