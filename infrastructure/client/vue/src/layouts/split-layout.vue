<script lang="ts" setup>
import sideImage from '../assets/triumph.png';
</script>

<template>
  <div class="d-flex h-screen overflow-hidden flex-row">
    <!-- Content Side -->
    <div
      id="content-side"
      class="h-100 content-side d-flex flex-column overflow-auto content-scrollbar"
    >
      <main class="flex-grow-1">
        <!-- Content slot -->
        <router-view />
      </main>
    </div>

    <!-- Image Side -->
    <div class="h-100 d-none d-md-block image-side">
      <v-img
        :src="sideImage"
        alt="Side Image"
        cover
        height="100%"
      />
    </div>
  </div>
</template>

<style>
  .image-side {
    width: 42%;
  }

  /* stylelint-disable-next-line media-feature-range-notation */
  @media (min-width: 960px) {
    html {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    html::-webkit-scrollbar {
      display: none;
    }

    .content-side{
      width: 58%;
    }

    .content-scrollbar::-webkit-scrollbar {
      width: 14px;
    }

    .content-scrollbar::-webkit-scrollbar-thumb {
      background-color: transparent;
    }

    .content-scrollbar:hover::-webkit-scrollbar-thumb {
      background-color: #00000020;
      background-clip: padding-box;
      border: 4px solid transparent;
      border-radius: 8px;
    }
  }
</style>
