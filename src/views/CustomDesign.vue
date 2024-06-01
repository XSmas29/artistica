<template>
  <XyzTransition
    appear-visible
    xyz="fade left-5"
  >
    <div>
      <h3 class="mb-4 mt-6">
        Sebelum mengajukan pesanan kustom, silakan baca syarat & ketentuan berikut:
      </h3>
      <p class="text-body-1 my-4">
        1. Anda harus mengisi formulir pesanan kustom dibawah ini terlebih dahulu sebelum bisa berkonsultasi dengan admin.<br>
        2. Untuk pengembalian, resize, dan perbaikan maksimal 7 hari setelah barang diterima.<br>
        <!-- 3. Untuk barang kustom, pembeli harus membayar DP 50% di awal, dan pelunasan setelah barang selesai dibuat.<br> -->
      </p>
      <hr class="my-6">
      <v-form
        ref="infoForm"
        v-model="isCustomValid"
        @submit.prevent
        fast-fail
      >
        <v-card
          rounded
          variant="plain"
        >
          <v-card-title>Form Perhiasan Kustom</v-card-title>
          <v-card-text class="mt-2">
            <p>Gambar Desain Perhiasan</p>
            <div
              class="d-flex"
              style="overflow-x: scroll;"
            >
              <div
                v-for="i in 5"
                :key="i"
                class="ma-1"
              >
                <vue-dropzone
                  ref="productDropzone"
                  width="100"
                  height="100"
                  v-model="customFormData.images[i-1]"
                />
              </div>
            </div>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  label="Nama Perhiasan"
                  hide-details="auto"
                  v-model="customFormData.name"
                  :rules="[required]"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-textarea
                  label="Deskripsi"
                  hide-details="auto"
                  v-model="customFormData.description"
                  :rules="[required]"
                />
              </v-col>
            </v-row>
            <v-row>
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
                />
              </v-col>
            </v-row>
            <div />
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="success"
              variant="flat"
              @click="addCustomProduct"
              :disabled="loadingCreateCustomProduct"
              :loading="loadingCreateCustomProduct"
            >
              <v-icon class="me-1">
                mdi-floppy
              </v-icon>
              Simpan Produk
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </div>
  </xyztransition>
</template>
<script lang="ts">
import { ref } from 'vue'
import VueDropzone from '@/components/VueDropzone.vue'
import { required } from '@helpers/validations'

export default {
	components: {
		VueDropzone,
	},
	setup() {
		const isCustomValid = ref(false)

		const customFormData = ref({
			images: [] as any[],
			name: '',
			description: '',
			amount: null as number | null,
		})

		return {
			isCustomValid,
			customFormData,
			required,
		}
	},
}
</script>