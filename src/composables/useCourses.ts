import { ref } from 'vue'
import { apolloClient } from '@/vue-apollo'
import { toast } from '@helpers/utils'

const useCourses = () => {
	const courseList = ref([] as any)

	const loadingCourseList = ref(false)

	const getCourseList = async () => {
		loadingCourseList.value = true
  
		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: courseList,
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				courseList.value = data.courseList
				loadingCourseList.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingCourseList.value = false
			})
		})
	}

	return {
		courseList,
		loadingCourseList,
		getCourseList,
	}
}

export default useCourses