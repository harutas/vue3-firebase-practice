import { Timestamp } from "firebase/firestore";
export interface UpLoadedImage {
  userUid: string;
  id: string;
  storageURL: string;
  dataURL: string;
  fileName: string;
  createdAt: Timestamp;
}
