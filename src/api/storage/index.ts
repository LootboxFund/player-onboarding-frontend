import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { v4 as uuidV4 } from "uuid";

const LOOTBOX_ASSET_FOLDER = "assets";

/**
 * Save image to gbucket
 * @param fileDestination filepath within the gbucket
 * @param file
 */
const uploadImageToBucket = async (fileDestination: string, file: File) => {
  // Create a reference to 'mountains.jpg'
  const storageRef = ref(storage, fileDestination);
  // 'file' comes from the Blob or File API
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  console.log("file downlaod url", downloadURL);
  return downloadURL;
};

export const uploadImageToFirebase = async ({
  file,
  folderName,
}: {
  folderName: string;
  folderID?: string;
  file: File;
}): Promise<string> => {
  const extension = file?.name?.split(".").pop();
  const fileID = uuidV4();
  const fileDestination = `${LOOTBOX_ASSET_FOLDER}/${folderName}/${fileID}${
    extension ? "." + extension : ""
  }`;
  const downloadURL = await uploadImageToBucket(fileDestination, file);
  return downloadURL;
};
