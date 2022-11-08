import { defineStore } from "pinia";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";

const useAuthStore = defineStore("auth", {
  state: () => ({ isLoggedIn: true, email: "", password: "", repassword: "", errorMessage: "" }),

  actions: {
    // 新規ユーザー登録
    registerUser() {
      console.log("firebase");
      // signin with email & password
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // userの中にuidやdisplaynameなどがある
          const user = userCredential.user;
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
        });
    },
  },
});

export default useAuthStore;
