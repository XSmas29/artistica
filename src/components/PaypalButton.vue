<template>
  <div>
    <div
      ref="paypalButton"
      id="paypalButton"
    />
  </div>
</template>
<script lang="ts">
import { PayPalNamespace } from '@paypal/paypal-js'
import usePaypal from '@composables/usePaypal'
import { onMounted, ref } from 'vue'

export default {
	setup() {
		const { getPaypal } = usePaypal()
		const paypal = ref(null as PayPalNamespace | null)

		const renderButton = () => {
			if (paypal.value && paypal.value.Buttons) {
				paypal.value.Buttons({
					style: {
						layout: 'horizontal',
						color: 'black',
						shape: 'rect',
						label: 'pay',
						disableMaxWidth: true,
						height: 42,
						tagline: false,
					},
					createOrder: function (data: any, actions: any) {
						return actions.order.create({
							purchase_units: [{
								amount: {
									value: '0.1'
								},
							}]
						})
					},
					onApprove: function (data: any, actions: any) {
						return actions.order.capture().then(function (details: any) {
							console.log(details)
							alert('Transaction completed by ' + details.payer.name.given_name)
						})
					},
				}).render('#paypalButton')
			}
		}

		onMounted(() => {
			getPaypal().then(paypalInstance => {
				paypal.value = paypalInstance
				renderButton()
			})
		})

		return {
		}
	}
}
</script>
