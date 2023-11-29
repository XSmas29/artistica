export const formatCurrency = (value: number, currency = 'IDR') => {
	if (!value) return value
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	})

	return formatter.format(value)
}