import { ref } from 'vue'
import { apolloClient } from '@/vue-apollo'
import { toast } from '@helpers/utils'
import { addCustomTransaction, updateCustomTransactionBasicInfo } from '@graphql/mutations'
import { customTransactionDetail } from '@graphql/queries'

const useCustomTransaction = () => {
	const customTransactionData = ref({}) as any

	const loadingCreateCustomTransaction = ref(false)
	const loadingEditCustomTransactionBasicInfo = ref(false)
	const loadingCustomTransactionDetail = ref(false)

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

	const editCustomTransactionBasicInfo = async (id: number, data: any) => {
		loadingEditCustomTransactionBasicInfo.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: updateCustomTransactionBasicInfo,
				variables: {
					id,
					data,
				},
			}).then(({ data }: any) => {
				resolve(data)
				toast.success(data.updateCustomTransactionBasicInfo.message)
				loadingEditCustomTransactionBasicInfo.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingEditCustomTransactionBasicInfo.value = false
			})
		})
	}

	const getCustomTransactionDetail = async (id: number) => {
		loadingCustomTransactionDetail.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: customTransactionDetail,
				variables: {
					id,
				},
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				console.log(data)
				customTransactionData.value = data.customTransactionDetail
				loadingCustomTransactionDetail.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingCustomTransactionDetail.value = false
			})
		})
	}

	return {
		loadingCreateCustomTransaction,
		createCustomTransaction,

		loadingEditCustomTransactionBasicInfo,
		editCustomTransactionBasicInfo,

		loadingCustomTransactionDetail,
		customTransactionData,
		getCustomTransactionDetail,
	}
}

export default useCustomTransaction