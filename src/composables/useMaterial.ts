import { apolloClient } from '@/vue-apollo'
import { addMaterial, deleteMaterial, updateMaterial } from '@graphql/mutations'
import { materials } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'

const useMaterial = () => {
	const loadingMaterialList = ref(false)
	const materialList = ref([] as any[])

	const loadingCreateMaterial = ref(false)
	const loadingRemoveMaterial = ref(false)
	const loadingEditMaterial = ref(false)

	const getMaterialList = async () => {
		loadingMaterialList.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: materials,
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				materialList.value = data.materials
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
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
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
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
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
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
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingEditMaterial.value = false
			})
		})
	}

	return {
		materialList,
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