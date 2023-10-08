<template>
  <h1 class="my-10 text-center">Register</h1>
  <div class="register">

    <v-card width="480" class="mx-4 rounded-lg pa-2" variant="elevated" elevation="6">
      <v-card-subtitle class="my-4">Masukkan email anda untuk membuat akun baru</v-card-subtitle>
      <v-card-text>
        <v-text-field label="Email" flat v-model="email"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="submit" variant="flat" color="black" size="large" block :loading="loadingRegister"
          :disabled="loadingRegister">Register</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import useUser from '@composables/useUser';
import { ref } from 'vue';
export default {
  setup() {
    const email = ref('');
    const { register, loadingRegister } = useUser();
    const submit = async () => {
      await register(email.value);
    };
    return {
      submit,
      email,
      loadingRegister,
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
