import { IP_URL } from "@/api/client";
import { IMAGES } from "@/constants/image";

export const filterImage = (image: any) => {
  if (
    image !== null &&
    image !== "" &&
    !image?.includes("googleusercontent.com")
  ) {
    return { uri: `${IP_URL}/${image}` };
  }
  if (image?.includes("googleusercontent.com")) {
    return { uri: `${image}` };
  }

  if (image === null || image === "") {
    return IMAGES.noImage;
  }

  return image;
};

export const createFakeArray = (length: number) => {
  return Array(length)
    .fill(null)
    .map((_, index) => ({ id: String(index) }));
};
