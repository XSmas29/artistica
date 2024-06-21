<template>
  <v-layout>
    <ChatList />
  </v-layout>
</template>
<script lang="ts">
import ChatList from '@/components/chat/ChatList.vue'
export default {
	components: {
		ChatList,
	},
	setup() {
		return {
		}
	},
}
</script>