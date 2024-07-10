<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <div>
      <h1 class="mt-4">
        Artistica Silver Course / Silver Class
      </h1>
      <div class="text-body-1 my-4">
        <p>Silver Course adalah kursus on-site pembuatan perhiasan silver yang diberikan oleh Artistica Jewelry.</p>
        <p>Alamat tempat kursus berada di Ngagel Tama Selatan IV / 25, Surabaya 60283, Indonesia.</p>
      </div>
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="course in courseList"
          :key="course.id"
        >
          <v-card variant="tonal">
            <v-card-title class="text-h4 text-center">
              {{ course.name }}
            </v-card-title>
            <v-card-text>
              <h2 class="mt-3 text-center text-h6 font-weight-medium">
                <p>{{ formatCurrency(course.price) }}/person</p>
                <p>or</p>
                <p>{{ formatCurrency(course.price_promo) }}/person (min {{ course.promo_min_amount }} person)</p>
              </h2>
              <v-divider class="my-4" />
              <h3 class="mb-1">
                What You Get:
              </h3>
              <p
                class="text-body-1"
                v-html="course.description"
              />
              <v-divider class="my-4" />
              <h3 class="mb-1">
                Time Selection
              </h3>
              <p
                class="text-body-1"
                v-html="course.time"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn
                block
                color="accent"
                variant="flat"
                @click="$router.push({ name: 'course-information', params: { id: course.id } })"
              >
                Daftar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </xyztransition>
</template>
<script lang="ts">
import useCourse from '@composables/useCourse'
import { formatCurrency } from '@helpers/utils'
import { onMounted } from 'vue'

export default {
	setup() {
		const {
			loadingCourseList,
			courseList,
			getCourseList,
		} = useCourse()

		onMounted(() => {
			getCourseList()
		})
		
		return {
			loadingCourseList,
			courseList,
			formatCurrency,
		}
	}
}
</script>