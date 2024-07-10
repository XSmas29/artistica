import { ref } from 'vue'
import { apolloClient } from '@/vue-apollo'
import { toast } from '@helpers/utils'
import { courseDetail, courses } from '@graphql/queries'

const useCourse = () => {
	const courseList = ref([] as any)
	const loadingCourseList = ref(false)

	const courseData = ref({}) as any
	const loadingCourseDetail = ref(false)

	const getCourseList = async () => {
		loadingCourseList.value = true
  
		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: courses,
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				courseList.value = data.courses
				loadingCourseList.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingCourseList.value = false
			})
		})
	}

	const getCourseDetail = async (id: number) => {
		loadingCourseDetail.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: courseDetail,
				fetchPolicy: 'no-cache',
				variables: {
					id,
				},
			}).then(({ data }: any) => {
				resolve(data)
				courseData.value = data.courseDetail
				loadingCourseDetail.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingCourseDetail.value = false
			})
		})
	}

	return {
		courseList,
		loadingCourseList,
		getCourseList,

		courseData,
		loadingCourseDetail,
		getCourseDetail,
	}
}

export default useCourse