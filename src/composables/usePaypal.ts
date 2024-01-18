import { loadScript } from '@paypal/paypal-js'

const usePaypal = () => {
	const getPaypal = async () => {
		const instance = await loadScript({
			'clientId': 'sb',
		})

		return instance
	}

	return {
		getPaypal,
	}
}

export default usePaypal