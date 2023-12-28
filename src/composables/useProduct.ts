import { apolloClient } from '@/vue-apollo'
import { cartData, productDetail, products } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'
import { filterProducts, pagination, sort } from './types'
import { addProduct } from '@graphql/mutations'

const useUser = () => {
	const productList = ref([] as any[])
	const productCount = ref(0)
	const loadingProductList = ref(false)

	const cartItems = ref([] as any[])
	const loadingCartItems = ref(false)

	const product = ref({}) as any
	const loadingProductDetail = ref(false)

	const loadingCreateProduct = ref(false)

	const getProductList = async (filter: filterProducts, pagination: pagination, sort: sort) => {
		loadingProductList.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: products,
				fetchPolicy: 'no-cache',
				variables: {
					filter,
					pagination,
					sort: {
						field: sort.field,
						sort: sort.sort,
					},
				},
			}).then(({ data }: any) => {
				resolve(data)
				productList.value = data.products.products
				console.log(data.products.products)
				productCount.value = data.products.count
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingProductList.value = false
			})
		})
	}

	const getProductDetail = async (id: number) => {
		loadingProductDetail.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: productDetail,
				fetchPolicy: 'no-cache',
				variables: {
					id,
				},
			}).then(({ data }: any) => {
				product.value = data.productDetail
				resolve(data)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingProductDetail.value = false
			})
		})
	}

	const getCartData = async (data: any[]) => {
		loadingCartItems.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: cartData,
				fetchPolicy: 'no-cache',
				variables: {
					data,
				},
			}).then(({ data }: any) => {
				cartItems.value = data.cartData
				console.log(cartItems)
				resolve(data)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingCartItems.value = false
			})
		})
	}

	const createProduct = async (data: any) => {
		loadingCreateProduct.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: addProduct,
				variables: {
					data,
				},
			}).then(({ data }: any) => {
				toast.success(data.addProduct.message)
				resolve(data)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingCreateProduct.value = false
			})
		})
	}

	return {
		productList,
		productCount,
		loadingProductList,
		getProductList,

		product,
		loadingProductDetail,
		getProductDetail,

		cartItems,
		loadingCartItems,
		getCartData,

		loadingCreateProduct,
		createProduct,
	}
}

export default useUser