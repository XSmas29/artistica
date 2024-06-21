import { ref } from 'vue'
import { apolloClient } from '@/vue-apollo'
import { toast } from '@helpers/utils'
import { chats } from '@graphql/queries'

const useChat = () => {
	const loadingChatList = ref(false)
	const chatList = ref([] as any)

	const getChatList = async () => {
		loadingChatList.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: chats,
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				chatList.value = data.chats
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
			}).finally(() => {
				loadingChatList.value = false
			})
		})
	}

	return {
		loadingChatList,
		chatList,
		getChatList,
	}
}

export default useChat