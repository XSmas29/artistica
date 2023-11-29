import { apolloClient } from '@/vue-apollo'
import { materials } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'

const useMaterial = () => {
	const loadingMaterialList = ref(false)
	const materialList = ref([] as any[])

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

	return {
		materialList,
		loadingMaterialList,
		getMaterialList,
	}
}

export default useMaterial