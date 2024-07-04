import { ref } from 'vue'
import { apolloClient } from '@/vue-apollo'
import { toast } from '@helpers/utils'
import { chatMessages, chats } from '@graphql/queries'
import { addChatMessage } from '@graphql/mutations'

const useChat = () => {

	const loadingChatList = ref(false)
	const chatList = ref([] as any)

	const loadingCreateChatMessage = ref(false)

	const loadingChatMessages = ref(false)
	const chatMessageList = ref([] as any)

	const getChatList = async () => {
		loadingChatList.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: chats,
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				chatList.value = data.chats
				loadingChatList.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingChatList.value = false
			})
		})
	}

	const createChatMessage = async (data: any) => {
		loadingCreateChatMessage.value = true

		return new Promise((resolve, reject) => {
			apolloClient.mutate({
				mutation: addChatMessage,
				variables: {
					data,
				},
			}).then(({ data }: any) => {
				resolve(data)
				toast.success(data.addChatMessage.message)
				loadingCreateChatMessage.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingCreateChatMessage.value = false
			})
		})
	}

	const getChatMessages = async (chatId: number) => {
		loadingChatMessages.value = true

		return new Promise((resolve, reject) => {
			apolloClient.query({
				query: chatMessages,
				variables: {
					chat_id: chatId,
				},
				fetchPolicy: 'no-cache',
			}).then(({ data }: any) => {
				resolve(data)
				loadingChatMessages.value = false
				chatMessageList.value = data.chatMessages
				loadingChatMessages.value = false
			}).catch((error: any) => {
				reject(error)
				toast.error(error.message)
				loadingChatMessages.value = false
			})
		})
	}

	return {
		loadingChatList,
		chatList,
		getChatList,

		loadingCreateChatMessage,
		createChatMessage,

		loadingChatMessages,
		chatMessageList,
		getChatMessages,
	}
}

export default useChat