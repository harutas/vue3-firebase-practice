import { defineStore, storeToRefs } from "pinia";
import { db, storage } from "../firebase/config";
import { doc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { UpLoadedImages } from "../types/index";
import useAuthStore from "./auth";
import { nanoid } from "nanoid";
import _ from "lodash";

const useImageStore = defineStore("image", {
  state: () => ({
    uploadedImages: [] as UpLoadedImages[],
  }),

  actions: {
    addImageList(e: Event) {
      const inputElement = e.target as HTMLInputElement;
      if (inputElement === null) return;
      const { files } = inputElement;
      if (files === null) return;
      const file = files.item(0);
      if (file === null) return;
      this.uploadImageToStorage(file);
      inputElement.value = "";
    },

    uploadImageToStorage(file: File) {
      const { uid } = storeToRefs(useAuthStore());
      const imageRef = ref(storage, `image/users/${uid.value}/${file.name}`);
      const metadata = {
        contentType: "image/png",
      };

      const uploadTask = uploadBytesResumable(imageRef, file, metadata);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            // firestoreのimageデータを更新
            this.uploadImageToFirestore(downloadURL, file);
          });
        }
      );
    },

    uploadImageToFirestore(url: string, file: File) {
      const { uid } = storeToRefs(useAuthStore());
      const imageData = {
        userUid: uid.value,
        id: nanoid(),
        storageURL: url,
        dataURL: url,
        fileName: file.name,
        createdAt: Timestamp.now(),
      };

      this.uploadedImages = [...this.uploadedImages, imageData];

      setDoc(doc(db, "user-images", uid.value), {
        images: this.uploadedImages,
      });
    },

    async getUserImageList() {
      const { uid } = storeToRefs(useAuthStore());
      const docRef = doc(db, "user-images", uid.value);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          // set image data
          const images: UpLoadedImages[] | undefined = docSnap.data().images;
          if (images === undefined) return;

          const sortedImages = images.sort((a, b) => {
            if (a.createdAt < b.createdAt) {
              return -1;
            } else if (a.createdAt > b.createdAt) {
              return 1;
            } else return 0;
          });
          this.uploadedImages = sortedImages;
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      } catch (e) {
        console.log("Error getting cached document:", e);
      }
      // Storageの画像リストの取得方法
      // const userImageListRef = ref(storage, `image/users/${uid.value}`);
      // listAll(userImageListRef)
      //   .then((res) => {
      //     res.prefixes.forEach((folderRef) => {
      //       // All the prefixes under listRef.
      //       // You may call listAll() recursively on them.
      //     });
      //     res.items.forEach(async (itemRef) => {
      //       // All the items under listRef.
      //       await getDownloadURL(itemRef).then((url: string) => {
      //         const image = {
      //           userUid: uid.value,
      //           id: nanoid(),
      //           storageURL: url,
      //           dataURL: url,
      //           fileName: itemRef.name,
      //           createdAt: Timestamp.now(),
      //         };
      //         this.uploadedImages = [...this.uploadedImages, image];
      //       });
      //     });
      //   })
    },
  },
});

export default useImageStore;
