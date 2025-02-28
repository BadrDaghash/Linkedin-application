import CryptoJS from "crypto-js";
export const encrypt = ({ plainText, secret_key = process.env.SECRET_KEY }) => {
  return CryptoJS.AES.encrypt(plainText, secret_key).toString();
};

export const decrypt = ({ cipherText, secret_key = process.env.SECRET_KEY }) => {
  return CryptoJS.AES.decrypt(cipherText, secret_key).toString(CryptoJS.enc.Utf8);
};
