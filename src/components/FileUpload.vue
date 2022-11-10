<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import useImageStore from "../stores/image";

const { uploadedImages } = storeToRefs(useImageStore());
const { addImageList, getUserImageList } = useImageStore();

onMounted(() => {
  getUserImageList();
});
</script>

<template lang="pug">
div(class="flex justify-center")
  div( class="grid grid-cols-3 h-96 w-2/3 overflow-y-scroll")
    div(v-for="image of uploadedImages" :key="image.id" class="flex justify-center items-center")
      img(:src="image.storageURL" class="w-full h-auto")
div(class="text-center mt-2")
  input(type="file" class="file-input w-full max-w-xs border-slate-200" accept="jpeg, png, jpg" @input="addImageList")
</template>

<style scoped></style>
