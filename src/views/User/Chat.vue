<template>
  <v-layout>
    <v-card
      variant="flat"
      border
      class="d-flex"
      style="height: 700px"
    >
      <ChatList @select-chat="setActiveChat" />
      <v-divider vertical />
      <ChatWindow :active-chat="activeChat" />
    </v-card>
  </v-layout>
</template>
<script lang="ts">
import ChatList from '@/components/chat/ChatList.vue'
import ChatWindow from '@/components/chat/ChatWindow.vue'
import { onMounted, provide, ref } from 'vue'
import ioClient from '@/helpers/SocketIO'

export default {
	components: {
		ChatList,
		ChatWindow,
	},
	setup() {
		
		const showChatNavBar = ref(false)
		const activeChat = ref({})

		onMounted(() => {
			showChatNavBar.value = !showChatNavBar.value
		})

		const setActiveChat = (chat: any) => {
			activeChat.value = chat
			console.log('tes')
			ioClient.emit('connect_to_chat', {chat_id: chat.id})
		}

		provide('showChatNavBar', showChatNavBar)

		return {
			activeChat,
			setActiveChat
		}
	},
}
</script>