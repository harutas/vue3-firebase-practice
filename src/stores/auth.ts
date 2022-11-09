import { defineStore } from "pinia";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { collection, doc, addDoc, setDoc, Timestamp } from "firebase/firestore";
import { async } from "@firebase/util";

const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    uid: "",
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
      createUserWithEmailAndPassword(auth, this.email, this.password).then(async (userCredential) => {
        // userの中にuidやdisplaynameなどがある
        const user = userCredential.user;
        // ユーザーのプロファイルを更新する
        await updateProfile(user, {
          displayName: this.name,
          photoURL: "",
        }).catch((error) => {
          console.log(error.code);
          console.log(error.message);
        });
        this.setInitializeUser(user);
        this.setUser(user);
      });
    },
    // 既存のユーザーにサインインする
    logInUser() {
      signInWithEmailAndPassword(auth, this.loginEmail, this.loginPassword)
        .then((userCredential) => {
          // SignIn
          const user = userCredential.user;
          this.setUser(user);
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
      this.$reset();
    },

    setInitializeUser(user: User) {
      const userId = user.uid;
      setDoc(doc(db, "users", userId), {
        uid: userId,
        name: user.displayName,
        cleatedAt: Timestamp.now().toDate(),
      })
        .then(() => {
          console.log("set user on db");
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
        });
    },

    async setUser(user: User) {
      this.name = user.displayName ?? "";
      this.uid = user.uid;
      // 非同期でデータをfetch
      // await ~
    },
  },
});

export default useAuthStore;
