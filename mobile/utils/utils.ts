import { IP_URL } from "@/services/client";
import { IMAGES } from "@/constants/image";
import { clsx } from "clsx";

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

export function cn(...inputs: string[]) {
  return clsx(inputs);
}

export type TabItem = {
  key: string;
  name: string;
  params: string | object;
};

export const removeTabsByNames = (
  tabs: any,
  namesToRemove: string[]
): TabItem[] => {
  return tabs.filter((tab: any) => !namesToRemove.includes(tab.name));
};
