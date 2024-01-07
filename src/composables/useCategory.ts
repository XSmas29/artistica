import { apolloClient } from '@/vue-apollo'
import { addCategory, deleteCategory } from '@graphql/mutations'
import { categories } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'

const useCategory = () => {
	const loadingCategoryList = ref(false)
	const categoryList = ref([] as any[])
	const categoryCount = ref(0)

	const loadingCreateCategory = ref(false)
	const loadingRemoveCategory = ref(false)

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

	const createCategory = async (data: any) => {
		loadingCreateCategory.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: addCategory,
				variables: {
					data,
				},
			}).then(({ data }: any) => {
				resolve(data)
				toast.success(data.addCategory.message)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingCreateCategory.value = false
			})
		})
	}

	const removeCategory = async (id: number) => {
		loadingRemoveCategory.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: deleteCategory,
				variables: {
					id,
				},
			}).then(({ data }: any) => {
				resolve(data)
				toast.success(data.deleteCategory.message)
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingRemoveCategory.value = false
			})
		})
	
	}

	return {
		categoryCount,
		categoryList,
		loadingCategoryList,
		getCategoryList,

		loadingCreateCategory,
		createCategory,

		loadingRemoveCategory,
		removeCategory,
	}
}

export default useCategory