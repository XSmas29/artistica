<template>
  <v-main style="width: 1200px">
    <ChatInfo
      :chat="activeChat"
      @toggle-navbar="toggleNavbar"
    />
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
      v-else-if="loadingChatMessages"
      class="d-flex justify-center align-center h-100"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="80"
        width="8"
      />
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
                class="pa-2 w-75 d-flex flex-column"
                color="accent"
                variant="flat"
              >
                <template v-if="item.image">
                  <v-dialog
                    max-width="1080"
                  >
                    <template #default="{ isActive }">
                      <v-card>
                        <v-card-title>
                          <div class="d-flex justify-end">
                            <v-btn
                              variant="tonal"
                              color="error"
                              size="large"
                              @click="isActive.value = false"
                            >
                              <v-icon size="28">
                                mdi-close
                              </v-icon>
                            </v-btn>
                          </div>
                        </v-card-title>
                        <v-divider />
                        <v-card-text>
                          <v-img
                            :src="item.image"
                            max-height="75vh"
                          />
                        </v-card-text>
                      </v-card>
                    </template>
                    <template #activator="{ props }">
                      <v-card
                        class="align-self-center mb-1 pa-1"
                        variant="tonal"
                        rounded="md"
                        v-bind="props"
                      >
                        <v-img
                          :src="item.image"
                          width="200"
                          :aspect-ratio="1"
                        />
                      </v-card>
                    </template>
                  </v-dialog>
                  
                  <div>
                    {{ item.message }}
                  </div>
                </template>
                <template v-else-if="item.is_quotation_active">
                  <ChatQuotation :message="item" />
                </template>
                <template v-else>
                  {{ item.message }}
                </template>
              </v-card>
            </template>
            <template v-else>
              <v-card
                class="pa-2 w-75 d-flex flex-column"
                color="primary"
                variant="flat"
              >
                <template v-if="item.image">
                  <v-dialog
                    max-width="1080"
                  >
                    <template #default="{ isActive }">
                      <v-card>
                        <v-card-title>
                          <div class="d-flex justify-end">
                            <v-btn
                              variant="tonal"
                              color="error"
                              size="large"
                              @click="isActive.value = false"
                            >
                              <v-icon size="28">
                                mdi-close
                              </v-icon>
                            </v-btn>
                          </div>
                        </v-card-title>
                        <v-divider />
                        <v-card-text>
                          <v-img
                            :src="item.image"
                            max-height="75vh"
                          />
                        </v-card-text>
                      </v-card>
                    </template>
                    <template #activator="{ props }">
                      <v-card
                        class="align-self-center mb-1 pa-1"
                        variant="tonal"
                        rounded="md"
                        v-bind="props"
                      >
                        <v-img
                          :src="item.image"
                          width="200"
                          :aspect-ratio="1"
                        />
                      </v-card>
                    </template>
                  </v-dialog>
                  
                  <div>
                    {{ item.message }}
                  </div>
                </template>
                <template v-else-if="item.is_quotation_active">
                  <ChatQuotation :message="item" />
                </template>
                <template v-else>
                  {{ item.message }}
                </template>
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
        >
          <template #append-inner>
            <v-dialog
              max-width="600"
              v-model="uploadImageDialog"
            >
              <template #default="{ isActive }">
                <v-form ref="uploadImageForm">
                  <v-card
                    title="Upload Gambar"
                  >
                    <v-card-text>
                      <div class="d-flex flex-column align-center">
                        <vue-dropzone
                          ref="chatDropzone"
                          width="300"
                          height="300"
                          v-model="messageForm.image"
                        />
                      </div>
                      <v-text-field
                        label="Ketik sesuatu..."
                        outlined
                        dense
                        block
                        hide-details="auto"
                        class="my-4 bg-primary"
                        variant="solo-filled"
                        v-model="imageMessage"
                      />
                    </v-card-text>
                    <v-card-actions class="mb-1">
                      <v-spacer />
                      <v-btn
                        color="success"
                        variant="flat"
                        :disabled="loadingCreateChatMessage || (!imageMessage && !messageForm.image)"
                        @click="sendMessage(true)"
                      >
                        <v-icon class="me-1">
                          mdi-send
                        </v-icon>
                        Kirim
                      </v-btn>
                      <v-btn
                        text="Batal"
                        @click="isActive.value = false"
                      />
                    </v-card-actions>
                  </v-card>
                </v-form>
              </template>
              <template #activator="{ props }">
                <v-btn
                  icon="mdi-paperclip"
                  variant="plain"
                  v-bind="props"
                />
              </template>
            </v-dialog>
            <v-btn
              variant="flat"
              size="large"
              @click="sendMessage(false)"
              :disabled="loadingCreateChatMessage || !messageForm.message"
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
import { required } from '@helpers/validations'
import VueDropzone from '@/components/VueDropzone.vue'
import ChatInfo from '@/components/chat/ChatInfo.vue'
import ChatQuotation from '@/components/chat/ChatQuotation.vue'

