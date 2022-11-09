<script setup lang="ts">
import { onMounted } from "vue";
import { auth } from "./firebase/config";
import RegisterPage from "./components/RegisterPage.vue";
import LoginPage from "./components/LoginPage.vue";
import FileUpload from "./components/FileUpload.vue";
import { storeToRefs } from "pinia";
import useAuthStore from "./stores/auth";

const { isLoggedIn } = storeToRefs(useAuthStore());
const { logOut } = useAuthStore();

onMounted(() => {
  // onAuthStateChanged ユーザーのログイン状態が変わるたびに呼び出されるメソッド
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("login");
      isLoggedIn.value = true;
    } else {
      console.log("logout");
      isLoggedIn.value = false;
    }
  });
});
</script>

<template lang="pug">
div(class="h-screen flex flex-col justify-center")
  div(v-if="isLoggedIn" class="flex flex-col mt-2")
    FileUpload
    div(class="flex justify-center mt-10")
      button(class="btn btn-wide bg-red-400 border-transparent" @click="logOut") ログアウト
  div(v-else class="flex justify-center")
    RegisterPage 
    LoginPage
</template>

<style scoped></style>
