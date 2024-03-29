import { apolloClient } from '@/vue-apollo'
import { addTransactionMT } from '@graphql/mutations'
import { toast } from '@helpers/utils'
import { initSnap, useSnap } from 'midtrans-snap'
import { ref } from 'vue'

const useMidtrans = () => {

	const loadingCreateTransaction = ref(false)

	// You need run this once
	initSnap(import.meta.env.VITE_MIDTRANS_CLIENT_KEY, 'sandbox'/* or 'production' */)

	// Later, you can call useSnap() anywhere
	const snap = useSnap()

	const createTransaction = async (
		transaction_detail: any,
		item_details?: any,
		customer_detail?: any,
		credit_card?: any,
	) => {
		loadingCreateTransaction.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: addTransactionMT,
				variables: {
					transaction_detail,
					item_details,
					customer_detail,
					credit_card,
				},
			}).then(({ data }: any) => {
				resolve(data)
				snap.pay(data.addTransactionMT.token)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingCreateTransaction.value = false
			})
		})
	}
	
	return {
		snap,

		loadingCreateTransaction,
		createTransaction,
	}
}

export default useMidtrans