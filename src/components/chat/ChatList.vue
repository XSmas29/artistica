<template>
  <v-navigation-drawer
    :permanent="!smAndDown"
    v-model="showChatNavBar"
  >
    <v-list
      nav
    >
      <v-progress-linear
        v-if="loadingChatList"
        indeterminate
        color="primary"
      />
      <v-list-item
        v-else
        v-for="(chat, i) in chatList"
        :key="i"
        :value="chat.id"
        @click="$emit('selectChat', chat)"
      >
        <template #append>
          <v-badge
            :color="transactionStatusColor(chat.custom_transaction.status.id)"
            :content="chat.custom_transaction.status.status"
            inline
            rounded="sm"
          />
        </template>
        <v-list-item-title>
          {{ chat.title }}
        </v-list-item-title>
        <!-- <v-list-item-subtitle>
          {{ chat.last_message }}
        </v-list-item-subtitle> -->
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script lang="ts">
import { inject, onMounted, Ref, ref } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import useChats from '@/composables/useChat'
import { transactionStatusColor } from '@/helpers/utils'

export default {
	emits: ['selectChat'],
	setup() {
		const { smAndDown } = useDisplay()
		const { chatList, loadingChatList, getChatList } = useChats()
		const showChatList = ref(true)
    
		onMounted(() => {
			getChatList()
		})

		const showChatNavBar = inject('showChatNavBar') as Ref<boolean>

		return {
			smAndDown,
			chatList,
			loadingChatList,
			showChatList,
			showChatNavBar,
			transactionStatusColor,
		}
	},
}
</script>