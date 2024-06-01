import router from '@/router'
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

		const tokenData = await apolloClient.mutate({
			mutation: addTransactionMT,
			variables: {
				transaction_detail,
				item_details,
				customer_detail,
				credit_card,
			},
		})
		
		return new Promise((resolve, reject) => {
			snap.pay(tokenData.data.addTransactionMT.token)
				.then(({ data }: any) => {
					resolve(data)
					router.push({ name: 'payment-success' })
				}).catch((error: any) => {
					reject(error)
					toast.error(error.message)
					router.push({ name: 'payment-failed' })
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