<template>
  <v-icon
    :start="start"
    :end="end"
    :color="color"
    style="opacity: 0.85"
  >
    <font-awesome-icon
      :icon="icon"
      :size="size"
    />
  </v-icon>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {IconSize} from '@utils/types'
import { PropType } from 'vue'
export default {
	components: {
		FontAwesomeIcon,
	},
	props: {
		icon: {
			type: String,
			required: true,
		},
		start: {
			type: Boolean,
			default: false,
		},
		end: {
			type: Boolean,
			default: false,
		},
		color: {
			type: String,
			default: undefined,
		},
		size: {
			type: String as PropType<IconSize>,
			default: 'xs',
		},
	},
	setup() {
	}
}
</script>

<style>

</style>