export default {
	components: {
		VueDropzone,
		ChatInfo,
		ChatQuotation,
	},
	props: {
		activeChat: {
			type: Object,
			default: null
		},
	},
	setup(props) {
		const goTo = useGoTo()
		const {
			loadingCreateChatMessage, createChatMessage,
			loadingChatMessages, chatMessageList, getChatMessages,
		} = useChat()
		const uploadImageDialog = ref(false)

		const showChatNavBar = inject('showChatNavBar') as Ref<boolean>
		const toggleNavbar = () => {
			showChatNavBar.value = !showChatNavBar.value
		}

		const { userData } = storeToRefs(useAuthStore())

		const messageForm = ref({
			message: '',
			image: null,
		})

		const imageMessage = ref('')

		watch(() => props.activeChat, newValue => {
			messageForm.value = {
				message: '',
				image: null,
			}

			getChatMessages(newValue.id).then(() => {
				if (chatMessageList.value.length > 0) goTo(`#msg-${chatMessageList.value[chatMessageList.value.length - 1].id}`, {container: '#chat-window'})
			})
		})
    
		ioClient.on('broadcast_message', (data: any) => {
			console.log(data)
			if (data.chat === props.activeChat.id) {
				const newMessage = {
					created_at: data.created_at,
					id: data.id,
					image: data.image,
					is_my_message: data.user === userData.value!.id,
					message: data.message,
					chat: data.chat,
					user: data.user,
				}
				chatMessageList.value.push(newMessage)
				nextTick(() => {
					goTo(`#msg-${data.id}`, {container: '#chat-window'})
				})
			}
		})

		const { smAndDown } = useDisplay()

		const sendMessage = (withImage: boolean) => {
			createChatMessage({
				chat_id: props.activeChat.id,
				message: withImage ? imageMessage.value : messageForm.value.message,
				image: messageForm.value.image,
			}).then((data: any) => {
				const msg = JSON.parse(data.addChatMessage.data)
				const msgData = {
					created_at: msg.created_at,
					id: msg.id,
					image: msg.image,
					is_my_message: true,
					message: msg.message,
					chat: msg.chat.id,
					user: msg.user.id,
				}
				chatMessageList.value.push(msgData)
				ioClient.emit('send_message', msgData)
				nextTick(() => {
					goTo(`#msg-${msgData.id}`, {container: '#chat-window'})
				})
			})

			// ioClient.emit('send_message', {
			// 	chat_id: props.activeChat.id,
			// 	sender_id: userData.value!.id,
			// 	message: messageForm.value.message,
			// 	image: messageForm.value.image,
			// })
			messageForm.value = {
				message: '',
				image: null,
			}
			imageMessage.value = ''
			uploadImageDialog.value = false
		}
		
		return {
			formatDateTime,
			smAndDown,
			toggleNavbar,
			sendMessage,
			messageForm,
			imageMessage,

			loadingCreateChatMessage,

			loadingChatMessages,
			chatMessageList,

			uploadImageDialog,
			required,
      
		}
	},
}
</script>