import googleImages from 'google-images';


export const searchImage = (barcode= '9788324694303') => {
  let client = googleImages(process.env.CSE_ID, process.env.GOOGLE_API_KEY);

  return client.search(barcode, {size: 'large'}).then(images => (images[0].url));
};
