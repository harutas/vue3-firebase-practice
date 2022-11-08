<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<template lang="pug">
div(class="h-screen flex flex-col justify-center")
  div(class="text-center")
    
    input(type="file" class="file-input w-full max-w-xs border-slate-200")
</template>

<style scoped></style>
