import { apolloClient } from "@/vue-apollo"
import { ref } from "vue"
import { register as signUp, verifyUser } from "@graphql/mutations"
import { checkVerifyCode } from "@graphql/queries"
import Vue from "vue"
import { toast } from "@/helpers/utils"

const useUser = () => {
  const user = ref(null as any)

  const loadingRegister = ref(false)
  const loadingVerify = ref(false)
  const loadingUser = ref(false)

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

  return {
    loadingRegister,
    register,

    checkVerify,
    loadingUser,
    user,

    verifyAccount,
    loadingVerify,
  }
}

export default useUser