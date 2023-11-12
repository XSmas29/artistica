import { apolloClient } from '@/vue-apollo'
import { ref } from 'vue'
import { login, register as signUp, verifyUser } from '@graphql/mutations'
import { checkVerifyCode, profileInfo } from '@graphql/queries'
import { toast } from '@/helpers/utils'
import { useAuthStore } from '@/store/modules/authStore'
import editProfile from '@graphql/mutation/editProfile'

const useUser = () => {
	const authStore = useAuthStore()
	const user = ref(null as any)

	const loadingRegister = ref(false)
	const loadingVerify = ref(false)
	const loadingUser = ref(false)
	const loadingLogin = ref(false)
	const loadingLogout = ref(false)
	const loadingProfile = ref(false)
	const loadingEditProfile = ref(false)
	const loadingEditPassword = ref(false)

	const register = async (email: string) => {
		loadingRegister.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: signUp,
				variables: {
					email,
				},
			}).then(({ data }: any) => {
				toast.success(data.register.message)
				resolve(data)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingRegister.value = false
			})
		})
	}

	const checkVerify = async (code: string) => {
		loadingUser.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: checkVerifyCode,
				fetchPolicy: 'no-cache',
				variables: {
					code,
				},
			}).then(({ data }: any) => {
				resolve(data)
				user.value = data.checkVerifyCode
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingUser.value = false
			})
		})
	}

	const verifyAccount = async (id: number, data: any) => {
		loadingVerify.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: verifyUser,
				variables: {
					id,
					data,
				},
			}).then(({ data }: any) => {
				toast.success(data.verifyUser.message)
				resolve(data)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingVerify.value = false
			})
		})
	}

	const getProfileInfo = async (): Promise<any> => {
		loadingProfile.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: profileInfo,
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				user.value = data.profileInfo
				authStore.set(data.profileInfo)
			}).catch((error: any) => {
				reject(error)
				authStore.reset()
			}).finally(() => {
				loadingProfile.value = false
			})
		})
	}

	const updateProfile = async (data: any) => {
		loadingEditProfile.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: editProfile,
				variables: {
					data,
				},
			}).then(({ data }: any) => {
				toast.success(data.editProfile.message)
				resolve(data)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingEditProfile.value = false
			})
		})
	}

	const updatePassword = async (data: any) => {
		loadingEditPassword.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: editProfile,
				variables: {
					data,
				},
			}).then(({ data }: any) => {
				toast.success(data.editProfile.message)
				resolve(data)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingEditPassword.value = false
			})
		})
	
	}

	const signIn = async (email: string, password: string) => {
		loadingLogin.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: login,
				variables: {
					email,
					password,
				},
			}).then(({ data }) => {
				toast.success(data.login.message)
				localStorage.setItem('token', data.login.data)

				// getProfileInfo()
				resolve(data)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingLogin.value = false
			})
		})
	}

	const signOut = async () => {
		loadingLogout.value = true

		authStore.logout()
		toast.success('Berhasil Log Out')

		loadingLogout.value = false
	}

	return {
		loadingRegister,
		register,

		checkVerify,
		loadingUser,
		user,

		verifyAccount,
		loadingVerify,

		signIn,
		loadingLogin,

		getProfileInfo,
		loadingProfile,

		updateProfile,
		loadingEditProfile,

		updatePassword,
		loadingEditPassword,

		signOut,
		loadingLogout,
	}
}

export default useUser