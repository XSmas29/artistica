import { apolloClient } from '@/vue-apollo'
import { cartData, productDetail, products } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'
import { filterProducts, pagination, sort } from './types'
import { addProduct, deleteProduct, updateProduct } from '@graphql/mutations'

const useProduct = () => {
	const productList = ref([] as any[])
	const productCount = ref(0)
	const loadingProductList = ref(false)

	const cartItems = ref([] as any[])
	const loadingCartItems = ref(false)

	const productData = ref({}) as any
	const loadingProductDetail = ref(false)

	const loadingCreateProduct = ref(false)
	const loadingEditProduct = ref(false)
	const loadingRemoveProduct = ref(false)

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
				productData.value = data.productDetail
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

	const editProduct = async (id: number, data: any) => {
		loadingEditProduct.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: updateProduct,
				variables: {
					id,
					data,
				},
			}).then(({ data }: any) => {
				toast.success(data.updateProduct.message)
				resolve(data)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingEditProduct.value = false
			})
		})
	}

	const removeProduct = async (id: number) => {
		loadingRemoveProduct.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: deleteProduct,
				variables: {
					id,
				},
			}).then(({ data }: any) => {
				toast.success(data.deleteProduct.message)
				resolve(data)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingRemoveProduct.value = false
			})
		})
	}

	return {
		productList,
		productCount,
		loadingProductList,
		getProductList,

		productData,
		loadingProductDetail,
		getProductDetail,

		cartItems,
		loadingCartItems,
		getCartData,

		loadingCreateProduct,
		createProduct,

		loadingEditProduct,
		editProduct,

		loadingRemoveProduct,
		removeProduct,
	}
}

export default useProduct