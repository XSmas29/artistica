import { apolloClient } from "@/vue-apollo"
import { ref } from "vue"
import { login, register as signUp, verifyUser } from "@graphql/mutations"
import { checkVerifyCode, profileInfo } from "@graphql/queries"
import Vue from "vue"
import { toast } from "@/helpers/utils"
import { useAuthStore } from "@/store/modules/authStore"

const useUser = () => {
  const authStore = useAuthStore()
  const user = ref(null as any)

  const loadingRegister = ref(false)
  const loadingVerify = ref(false)
  const loadingUser = ref(false)
  const loadingLogin = ref(false)
  const loadingProfile = ref(false)

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

  const checkVerify = (code: string) => {
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

  const verifyAccount = (id: number, data: any) => {
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

  const getProfileInfo = () => {
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
  const signIn = (email: string, password: string) => {
    loadingLogin.value = true

    return new Promise((resolve, reject) => {
      apolloClient.mutate({
        mutation: login,
        variables: {
          email,
          password,
        },
      }).then(({ data }: any) => {
        toast.success(data.login.message)
        localStorage.setItem('token', data.login.data)
        resolve(data)
      }).catch((error: any) => {
        reject(error)
        toast.error(error.message)
      }).finally(() => {
        loadingLogin.value = false
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
  }
}

export default useUser