import { apolloClient } from '@/vue-apollo'
import { transactionStatuses } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'

const useTransaction = () => {
	const loadingTransactionStatusList = ref(false)
	const transactionStatusList = ref([] as any[])

	const getTransactionStatusList = async () => {
		loadingTransactionStatusList.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: transactionStatuses,
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				transactionStatusList.value = data.transactionStatuses
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingTransactionStatusList.value = false
			})
		})
	}

	return {
		loadingTransactionStatusList,
		transactionStatusList,
		getTransactionStatusList,
	}
}

export default useTransaction