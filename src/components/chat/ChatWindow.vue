<template>
  <v-main style="width: 1200px">
    <v-app-bar
      color="primary"
      density="comfortable"
      flat
    >
      <template
        #prepend
        v-if="smAndDown"
      >
        <v-app-bar-nav-icon @click="toggleNavbar" />
      </template>
      <v-app-bar-title>{{ activeChat.title ?? 'Chat' }}</v-app-bar-title>
    </v-app-bar>
    <div
      v-if="!activeChat.id"
      class="d-flex justify-center align-center h-100"
    >
      <div class="text-center">
        <v-icon
          size="240"
          color="primary"
        >
          mdi-forum-outline
        </v-icon>
        <p class="text-grey">
          Silahkan Pilih Chat untuk melakukan percakapan
        </p>
      </div>
    </div>
    <div
      class="d-flex flex-column h-100"
      v-else
    >
      <div
        class="flex-grow-1 pa-2"
        style="overflow-y: scroll;"
        id="chat-window"
      >
        <div
          v-for="item of chatMessageList"
          :key="item.id"
          class="d-flex mb-3"
          :id="`msg-${item.id}`"
          :class="{
            'justify-end': item.is_my_message,
            'justify-start': !item.is_my_message,
          }"
        >
          <div class="d-flex justify-end">
            <template v-if="item.is_my_message">
              <div
                class="text-caption my-1 me-1 align-self-end flex-grow-1 flex-shrink-0 text-end"
              >
                {{ formatDateTime(item.created_at) }}
              </div>
              <v-card
                class="pa-2 w-75"
                color="accent"
                variant="flat"
              >
                {{ item.message }}
              </v-card>
            </template>
            <template v-else>
              <v-card
                class="pa-2 w-75"
                color="primary"
                variant="flat"
              >
                {{ item.message }}
              </v-card>
              <div
                class="text-caption my-1 ms-1 align-self-end flex-grow-1 flex-shrink-0 text-start"
              >
                {{ formatDateTime(item.created_at) }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <div>
        <v-text-field
          v-model="messageForm.message"
          hide-details
          variant="solo-filled"
          class="bg-primary"
          placeholder="Ketik Sesuatu..."
          :disabled="loadingCreateChatMessage"
        >
          <template #append-inner>
            <v-btn
              icon="mdi-paperclip"
              variant="plain"
              :disabled="loadingCreateChatMessage"
            />
            <v-btn
              variant="flat"
              size="large"
              @click="sendMessage"
              :disabled="loadingCreateChatMessage"
              :loading="loadingCreateChatMessage"
            >
              <v-icon>
                mdi-send
              </v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
    </div>
  </v-main>
</template>
<script lang="ts">
import { inject, ref, Ref, watch, nextTick } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import useChat from '@/composables/useChat'
import { formatDateTime } from '@helpers/utils'
import ioClient from '@/helpers/SocketIO'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/modules'
import { useGoTo } from 'vuetify'

export default {
	props: {
		activeChat: {
			type: Object,
			default: null
		},
	},
	setup(props) {
		const goTo = useGoTo()
		const { 
			loadingCreateChatMessage,
			loadingChatMessages, chatMessageList, getChatMessages,
		} = useChat()

		const showChatNavBar = inject('showChatNavBar') as Ref<boolean>
		const toggleNavbar = () => {
			showChatNavBar.value = !showChatNavBar.value
		}

		const { userData } = storeToRefs(useAuthStore())

		const messageForm = ref({
			message: '',
			image: null,
		})

		watch(() => props.activeChat, newValue => {
			messageForm.value = {
				message: '',
				image: null,
			}

			getChatMessages(newValue.id)
		})
    
		ioClient.on('broadcast_message', (data: any) => {
			if (data.chat === props.activeChat.id) {
				const newMessage = {
					created_at: data.created_at,
					id: data.id,
					image: data.image,
					isRead: data.isRead,
					is_my_message: data.user === userData.value!.id,
					message: data.message,
				}
				chatMessageList.value.push(newMessage)
				nextTick(() => {
					goTo(`#msg-${data.id}`, {container: '#chat-window'})
				})
			}
		})

		const { smAndDown } = useDisplay()

		const sendMessage = () => {
			// createChatMessage({
			// 	chat_id: props.activeChat.id,
			// 	message: messageForm.value.message,
			// 	image: messageForm.value.image,
			// }).then(() => {
			// 	ioClient.emit('send_message', {
			// 		chat_id: props.activeChat.id,
			// 		message: messageForm.value.message,
			// 		image: messageForm.value.image,
			// 	})
			// })
			ioClient.emit('send_message', {
				chat_id: props.activeChat.id,
				sender_id: userData.value!.id,
				message: messageForm.value.message,
				image: messageForm.value.image,
			})
			messageForm.value = {
				message: '',
				image: null,
			}
		}
		
		return {
			formatDateTime,
			smAndDown,
			toggleNavbar,
			loadingCreateChatMessage,
			sendMessage,
			messageForm,

			loadingChatMessages,
			chatMessageList,
		}
	},
}
</script>