export const formatCurrency = (value: number, currency = 'IDR') => {
	if (!value) return value
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	})

	return formatter.format(value)
}

export const formatETD = (value: string) => {
	const date = Intl.DateTimeFormat('id-ID', {
		month: 'short',
		day: 'numeric',
	})

	const arr = value.split('-')
	console.log(arr)
	if (arr.length === 2 && arr[0] === arr[1]) arr.pop()
	console.log(arr)
	const formatted = arr.map(item => {
		if (item === '0') return 'hari ini'
		if (item === '1') return 'besok'
		else {
			const d = new Date()
			d.setDate(d.getDate() + parseInt(item))
			
			return date.format(d)
		}
	})
	
	return `Estimasi tiba ${formatted.join(' - ')}`
	
	// if (!value) return 
	// if (value === '0') return 'Estimasi tiba hari ini'
	// if (value === '1') return 'Estimasi tiba besok'
	// else if (value.includes('-')) {
	// 	const [min, max] = value.split('-')
	// 	if (min === max && min === '0') return 'Estimasi tiba hari ini'
	// 	else if (min === max && min === '1') return 'Estimasi tiba besok'
	// 	else if (min === max) return `Estimasi tiba ${min} hari`
	// 	else if (min === '0' && max === '1') return 'Estimasi tiba hari ini - besok'
	// 	else if (min === '1' && max === '2') return `Estimasi tiba besok - ${max} hari}`
	// 	else return `Estimasi tiba ${min === '0' ? 'hari ini' : min === '1' ? 'besok' : min} - ${max === '1' ? 'besok' : max} hari`
	// }
	// else return `Estimasi tiba ${value} Hari`
}