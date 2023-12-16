import { apolloClient } from '@/vue-apollo'
import { cities, deliveryProviders, provinces } from '@graphql/queries'
import { toast } from '@helpers/utils'
import { ref } from 'vue'

const useDelivery = () => {
	const loadingProvinces = ref(false)
	const loadingCities = ref(false)
	const loadingProviders = ref(false)

	const provincesList = ref([] as any[])
	const citiesList = ref([] as any[])
	const providersList = ref([] as any[])

	const getProvinces = async () => {
		loadingProvinces.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: provinces,
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				provincesList.value = data.provinces
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingProvinces.value = false
			})
		})
	}

	const getCities = async (provinceId: number) => {
		loadingCities.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: cities,
				fetchPolicy: 'no-cache',
				variables: {
					provinceId,
				},
			}).then(({ data }: any) => {
				resolve(data)
				citiesList.value = data.cities
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingCities.value = false
			})
		})
	}

	const getDeliveryProviders = async () => {
		loadingProviders.value = true
      
		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: deliveryProviders,
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				providersList.value = data.deliveryProviders
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingProviders.value = false
			})
		})
	}

	return {
		getProvinces,
		loadingProvinces,
		provincesList,

		getCities,
		loadingCities,
		citiesList,

		getDeliveryProviders,
		loadingProviders,
		providersList,
	}
}

export default useDelivery