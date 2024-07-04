import { apolloClient } from '@/vue-apollo'
import { addCategory, deleteCategory, updateCategory } from '@graphql/mutations'
import { categories } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'

const useCategory = () => {
	const loadingCategoryList = ref(false)
	const categoryList = ref([] as any[])
	const categoryCount = ref(0)

	const loadingCreateCategory = ref(false)
	const loadingRemoveCategory = ref(false)
	const loadingEditCategory = ref(false)

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
				loadingCategoryList.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
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
				loadingCreateCategory.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
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
				loadingRemoveCategory.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingRemoveCategory.value = false
			})
		})
	}

	const editCategory = async (id: number, data: any) => {
		loadingEditCategory.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: updateCategory,
				variables: {
					id,
					data,
				},
			}).then(({ data }: any) => {
				resolve(data)
				toast.success(data.updateCategory.message)
				loadingEditCategory.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingEditCategory.value = false
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

		loadingEditCategory,
		editCategory,
	}
}

export default useCategory