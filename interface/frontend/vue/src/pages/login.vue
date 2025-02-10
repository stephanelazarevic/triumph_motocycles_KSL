<route lang="yaml">
  name: login
  meta:
    layout: split-layout
</route>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { z } from 'zod';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const isLoading = ref(false);
const apiError = ref('');

const validationSchema = toTypedSchema(
  z.object({
    emailAddress: z.string().min(1, { message: 'This is required' }).email({ message: 'Must be a valid emailAddress' }),
    password: z.string().min(1, { message: 'This is required' }).min(8, { message: 'Too short' })
  })
);

const { handleSubmit } = useForm({ validationSchema });
const { value: emailAddress, errorMessage: emailAddressError } = useField('emailAddress');
const { value: password, errorMessage: passwordError } = useField('password');

const submitLogin = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    apiError.value = '';

    const { data } = await axios.post('/api/login', {
      emailAddress: values.emailAddress,
      password: values.password
    });

    if (data.token) {
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }

    window.location.replace("http://localhost:3000/admin");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      apiError.value = error.response?.data?.message || 'Erreur lors de la connexion';
    } else {
      apiError.value = 'Une erreur est survenue';
    }
  } finally {
    isLoading.value = false;
  }
});

const forgotPassword = () => {
  router.push({ name: 'forgot-password' });
};
</script>

<template>
  <v-container class="h-100 d-flex justify-center align-center">
    <v-card
      width="400"
      class="p-5 rounded-2xl"
      flat
    >
      <v-card-title class="text-center text-h3 mb-4 font-semibold text-primary">
        Connexion
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="apiError"
          type="error"
          variant="tonal"
          class="mb-4"
          density="compact"
        >
          {{ apiError }}
        </v-alert>

        <v-form @submit.prevent="submitLogin">
          <v-text-field
            v-model="emailAddress"
            label="Email"
            type="emailAddress"
            density="compact"
            :error-messages="emailAddressError"
            variant="outlined"
            :disabled="isLoading"
            class="my-2"
          />
          <v-text-field
            v-model="password"
            label="Mot de passe"
            type="password"
            density="compact"
            :error-messages="passwordError"
            variant="outlined"
            :disabled="isLoading"
            class="my-2"
          />

          <v-btn
            class="mt-2"
            color="primary"
            block
            flat
            type="submit"
            :loading="isLoading"
            :disabled="isLoading"
          >
            Se connecter
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn
          variant="text"
          class="mt-2"
          :disabled="isLoading"
          @click="forgotPassword"
        >
          Mot de passe oublié ?
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
