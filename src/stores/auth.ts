import { defineStore } from "pinia";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    name: "",
    email: "",
    password: "",
    loginEmail: "",
    loginPassword: "",
  }),

  actions: {
    // 新規ユーザー登録
    registerUser() {
      // signin with email & password
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // userの中にuidやdisplaynameなどがある
          const user = userCredential.user;
          // ユーザーのプロファイルを更新する
          updateProfile(user, {
            displayName: this.name,
            photoURL: "",
          }).catch((error) => {
            console.log(error.code);
            console.log(error.message);
          });
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
        });
    },
    // 既存のユーザーにサインインする
    logInUser() {
      signInWithEmailAndPassword(auth, this.loginEmail, this.loginPassword)
        .then((userCredential) => {
          // SignIn
          const user = userCredential.user;
          this.loginEmail = "";
          this.loginPassword = "";
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
        });
    },
    // ログアウトする
    logOut() {
      auth.signOut();
    },
  },
});

export default useAuthStore;
