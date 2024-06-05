<template>
  <v-carousel
    :hide-delimiters="true"
    v-model="carousel"
    height="420"
    class="rounded-lg mb-2"
    @update:model-value="checkPage"
  >
    <v-carousel-item
      v-for="(item,i) in images"
      :key="i"
      :src="item.path"
    >
      <div class="d-flex">
        <v-spacer />
        <v-chip
          v-if="item.variant"
          class="ma-2"
          label
          variant="flat"
        >
          {{ formatVariantName(item.variant.attribute_values) }}
        </v-chip>
      </div>
    </v-carousel-item>
  </v-carousel>
  <v-data-iterator
    :items="images"
    :items-per-page="itemPerPage"
    v-model:page="page"
  >
    <template #default="{ items, page, prevPage, pageCount, nextPage, itemsPerPage}">
      <div class="d-flex align-center justify-space-between">
        <v-btn
          :disabled="page === 1"
          icon="mdi-chevron-left"
          density="compact"
          variant="tonal"
          rounded
          @click="prevPage"
        />
        <v-spacer />
        <v-card
          v-for="(item, i) in items"
          :key="item.raw"
          :variant="((page - 1) * itemsPerPage) + i === carousel ? 'outlined' : 'flat'"
          class="mx-1"
          @click="carousel = ((page - 1) * itemsPerPage) + i"
        >
          <v-img
            cover
            width="60"
            aspect-ratio="1"
            :src="item.raw ? item.raw.path : productPlaceholder"
          />
        </v-card>
        <v-spacer />
        <v-btn
          :disabled="page >= pageCount"
          icon="mdi-chevron-right"
          density="compact"
          variant="tonal"
          rounded
          @click="nextPage"
        />
      </div>
    </template>
  </v-data-iterator>
</template>
<script lang="ts">
import { ProductImages } from '@helpers/types'
import { ref } from 'vue'
import { productPlaceholder, formatVariantName } from '@helpers/utils'

export default {
	props: {
		images: {
			type: Array as () => ProductImages[],
			default: () => []
		}
	},
	setup() {
		const carousel = ref(0)
		const itemPerPage = ref(5)
		const page = ref(1)

		const checkPage = (val: number) => {
			console.log((itemPerPage.value * page.value) - 1)
			if (val > ((itemPerPage.value * page.value) - 1)) {
				page.value += 1
			} else if (val < ((itemPerPage.value * (page.value - 1)))) {
				page.value -= 1
			}
		}
		
		return {
			carousel,
			itemPerPage,
			page,
      
			checkPage,
			productPlaceholder,
			formatVariantName,
		}
	}
}
</script>