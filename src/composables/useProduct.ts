import { apolloClient } from '@/vue-apollo'
import { productDetail, products } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'
import { filterProducts, pagination, sort } from './types'

const useUser = () => {
	const productList = ref([] as any[])
	const productCount = ref(0)
	const loadingProductList = ref(false)

	const product = ref({}) as any
	const loadingProductDetail = ref(false)

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

	return {
		productList,
		productCount,
		loadingProductList,
		getProductList,

		product,
		loadingProductDetail,
		getProductDetail,
	}
}

export default useUser