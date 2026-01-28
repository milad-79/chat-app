import { isExpired, decodeToken } from "react-jwt";

export const decodeTokenFunc = (token) => {
  return decodeToken(token);
};

export const isExpiredToken = (token) => {
  return isExpired(token);
};
