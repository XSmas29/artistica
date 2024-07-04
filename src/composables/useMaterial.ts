import { apolloClient } from '@/vue-apollo'
import { addMaterial, deleteMaterial, updateMaterial } from '@graphql/mutations'
import { materials } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'

const useMaterial = () => {
	const loadingMaterialList = ref(false)
	const materialList = ref([] as any[])
	const materialCount = ref(0)

	const loadingCreateMaterial = ref(false)
	const loadingRemoveMaterial = ref(false)
	const loadingEditMaterial = ref(false)

	const getMaterialList = async (filter?: any, pagination?: any) => {
		loadingMaterialList.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: materials,
				fetchPolicy: 'no-cache',
				variables: {
					pagination,
					filter,
				},
			}).then(({ data }: any) => {
				resolve(data)
				materialList.value = data.materials.materials
				materialCount.value = data.materials.count
				loadingMaterialList.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingMaterialList.value = false
			})
		})
	}

	const createMaterial = async (data: any) => {
		loadingCreateMaterial.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: addMaterial,
				variables: {
					data,
				},
			}).then(({ data }: any) => {
				resolve(data)
				toast.success(data.addMaterial.message)
				loadingCreateMaterial.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingCreateMaterial.value = false
			})
		})
	}

	const removeMaterial = async (id: number) => {
		loadingRemoveMaterial.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: deleteMaterial,
				variables: {
					id,
				},
			}).then(({ data }: any) => {
				resolve(data)
				toast.success(data.deleteMaterial.message)
				loadingRemoveMaterial.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingRemoveMaterial.value = false
			})
		})
	}

	const editMaterial = async (id: number, data: any) => {
		loadingEditMaterial.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: updateMaterial,
				variables: {
					id,
					data,
				},
			}).then(({ data }: any) => {
				resolve(data)
				toast.success(data.updateMaterial.message)
				loadingEditMaterial.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingEditMaterial.value = false
			})
		})
	}

	return {
		materialList,
		materialCount,
		loadingMaterialList,
		getMaterialList,

		loadingCreateMaterial,
		createMaterial,

		loadingRemoveMaterial,
		removeMaterial,

		loadingEditMaterial,
		editMaterial,
	}
}

export default useMaterial