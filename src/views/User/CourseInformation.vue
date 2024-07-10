<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-row>
      <v-col
        cols="12"
        md="8"
      >
        <h1 class="mt-4">
          Course Information
        </h1>
        <v-card
          variant="tonal"
          class="mt-4"
        >
          <v-card-title>
            <h2 class="text-h4">
              {{ courseData.name }}
            </h2>
          </v-card-title>
          <v-card-text>
            <h3 class="mb-1">
              What You Get:
            </h3>
            <p
              class="text-body-1"
              v-html="courseData.description"
            />
            <v-divider class="my-4" />
            <h3 class="mb-1">
              Time Selection
            </h3>
            <v-date-picker
              multiple="true"
              v-model="selectedDate"
            >
              <template #header>
                <div class="v-date-picker-header">
                  <div class="v-date-picker-header__content">
                    <!-- {{ formatDate(selectedDate[0] ? selectedDate[0] : 'Pilih Tanggal') }} -->
                    {{ selectedDate[0] }}
                  </div>
                </div>
              </template>
            </v-date-picker>
          </v-card-text>
          
          <v-card-actions>
            <v-btn
              block
              color="accent"
              variant="flat"
            >
              Daftar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </xyztransition>
</template>
<script lang="ts">
import useCourse from '@composables/useCourse'
import { formatDate } from '@helpers/utils'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
	setup() {
		const route = useRoute()
		const { courseData, loadingCourseDetail, getCourseDetail } = useCourse()

		const selectedDate = ref([])

		onMounted(() => {
			const id = +(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)
			getCourseDetail(id)
		})
		
		return {
			courseData,
			loadingCourseDetail,
			selectedDate,
			formatDate
		}
	}
}
</script>