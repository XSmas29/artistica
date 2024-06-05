import { apolloClient } from '@/vue-apollo'
import { transactionStatuses, transactions } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'

const useTransaction = () => {
	const loadingTransactionStatusList = ref(false)
	const transactionStatusList = ref([] as any[])

	const loadingTransactionList = ref(false)
	const transactionList = ref([] as any[])
	const transactionCount = ref(0)

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

	const getTransactionList = async (filter: any, sort: any, pagination: any) => {
		loadingTransactionList.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: transactions,
				variables: {
					filter,
					pagination,
					sort: {
						field: sort.field,
						sort: sort.sort,
					},
				},
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				transactionList.value = data.transactions.transactions
				transactionCount.value = data.transactions.count
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingTransactionList.value = false
			})
		})
  
	}

	return {
		loadingTransactionStatusList,
		transactionStatusList,
		getTransactionStatusList,

		loadingTransactionList,
		transactionList,
		transactionCount,
		getTransactionList,
	}
}

export default useTransaction