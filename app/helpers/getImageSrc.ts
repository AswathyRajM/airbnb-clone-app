// Function to get the first image URL from listing.imageSrc array
export const getImageSrc = (imageSrc: any): string => {
  console.log({ imageSrc });

  if (Array.isArray(imageSrc) && imageSrc.length > 0) {
    return imageSrc[0]; // Assuming the first element is the image URL
  }
  return imageSrc;
};
