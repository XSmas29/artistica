<template>
  <v-navigation-drawer
    :permanent="!smAndDown"
    v-model="showChatNavBar"
  >
    <v-list
      nav
    >
      <v-list-item
        v-for="(chat, i) in chatList"
        :key="i"
        :title="chat.title"
        :value="chat.id"
        @click="$emit('selectChat', chat)"
      />
    </v-list>
  </v-navigation-drawer>
</template>
<script lang="ts">
import { inject, onMounted, Ref, ref } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import useChats from '@/composables/useChat'

export default {
	emits: ['selectChat'],
	setup() {
		const { smAndDown } = useDisplay()
		const { chatList, loadingChatList, getChatList } = useChats()
		const showChatList = ref(true)
    
		onMounted(() => {
			getChatList().then(() => {
				console.log(chatList.value)
			})
		})

		const showChatNavBar = inject('showChatNavBar') as Ref<boolean>

		return {
			smAndDown,
			chatList,
			loadingChatList,
			showChatList,
			showChatNavBar,
		}
	},
}
</script>