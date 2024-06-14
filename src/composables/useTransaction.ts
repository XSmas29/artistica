import { apolloClient } from '@/vue-apollo'
import { transactionStatuses, transactions, transactionDetail as transDetail } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'

const useTransaction = () => {
	const loadingTransactionStatusList = ref(false)
	const transactionStatusList = ref([] as any[])

	const loadingTransactionList = ref(false)
	const transactionList = ref([] as any[])
	const transactionCount = ref(0)

	const loadingTransactionDetail = ref(false)
	const transactionDetail = ref({} as any)

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

	const getTransactionDetail = async (transaction_id: string) => {
		loadingTransactionDetail.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: transDetail,
				variables: {
					transaction_id,
				},
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				transactionDetail.value = data.transactionDetail
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingTransactionDetail.value = false
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

		loadingTransactionDetail,
		transactionDetail,
		getTransactionDetail,
	}
}

export default useTransaction