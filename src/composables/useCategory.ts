import { apolloClient } from '@/vue-apollo'
import { categories } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'

const useCategory = () => {
	const loadingCategoryList = ref(false)
	const categoryList = ref([] as any[])

	const getCategoryList = async () => {
		loadingCategoryList.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: categories,
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				categoryList.value = data.categories
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingCategoryList.value = false
			})
		})
	}

	return {
		categoryList,
		loadingCategoryList,
		getCategoryList,
	}
}

export default useCategory