import { apolloClient } from '@/vue-apollo'
import { categories } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'

const useCategory = () => {
	const loadingCategoryList = ref(false)
	const categoryList = ref([] as any[])
	const categoryCount = ref(0)

	const getCategoryList = async (filter?: any, pagination?: any) => {
		loadingCategoryList.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: categories,
				fetchPolicy: 'no-cache',
				variables: {
					pagination,
					filter,
				},
			}).then(({ data }: any) => {
				resolve(data)
				categoryList.value = data.categories.categories
				categoryCount.value = data.categories.count
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingCategoryList.value = false
			})
		})
	}

	return {
		categoryCount,
		categoryList,
		loadingCategoryList,
		getCategoryList,
	}
}

export default useCategory