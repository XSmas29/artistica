<template>
  <v-app-bar
    color="primary"
    density="comfortable"
    flat
  >
    <template
      #prepend
      v-if="smAndDown"
    >
      <v-app-bar-nav-icon @click="$emit('toggleNavbar')" />
    </template>
    <v-app-bar-title>{{ chat.title ?? 'Chat' }}</v-app-bar-title>
    <template
      #append
      v-if="chat.custom_transaction?.id"
    >
      <v-dialog max-width="800px">
        <template #default="{ isActive }">
          <v-card>
            <v-card-title>
              <div class="d-flex">
                <p>Detail Pesanan Kustom</p>
                <v-spacer />
                <v-btn
                  variant="tonal"
                  color="error"
                  @click="isActive.value = false"
                >
                  <v-icon size="28">
                    mdi-close
                  </v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-form
                ref="editCustomTransactionForm"
              >
                <template v-if="loadingCustomTransactionDetail">
                  <v-skeleton-loader type="image, text, paragraph" />
                </template>
                <template v-else>
                  <image-gallery
                    :images="customTransactionData.images"
                  />
                  <div class="mt-8">
                    <v-row>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                          label="Nama Perhiasan"
                          hide-details="auto"
                          v-model="customFormData.product_name"
                          :rules="[required]"
                          :readonly="!userData?.is_admin"
                          variant="solo-filled"
                          flat
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                          type="number"
                          label="Jumlah"
                          hide-spin-buttons
                          hide-details="auto"
                          v-model="customFormData.amount"
                          :rules="[required]"
                          :readonly="!userData?.is_admin"
                          variant="solo-filled"
                          flat
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                        cols="12"
                      >
                        <v-textarea
                          label="Deskripsi"
                          hide-details="auto"
                          v-model="customFormData.product_description"
                          :rules="[required]"
                          :readonly="!userData?.is_admin"
                          variant="solo-filled"
                          flat
                        />
                      </v-col>
                    </v-row>
                  </div>
                </template>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <template v-if="userData?.is_admin">
                <v-spacer />
                <v-btn
                  color="success"
                  variant="flat"
                  @click="editCustomTransaction(customTransactionData.id, customFormData)"
                  :disabled="loadingEditCustomTransactionBasicInfo"
                  :loading="loadingEditCustomTransactionBasicInfo"
                >
                  Simpan
                </v-btn>
              </template>
            </v-card-actions>
          </v-card>
        </template>
        <template #activator="{ props }">
          <v-btn
            variant="plain"
            icon
            v-bind="props"
            @click="loadCustomTransactionData"
          >
            <v-icon size="32">
              mdi-information-slab-box
            </v-icon>
          </v-btn>
        </template>
      </v-dialog>
    </template>
  </v-app-bar>
</template>
<script lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'
import ImageGallery from '@components/ImageGallery.vue'
import { required } from '@helpers/validations'
import { ref } from 'vue'
import { useAuthStore } from '@/store/modules'
import { storeToRefs } from 'pinia'
import useCustomTransaction from '@composables/useCustomTransaction'

export default {
	emits: ['toggleNavbar'],
	components: {
		ImageGallery,
	},
	props: {
		chat: {
			type: Object,
			default: () => ({}),
		},
	},
	setup(props) {
		const { 
			loadingEditCustomTransactionBasicInfo, editCustomTransactionBasicInfo,
			customTransactionData, loadingCustomTransactionDetail, getCustomTransactionDetail,
		} = useCustomTransaction()
		const { userData } = storeToRefs(useAuthStore())
		const { smAndDown } = useDisplay()
		const customFormData = ref({
			product_name: '',
			product_description: '',
			amount: '',
		})

		const editCustomTransactionForm = ref(null as any)

		const editCustomTransaction = async (id: number, data: any) => {
			editCustomTransactionForm.value.validate()
			if (editCustomTransactionForm.value.isValid) {
				const param = {
					product_name: data.product_name,
					product_description: data.product_description,
					amount: +data.amount,
				}
				await editCustomTransactionBasicInfo(id, param)
			}
		}

		const loadCustomTransactionData = () => {
			getCustomTransactionDetail(props.chat.custom_transaction.id).then(() => {
				console.log(customTransactionData.value)
				customFormData.value = {
					product_name: customTransactionData.value.product_name,
					product_description: customTransactionData.value.product_description,
					amount: customTransactionData.value.amount,
				}
			})
		}

		// watch(() => props.chat.custom_transaction, newVal => {
		// 	customFormData.value = {
		// 		product_name: newVal.product_name,
		// 		product_description: newVal.product_description,
		// 		amount: newVal.amount,
		// 	}
		// })

		return {
			smAndDown,
			required,
			editCustomTransactionForm,

			customFormData,
			userData,

			loadingEditCustomTransactionBasicInfo,
			editCustomTransaction,

			customTransactionData,
			loadingCustomTransactionDetail,
			loadCustomTransactionData,
		}
	}
}
</script>