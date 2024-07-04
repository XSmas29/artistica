import router from '@/router'
import { apolloClient } from '@/vue-apollo'
import { addTransactionMT, addTransaction } from '@graphql/mutations'
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
		shipping_detail?: any,
		customer_detail?: any,
		credit_card?: any,
	) => {
		loadingCreateTransaction.value = true

		const { total_product_cost, ...transaction_detail_MT } = transaction_detail
		console.log(transaction_detail_MT)

		const item_details_MT = item_details.map((item: any) => ({
			id: item.id,
			price: item.price,
			quantity: item.quantity,
			name: item.name,
		}))

		item_details_MT.push(shipping_detail)

		const tokenData = await apolloClient.mutate({
			mutation: addTransactionMT,
			variables: {
				transaction_detail: transaction_detail_MT,
				item_details: item_details_MT,
				customer_detail,
				credit_card,
			},
		})

		console.log(shipping_detail)

		await apolloClient.mutate({
			mutation: addTransaction,
			variables: {
				transaction_data: {
					transaction_id: transaction_detail.order_id,
					total_price: total_product_cost,
					shipping_cost: shipping_detail.price,
					shipping_service: shipping_detail.name,
					shipping_address: customer_detail.billing_address.address,
					shipping_city: customer_detail.billing_address.city,
					shipping_postal_code: customer_detail.billing_address.postal_code,
					customer_phone: customer_detail.phone,
					customer_name: (customer_detail.first_name + ' ' + customer_detail.last_name).trim(),
					customer_email: customer_detail.email,
					status: '0',
				},
				item_data: item_details.map((item: any) => ({
					variant_id: +item.id,
					price: +item.price,
					quantity: +item.quantity,
				})),
			},
		})
		
		return new Promise((resolve, reject) => {
			snap.pay(tokenData.data.addTransactionMT.token)
				.then(({ data }: any) => {
					resolve(data)
					router.push({ name: 'payment-success' })
					loadingCreateTransaction.value = false
				}).catch((error: any) => {
					reject(error)
					toast.error(error.message)
					router.push({ name: 'payment-failed' })
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