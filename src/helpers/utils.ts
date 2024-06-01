import router from '@/router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const goTo = (name: string) => {
	router.push({ name })
}

export {
	toast,
	goTo,
}