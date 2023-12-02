<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-row
      class="d-flex"
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-carousel hide-delimiters>
          <v-carousel-item
            v-for="(item,i) in carouselItem"
            :key="i"
            :src="item"
          />
        </v-carousel>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          {{ product.name }}
        </v-card>
      </v-col>
    </v-row>
  </XyzTransition>
</template>
<script lang="ts">
import { onMounted, ref } from 'vue'
import useProduct from '@composables/useProduct'
import { useRoute } from 'vue-router'

export default {
	setup() {
		const route = useRoute()
		const { getProductDetail, loadingProductDetail, product } = useProduct()

		onMounted(() => {
			const id = +(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)
			getProductDetail(id)
		})

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
			carouselItem,
			loadingProductDetail,
			product
		}
	},
}
</script>