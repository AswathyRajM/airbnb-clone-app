export const thumbnailGenerator = (url: string) => {
  let splittedUrl = url.split('/upload/');
  return splittedUrl[0] + '/upload/w_120/' + splittedUrl[1];
};
