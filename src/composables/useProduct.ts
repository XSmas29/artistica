import { apolloClient } from '@/vue-apollo'
import { products } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'
import { filterProducts, pagination, sort } from './types'

const useUser = () => {
	const productList = ref([] as any[])
	const productCount = ref(0)
	const loadingProductList = ref(false)

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

	return {
		productList,
		loadingProductList,
		getProductList,
	}
}

export default useUser