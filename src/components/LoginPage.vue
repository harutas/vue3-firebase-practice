<script setup lang="ts">
import { storeToRefs } from "pinia";
import useAuthStore from "../stores/auth";

const { loginEmail, loginPassword } = storeToRefs(useAuthStore());
const { logInUser } = useAuthStore();
</script>

<template lang="pug">
div(class="flex flex-col items-center mx-20")
  h2(class="text-3xl") ログイン画面
  form(@submit.prevent="logInUser")
    div(class="form-group")
      label(for="login-email" class="label")
        span(class="label-text") Email address
      input(type="email" id="login-email" v-model="loginEmail" class="input input-bordered w-full max-w-xs" placeholder="john.doe@company.com" required)
    div(class="form-group")
      label(for="login-password" class="label")
        span(class="label-text") Password
      input(type="password" id="login-password" v-model="loginPassword" class="input input-bordered w-full max-w-xs" placeholder="" required)
    div(class="flex justify-between mt-2")
      div(class="text-center")
        button(type="submit" class="btn btn-wide btn-info") ログイン
</template>
