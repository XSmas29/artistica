import { apolloClient } from "@/vue-apollo"
import { ref } from "vue"
import { register as signUp } from "@graphql/mutations"
import Vue from "vue"
import { toast } from "@/helpers/util"

const useUser = () => {
  const loadingRegister = ref(false)

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

  return {
    loadingRegister,
    register,
  }
}

export default useUser