<script setup>
import { defineProps } from 'vue';

defineProps({
bg: {
    typeof: 'string',
    default: 'bg-gray-100'
}
});
</script>

<template>
<div :class="`${bg} p-6 rounded-lg shadow-md`">
    <slot></slot>
</div>
</template>