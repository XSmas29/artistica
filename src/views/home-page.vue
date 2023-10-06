<template>
	<v-carousel show-arrows="true" cycle height="auto" eager>
		<template v-for="(item, index) in carouselItem" :key="index">
			<v-carousel-item eager>
				<v-img :src="item" />
			</v-carousel-item>
		</template>
	</v-carousel>
</template>

<script lang="ts">
import { ref } from 'vue';
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
		]);
		return {
			carouselItem
		};
	},
};
</script>
