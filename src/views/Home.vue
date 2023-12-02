<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-carousel
      cycle
      cover
      eager
    >
      <v-carousel-item
        v-for="(item, index) in carouselItem"
        :key="index"
        :src="item"
        eager
      />
    </v-carousel>
  </XyzTransition>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
	setup() {
		// const file = (path: string) => {
		// 	return new URL(path, import.meta.url).href;
		// };

		const carouselItem = ref([
			new URL('@assets/carousel/carousel-1.webp', import.meta.url).href,
			new URL('@assets/carousel/carousel-2.webp', import.meta.url).href,
			new URL('@assets/carousel/carousel-3.webp', import.meta.url).href,
			new URL('@assets/carousel/carousel-4.webp', import.meta.url).href,
			new URL('@assets/carousel/carousel-5.webp', import.meta.url).href,
			new URL('@assets/carousel/carousel-6.webp', import.meta.url).href,
			new URL('@assets/carousel/carousel-7.webp', import.meta.url).href,
		])
		
		return {
			carouselItem
		}
	},
}
</script>
