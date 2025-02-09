<route lang="yaml">
  name: login
  meta:
    layout: split-layout
</route>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { z } from 'zod';

const validationSchema = toTypedSchema(
  z.object({
    email: z.string().min(1, { message: 'This is required' }).email({ message: 'Must be a valid email' }),
    password: z.string().min(1, { message: 'This is required' }).min(8, { message: 'Too short' })
  })
);
const { handleSubmit } = useForm({ validationSchema });

const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');

const submitLogin = handleSubmit((values) => {
  alert(`Logged in with email: ${values.email}`);
});

const forgotPassword = () => {
  alert('Redirecting to password recovery...');
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
        <v-form @submit.prevent="submitLogin">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            density="compact"
            :error-messages="emailError"
            variant="outlined"
          />
          <v-text-field
            v-model="password"
            label="Mot de passe"
            type="password"
            density="compact"
            :error-messages="passwordError"
            variant="outlined"
          />

          <v-btn
            class="mt-2"
            color="primary"
            block
            flat
            type="submit"
          >
            Se connecter
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn
          variant="text"
          class="mt-2"
          @click="forgotPassword"
        >
          Mot de passe oublié ?
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
