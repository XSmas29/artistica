<template>
  <h1 class="my-6 text-center">
    Login
  </h1>
  <div class="mx-3">
    <v-form
      ref="loginForm"
      v-model="isLoginValid"
      @submit.prevent
      fast-fail
    >
      <XyzTransition
        appear-visible
        xyz="fade left-5"
      >
        <v-card
          max-width="480"
          class="rounded-lg pa-2 mx-auto mb-6"
          variant="elevated"
          elevation="6"
        >
          <v-card-subtitle class="my-4">
            Masukkan data untuk login ke akun anda
          </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Email"
                  flat
                  v-model="formData.email"
                  :rules="[required, validEmail]"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Password"
                  flat
                  v-model="formData.password"
                  :type="type"
                  hint="Minimal 8 karakter"
                  :rules="[required]"
                  append-inner-icon="mdi-eye"
                  @click:append-inner="togglePassword"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              type="submit"
              @click="submit"
              variant="flat"
              color="black"
              size="large"
              block
              :loading="loadingLogin"
              :disabled="loadingLogin"
            >
              Login
            </v-btn>
          </v-card-actions>
          <div class="d-flex flex-column align-center justify-center mt-4">
            <div>Belum punya akun?</div>
            <router-link
              :to="{ name: 'register' }"
              style="text-decoration: none;"
            >
              Register disini
            </router-link>
          </div>
        </v-card>
      </XyzTransition>
    </v-form>
  </div>
</template>
<script lang="ts">
import useUser from '@composables/useUser'
import { ref } from 'vue'
import { required, validEmail } from '@helpers/validations'
import router from '@/router'
export default {
	setup() {
		const formData = ref({
			email: '',
			password: '',
		})
		const type = ref('password')
		const togglePassword = () => {
			console.log('tes')
			if (type.value === 'password') type.value = 'text'
			else type.value = 'password'
		}
		const isLoginValid = ref(false)
		const loginForm = ref(null)
		const { signIn, loadingLogin } = useUser()
		const submit = async () => {
			const valid = (await (loginForm.value as any).validate()).valid
			if (valid) {
				signIn(formData.value.email, formData.value.password).then(() => {
					router.push({ name: 'home'})
				})
			}
		}
		
		return {
			submit,
			formData,
			loadingLogin,
			isLoginValid,
			loginForm,
			required,
			validEmail,
			type,
			togglePassword,
		}
	},
}
</script>