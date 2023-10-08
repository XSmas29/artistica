<template>
  <div>
    <h1 class="my-10 text-center">Register</h1>
    <div class="register">
      <v-form ref="registerForm" v-model="isRegisterValid" @submit.prevent fast-fail>
        <XyzTransition appear-visible xyz="fade left-5">
          <v-card width="480" class="mx-4 rounded-lg pa-2" variant="elevated" elevation="6">
            <v-card-subtitle class="my-4">Masukkan email anda untuk membuat akun baru</v-card-subtitle>
            <v-card-text>
              <v-text-field label="Email" flat v-model="email" :rules="[required, validEmail]"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" @click="submit" variant="flat" color="black" size="large" block
                :loading="loadingRegister" :disabled="loadingRegister">Register</v-btn>
            </v-card-actions>
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
    const email = ref('');
    const isRegisterValid = ref(false);
    const registerForm = ref(null);
    const { register, loadingRegister } = useUser();
    const submit = async () => {
      const valid = (await (registerForm.value as any).validate()).valid
      if (valid) {
        await register(email.value);
      }
    };
    return {
      submit,
      email,
      loadingRegister,
      isRegisterValid,
      registerForm,
      required,
      validEmail,
    };
  },
};
</script>

<style scoped>
.register {
  display: flex;
  justify-content: center;
}
</style>
