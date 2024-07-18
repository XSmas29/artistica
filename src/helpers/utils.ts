import router from '@/router'
import { useToast } from 'vue-toastification'

const productPlaceholder = new URL('@assets/default-product.jpg', import.meta.url).href

const toast = useToast()
const goTo = (name: string) => {
	router.push({ name })
}

const getInitials = (input: string): string => {
	const words = input.trim().split(/\s+/)

	if (words.length === 1) {
		return words[0].substring(0, 2).toUpperCase()
	} else if (words.length >= 2) {
		return (words[0][0] + words[1][0]).toUpperCase()
	}

	return ''
}

const formatCurrency = (value: number, currency = 'IDR'): string => {
	if (!value) return ''
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	})

	return formatter.format(value)
}

const formatVariantName = (val: any): string => {
	return val.map((item: any) => item.option.name).join(', ')
}

const transactionStatusColor = (status_id: number): string => {
	switch (status_id) {
	case 1:
		return 'grey'
	case 2:
		return 'orange'
	case 3:
		return 'blue'
	case 4:
		return 'cyan'
	case 5:
		return 'error'
	case 6:
		return 'success'
	default:
		return 'grey'
	}
}

const priceRange = (variants: any): string => {
	if (variants.length === 1) {
		return formatCurrency(variants[0].price)
	} else {
		const price_min = variants.reduce((prev: any, curr: any) => prev.price < curr.price ? prev : curr)
		const price_max = variants.reduce((prev: any, curr: any) => prev.price > curr.price ? prev : curr)
		if (price_min.price === price_max.price) {
			return formatCurrency(price_min.price)
		}
		
		return `${formatCurrency(price_min.price)} - ${formatCurrency(price_max.price)}`
	}
}

const totalStock = (variants: any): number => {
	return variants.reduce((prev: any, curr: any) => prev + curr.stock, 0)
}

const formatDate = (value: string): string => {
	const date = Intl.DateTimeFormat('id-ID', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})

	return date.format(new Date(value))
}

const formatDateTime = (value: string): string => {
	const date = Intl.DateTimeFormat('id-ID', {
		dateStyle: 'medium',
		timeStyle: 'short'
	})

	return date.format(new Date(value))
}

const formatETD = (value: string): string => {
	const date = Intl.DateTimeFormat('id-ID', {
		month: 'short',
		day: 'numeric',
	})

	const arr = value.split('-')
	if (arr.length === 2 && arr[0] === arr[1]) arr.pop()
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
}

export {
	productPlaceholder,
	toast,
	goTo,
	getInitials,
	formatCurrency,
	formatVariantName,
	priceRange,
	totalStock,
	formatDate,
	formatDateTime,
	formatETD,
	transactionStatusColor,
}