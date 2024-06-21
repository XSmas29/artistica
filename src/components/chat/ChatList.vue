<template>
  <v-card
    class="elevation-0"
  >
    {{ chatList }}
    <v-navigation-drawer
      :permanent="!smAndDown"
    >
      <v-list
        nav
      >
        <v-list-item
          v-for="(chat, i) in chatList"
          :key="i"
          :title="chat.title"
          :value="chat.id"
        />
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>
<script lang="ts">
import { onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import useChats from '@/composables/useChat'

export default {
	setup() {
		const { smAndDown } = useDisplay()
		const { chatList, loadingChatList, getChatList } = useChats()
		const showChatList = ref(true)
    
		onMounted(() => {
			getChatList().then(() => {
				console.log(chatList.value)
			})
		})

		return {
			smAndDown,
			chatList,
			loadingChatList,
			showChatList,
		}
	},
}
</script>