import { ref } from 'vue'
import { apolloClient } from '@/vue-apollo'
import { toast } from '@helpers/utils'
import { addCustomTransaction } from '@graphql/mutations'

const useCustomTransaction = () => {
	const loadingCreateCustomTransaction = ref(false)

	const createCustomTransaction = async (data: any) => {
		loadingCreateCustomTransaction.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: addCustomTransaction,
				variables: {
					data,
				},
			}).then(({ data }: any) => {
				resolve(data)
				toast.success(data.addCustomTransaction.message)
				loadingCreateCustomTransaction.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingCreateCustomTransaction.value = false
			})
		})
	}

	return {
		loadingCreateCustomTransaction,
		createCustomTransaction
	}
}

export default useCustomTransaction