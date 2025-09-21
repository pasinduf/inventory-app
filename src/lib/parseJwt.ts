import { jwtDecode } from 'jwt-decode';

export const parseJwt = (token: string) => {
  return jwtDecode(token);
};

export const validateJwt = (token: string) => {
  const decoded: any = jwtDecode(token);
  return decoded?.exp * 1000 > new Date().getTime();
};


