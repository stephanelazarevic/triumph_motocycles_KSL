<script lang="ts" setup>
import logo from '../assets/logo.png';
import sideImage from '../assets/triumph.png';
</script>

<template>
  <div class="d-flex h-screen overflow-hidden flex-row-reverse">
    <!-- Content Side -->
    <div
      id="content-side"
      class="h-100 content-side d-flex flex-column overflow-auto"
    >
      <!-- Header Logo -->
      <div heigth="50">
        <v-img
          :src="logo"
          class="ma-5"
          height="30"
        />
      </div>

      <main class="flex-grow-1">
        <!-- Content slot -->
        <router-view />
      </main>

      <div
        height="50"
        class="text-center"
      >
        <p>&copy; 2025 Triumph KSL</p>
        <div class="ma-3">
          <a href="#">Politique de Confidentialité</a>
          <span class="mx-5">|</span>
          <a href="#">Conditions d'Utilisation</a>
        </div>
      </div>
    </div>

    <!-- Image Side -->
    <div class="h-100 d-none d-md-block image-side">
      <v-img
        :src="sideImage"
        alt="Opale Capital"
        cover
        height="100%"
      />
    </div>
  </div>
</template>

<style>
  .image-side {
    width: 50%;
  }

  /* stylelint-disable-next-line media-feature-range-notation */
  @media (min-width: 960px) {
    html {
      -ms-overflow-style: none;
    }

    .content-side{
      width: 50%;
    }
  }
</style>
