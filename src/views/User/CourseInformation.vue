<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <v-form ref="courseTransactionForm">
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
                      :rules="[required]"
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
                    :rules="[required]"
                    hide-details="auto"
                    class="mb-4"
                    v-model="selectedDateFormatted"
                  />
                  <v-select
                    variant="solo-filled"
                    flat
                    :rules="[required]"
                    label="Pilih Waktu"
                    hide-details="auto"
                    class="mb-4"
                    :items="currentDateConfig.allowedTime"
                    v-model="selectedTime"
                  />
                  <v-text-field
                    variant="solo-filled"
                    flat
                    label="Jumlah Peserta"
                    v-model="selectedAmount"
                    type="number"
                    :rules="[required, positiveInteger]"
                    hide-spin-buttons
                    hide-details="auto"
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
                  <div
                    class="text-body-2 font-weight-light"
                    v-if="selectedAmount >= courseData.promo_min_amount"
                  >
                    <!-- {{ formatCurrency(selectedAmount >= courseData.promo_min_amount ? courseData.price_promo : courseData.price) }} x {{ selectedAmount }} -->
                    <p>
                      <strike>{{ formatCurrency(courseData.price) }}</strike>
                    </p>
                    <p>{{ formatCurrency(courseData.price_promo) }} x {{ selectedAmount }}</p>
                  </div>
                  <div
                    v-else
                    class="text-body-2 font-weight-light"
                  >
                    {{ formatCurrency(courseData.price) }} x {{ selectedAmount }}
                  </div>
                </div>
                <div>
                  <template v-if="selectedAmount >= courseData.promo_min_amount">
                    <p class="font-weight-light">
                      <strike>
                        {{ formatCurrency(courseData.price * selectedAmount) }}
                      </strike>
                    </p>
                    <p class="font-weight-bold">
                      {{ formatCurrency(subtotal) }}
                    </p>
                  </template>
                  <template v-else>
                    <p class="font-weight-bold">
                      {{ formatCurrency(subtotal) }}
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
                @click="addCourseTransactionMT"
                :disabled="loadingCreateCourseTransaction"
                :loading="loadingCreateCourseTransaction"
              >
                Pay with MidTrans
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </xyztransition>
</template>
<script lang="ts">
import useCourse from '@composables/useCourse'
import { formatDate, formatCurrency } from '@helpers/utils'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/modules'
import useMidtrans from '@composables/useMidtrans'
import { required, positiveInteger } from '@helpers/validations'

export default {
	setup() {
		const route = useRoute()
		const { loadingCreateCourseTransaction, createCourseTransaction } = useMidtrans()
		const { courseData, loadingCourseDetail, getCourseDetail } = useCourse()
		const selectedDate = ref(null as any)
		const allowedDates = ref([] as any)
		const { userData } = storeToRefs(useAuthStore())
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

		const subtotal = computed(() => {
			if (selectedAmount.value >= courseData.value.promo_min_amount) {
				return courseData.value.price_promo * selectedAmount.value
			} else {
				return courseData.value.price * selectedAmount.value
			}
		})

		const courseTransactionForm = ref(null as any)

		const addCourseTransactionMT = () => {
			courseTransactionForm.value.validate()
			console.log(courseTransactionForm.value.isValid)
			if (courseTransactionForm.value.isValid) {
				const transaction_details = {
					order_id: `COURSE-${userData!.value!.id}-${Date.now()}`,
					gross_amount: subtotal.value,
					start_date: new Date(Array.isArray(selectedDate.value) ? selectedDate.value[0] : selectedDate.value),
					time_slot: selectedTime.value,
				}
				const item_details = [{
					id: courseData.value.id.toString(),
					price: selectedAmount.value >= courseData.value.promo_min_amount ? courseData.value.price_promo : courseData.value.price,
					quantity: +selectedAmount.value,
					name: courseData.value.name,
				}]

				const customer_details = {
					first_name: userData.value!.first_name,
					last_name: userData.value!.last_name,
					email: userData.value!.email,
					phone: userData.value!.phone
				}

				console.log(transaction_details, item_details, customer_details)
				createCourseTransaction(transaction_details, item_details, customer_details)
			}
			
		}
		
		return {
			required,
			positiveInteger,
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
			subtotal,

			addCourseTransactionMT,
			loadingCreateCourseTransaction,
			courseTransactionForm,
		}
	}
}
</script>