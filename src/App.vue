<script setup>
import Navbar from './components/Navbar.vue';

import { RouterView } from 'vue-router';
</script>

<template>
  <Navbar />
  <!-- This is where the routed content will be rendered -->
  <RouterView />
</template>
