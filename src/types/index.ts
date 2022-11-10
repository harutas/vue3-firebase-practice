import { Timestamp } from "firebase/firestore";
export interface UpLoadedImages {
  userUid: string;
  id: string;
  storageURL: string;
  dataURL: string;
  fileName: string;
  createdAt: Timestamp;
}
