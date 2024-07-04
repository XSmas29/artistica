import { apolloClient } from '@/vue-apollo'
import { ref } from 'vue'
import { login, register as signUp, verifyUser, editProfile, editPassword } from '@graphql/mutations'
import { checkVerifyCode, profileInfo, refreshToken, users } from '@graphql/queries'
import { toast } from '@/helpers/utils'
import { useAuthStore } from '@/store/modules'

const useUser = () => {
	const authStore = useAuthStore()
	const user = ref(null as any)
	const userList = ref([] as any[])
	const userCount = ref(0)

	const loadingRegister = ref(false)
	const loadingVerify = ref(false)
	const loadingUser = ref(false)
	const loadingAuth = ref(false)
	const loadingLogin = ref(false)
	const loadingLogout = ref(false)
	const loadingProfile = ref(false)
	const loadingEditProfile = ref(false)
	const loadingEditPassword = ref(false)
	const loadingUserList = ref(false)

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
				loadingRegister.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
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
				loadingUser.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
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
				loadingVerify.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
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
				resolve(data.profileInfo)
				user.value = data.profileInfo
				authStore.set(data.profileInfo)
				loadingProfile.value = false
			}).catch((error: any) => {
				reject(error)
				authStore.reset()
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
				loadingEditProfile.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingEditProfile.value = false
			})
		})
	}

	const updatePassword = async (data: any) => {
		loadingEditPassword.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: editPassword,
				variables: {
					data,
				},
			}).then(({ data }: any) => {
				toast.success(data.editPassword.message)
				resolve(data)
				loadingEditPassword.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
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
				localStorage.setItem('token', data.login.token)
				localStorage.setItem('refresh_token', data.login.refresh_token)
				resolve(data)
				loadingLogin.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
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

	const refreshAuthToken = async (refresh_token: string) => {
		loadingAuth.value = true

		// localStorage.removeItem('token')
		// localStorage.removeItem('refresh_token')

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: refreshToken,
				fetchPolicy: 'no-cache',
				variables: {
					refresh_token,
				},
			}).then(({ data }: any) => {
				localStorage.setItem('token', data.refreshToken.token)
				localStorage.setItem('refresh_token', data.refreshToken.refresh_token)
				resolve(data)
				loadingAuth.value = false
			}).catch((error: any) => {
				reject(error)
				loadingAuth.value = false
			})
		})
	}

	const getUserList = async (filter: any, pagination: any) => {
		loadingUserList.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: users,
				fetchPolicy: 'no-cache',
				variables: {
					filter,
					pagination,
				},
			}).then(({ data }: any) => {
				userList.value = data.users.users
				userCount.value = data.users.count
				resolve(data)
				loadingUserList.value = false
			}).catch((error: any) => {
				reject(error)
				loadingUserList.value = false
			})
		})
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

		refreshAuthToken,
		loadingAuth,
		
		getUserList,
		loadingUserList,
		userList,
		userCount,
	}
}

export default useUser