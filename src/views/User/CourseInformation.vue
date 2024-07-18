<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-row>
      <v-col cols="12">
        <h1 class="mt-4">
          Course Information
        </h1>
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <v-card
          variant="tonal"
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
            <h3 class="mb-4">
              Time Selection
            </h3>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <div class="d-flex justify-center align-center">
                  <vue-date-picker
                    class="mx-auto"
                    v-model="selectedDate"
                    model-type="timestamp"
                    :min-date="minDate"
                    :enable-time-picker="false"
                    :multi-dates="currentDateConfig.multiDays"
                    auto-apply
                    inline
                    required
                    :action-row="{ showActionRow: false }"
                    :disabled-week-days="currentDateConfig.disabledDays"
                    @date-update="setSelectedDates"
                  />
                </div>
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  readonly
                  label="Tanggal"
                  variant="solo-filled"
                  flat
                  v-model="selectedDateFormatted"
                />
                <v-select
                  variant="solo-filled"
                  flat
                  label="Pilih Waktu"
                  :items="currentDateConfig.allowedTime"
                  v-model="selectedTime"
                />
                <v-text-field
                  variant="solo-filled"
                  flat
                  label="Jumlah Peserta"
                  v-model="selectedAmount"
                  type="number"
                  hide-spin-buttons
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card
          variant="tonal"
          rounded
          min-width="280"
        >
          <v-card-title>
            <h3
              class="text-h5 text-center my-2 font-weight-medium"
            >
              Ringkasan Belanja
            </h3>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="d-flex justify-space-between text-body-1 align-center">
              <div>
                <p>
                  {{ courseData.name }}
                </p>
                <p class="text-body-2 font-weight-light">
                  {{ formatCurrency(courseData.price) }} x {{ selectedAmount }}
                </p>
              </div>
              <div>
                <template v-if="selectedAmount >= courseData.promo_min_amount">
                  <strike>
                    <p class="font-weight-light">
                      {{ formatCurrency(courseData.price * selectedAmount) }}
                    </p>
                  </strike>
                  <p class="font-weight-bold">
                    {{ formatCurrency(selectedAmount >= courseData.promo_min_amount ? courseData.price_promo * selectedAmount : courseData.price * selectedAmount) }}
                  </p>
                </template>
                <template v-else>
                  <p class="font-weight-bold">
                    {{ formatCurrency(courseData.price * selectedAmount) }}
                  </p>
                </template>
              </div>
            </div>
          </v-card-text>
          <v-divider />
          <div class="pa-2">
            <v-btn
              block
              size="large"
              variant="tonal"
              @click="addTransactionMT"
              :disabled="loadingCreateTransaction"
              :loading="loadingCreateTransaction"
            >
              Pay with MidTrans
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </xyztransition>
</template>
<script lang="ts">
import useCourse from '@composables/useCourse'
import { formatDate, formatCurrency } from '@helpers/utils'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
	setup() {
		const route = useRoute()
		const { courseData, loadingCourseDetail, getCourseDetail } = useCourse()
		const selectedDate = ref([] as any)
		const allowedDates = ref([] as any)
		const minDate = computed(() => {
			const date = new Date()
			date.setDate(date.getDate() + 7)
			
			return date
		})
		const selectedTime = ref(null as any)
		const selectedAmount = ref(1)

		onMounted(() => {
			const id = +(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)
			getCourseDetail(id)
		})

		const selectedDateFormatted = computed(() => {
			if (selectedDate.value === null) return null
			else if (Array.isArray(selectedDate.value)) return selectedDate.value.map((date: any) => formatDate(date)).join(', ')
			else {
				return formatDate(selectedDate.value)
			}
		})
    
		const dateConfig = ref([
			{
				id: 1,
				disabledDays: [6, 0],
				allowedTime: ['09:00 - 12:00', '12:00 - 15:00'],
				numberOfDays: 1,
				multiDays: false,
			},
			{
				id: 2,
				disabledDays: [1, 2, 3, 4, 5, 0],
				allowedTime: ['08:00 - 11:00', '11:00 - 14:00'],
				numberOfDays: 1,
				multiDays: false,
			},
			{
				id: 3,
				disabledDays: [0],
				allowedTime: ['09:00 - 15:00'],
				numberOfDays: 1,
				multiDays: false,
			},
			{
				id: 4,
				disabledDays: [6, 0],
				allowedTime: ['09:00 - 15:00'],
				numberOfDays: 2,
				multiDays: true,
			},
		])

		const setSelectedDates = (val: any) => {
			if (currentDateConfig.value.multiDays) {
				selectedDate.value = []
				selectedDate.value.push(val)
				const dateAdd = []
				for (let i = 0; i < currentDateConfig.value.numberOfDays - 1; i++) {
					const temp = new Date(val)
					dateAdd.push(temp.setDate(temp.getDate() + i + 1))
				}
				selectedDate.value.push(...dateAdd)
			}
		}
		
		const currentDateConfig = computed(() => {			
			return dateConfig.value.find(config => config.id === courseData.value.id) || dateConfig.value[0]
		})
		
		return {
			courseData,
			loadingCourseDetail,
			selectedDate,
			formatDate,
			dateConfig,
			allowedDates,
			minDate,
			currentDateConfig,
			setSelectedDates,
			selectedTime,
			selectedDateFormatted,
			selectedAmount,
			formatCurrency,
		}
	}
}
</script>