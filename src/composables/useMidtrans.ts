import { initSnap, useSnap } from 'midtrans-snap'

const useMidtrans = () => {

	// You need run this once
	initSnap('YOUR_CLIENT_KEY', 'sandbox'/* or 'production' */)

	// Later, you can call useSnap() anywhere
	const snap = useSnap()
	
	return {
		snap
	}
}

export default useMidtrans