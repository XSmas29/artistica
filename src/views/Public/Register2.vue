<template>
  <div>
    <h1 class="my-6 text-center">
      Lengkapi data akun anda
    </h1>
    <div class="mx-3">
      <v-form
        ref="registerForm"
        v-model="isRegisterValid"
        @submit.prevent
        fast-fail
      >
        <XyzTransition
          appear-visible
          xyz="fade left-5"
        >
          <v-card
            max-width="640"
            class="rounded-lg pa-2 mx-auto mb-6"
            variant="elevated"
            elevation="6"
          >
            <v-card-subtitle class="my-4">
              Isi data & password untuk akun anda
            </v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    label="Nama depan"
                    flat
                    v-model="formData.first_name"
                    :rules="[required]"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    label="Nama belakang"
                    flat
                    v-model="formData.last_name"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="No telepon"
                    flat
                    v-model="formData.phone"
                    @input="filterTel"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Password"
                    flat
                    v-model="formData.password"
                    type="password"
                    hint="Minimal 8 karakter"
                    :rules="[required, min(formData.password, 8)]"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Konfirmasi password"
                    flat
                    v-model="formData.password_confirmation"
                    type="password"
                    hint="Minimal 8 karakter"
                    :rules="[required, min(formData.password_confirmation, 8), passwordEqual(formData.password_confirmation, formData.password_confirmation)]"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                @click="submit"
                variant="flat"
                color="black"
                size="large"
                block
                :loading="loadingVerify"
                :disabled="loadingVerify"
              >
                Buat akun
              </v-btn>
            </v-card-actions>
            <div class="d-flex flex-column align-center justify-center mt-4">
              <div>Sudah punya akun?</div>
              <router-link
                :to="{ name: 'login' }"
                style="text-decoration: none;"
              >
                Login disini
              </router-link>
            </div>
          </v-card>
        </XyzTransition>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import useUser from '@composables/useUser'
import { ref } from 'vue'
import { required, validEmail, min, passwordEqual } from '@helpers/validations'
import { filterTel } from '@helpers/filters'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
export default {
	setup() {
		const route = useRoute()
		const formData = ref({
			first_name: '',
			last_name: '',
			phone: '',
			password: '',
			password_confirmation: '',
		})

		const isRegisterValid = ref(false)
		const registerForm = ref(null)
		const {
			verifyAccount, loadingVerify,
			checkVerify, user,
		} = useUser()
		const submit = async () => {
			const valid = (await (registerForm.value as any).validate()).valid
			if (valid) {
				verifyAccount(+user.value.id, formData.value).then(() => {
					router.push({
						name: 'login'
					})
				})
			}
		}

		onMounted(() => {
			if (!route.query.code) {
				router.push({
					name: 'login'
				})
			} else {
				checkVerify(route.query.code as string).catch(() => {
					router.push({
						name: 'login'
					})
				})
			}
		})

		return {
			submit,
			formData,
			loadingVerify,
			isRegisterValid,
			registerForm,
			required,
			validEmail,
			min,
			filterTel,
			passwordEqual,
		}
	},
}
</script>
