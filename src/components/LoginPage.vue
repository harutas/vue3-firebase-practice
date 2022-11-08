<script setup lang="ts">
import { storeToRefs } from "pinia";
import useAuthStore from "../stores/auth";

const { email, password } = storeToRefs(useAuthStore());
const { registerUser } = useAuthStore();
</script>

<template lang="pug">
div(class="flex flex-col items-center")
  h2(class="text-3xl") ユーザ登録画面
  form(@submit.prevent="registerUser")
    div(class="form-group")
      label(for="email" class="label")
        span(class="label-text") Email address
      input(type="email" id="email" v-model="email" class="input input-bordered w-full max-w-xs" placeholder="john.doe@company.com" required)
    div(class="form-group")
      label(for="password" class="label")
        span(class="label-text") Password
      input(type="password" id="password" v-model="password" class="input input-bordered w-full max-w-xs" placeholder="" required)
    div(class="text-center mt-2")
      button(type="submit" class="btn btn-wide btn-info") 登録
</template>
