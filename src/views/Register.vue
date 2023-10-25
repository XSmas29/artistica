<template>
  <div>
    <h1 class="my-6 text-center">Register</h1>
    <div class="mx-3">
      <v-form ref="registerForm" v-model="isRegisterValid" @submit.prevent fast-fail>
        <XyzTransition appear-visible xyz="fade left-5">
          <v-card max-width="480" class="rounded-lg pa-2 mx-auto mb-6" variant="elevated" elevation="6">
            <v-card-subtitle class="my-4">Masukkan email untuk membuat akun</v-card-subtitle>
            <v-card-text>
              <v-text-field label="Email" flat v-model="formData.email" :rules="[required, validEmail]"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" @click="submit" variant="flat" color="black" size="large" block
                :loading="loadingRegister" :disabled="loadingRegister">Register</v-btn>
            </v-card-actions>
            <div class="d-flex flex-column align-center justify-center mt-4">
              <div>Sudah punya akun?</div>
              <router-link :to="{ name: 'login' }" style="text-decoration: none;">
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
import useUser from '@composables/useUser';
import { ref } from 'vue';
import { required, validEmail } from '@helpers/validations';
import { toast } from '@helpers/utils';
export default {
  setup() {
    const formData = ref({
      email: '',
    });
    const isRegisterValid = ref(false);
    const registerForm = ref(null);
    const { register, loadingRegister } = useUser();
    const submit = async () => {
      const valid = (await (registerForm.value as any).validate()).valid
      if (valid) {
        await register(formData.value.email);
      }
    };
    return {
      submit,
      formData,
      loadingRegister,
      isRegisterValid,
      registerForm,
      required,
      validEmail,
    };
  },
};
</script>
