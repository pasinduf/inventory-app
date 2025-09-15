import { TokenRepository } from './tokenRepositoryInterface';
const authKey = 'auth';

export const createTokenRepository = (): TokenRepository => {
  return {
    getAccessAuth() {
      return localStorage.getItem(authKey);
    },

    setAccessAuth(token: string) {
      localStorage.setItem(authKey, token);
    },

    getAccessToken() {
      const auth: any = localStorage.getItem(authKey);
      return JSON.parse(auth)?.accessToken;
    },

    removeAccessAuth() {
      localStorage.removeItem(authKey);
    },

    // getUserRole() {
    //   const token = localStorage.getItem(authKey);

    //   if (!token) {
    //     return null;
    //   }

    //   const parsedToken: any = parseJwt(token);

    //   const userRole = () => {
    //     if (parsedToken['roles'].includes(ROLES.ADMIN)) {
    //       return ROLES.ADMIN;
    //     } else if (parsedToken['roles'].includes(ROLES.MANAGER)) {
    //       return ROLES.MANAGER;
    //     }else if (parsedToken['roles'].includes(ROLES.DEVELOPER)) {
    //       return ROLES.DEVELOPER;
    //     } else {
    //       return ROLES.COLLECTION_OFFICER;
    //     }
    //   };

    //   return userRole();
    // },

    // getUserAccess() {
    //   const token = localStorage.getItem(authKey);

    //   if (!token) {
    //     return null;
    //   }
    //   const parsedToken: any = parseJwt(token);

    //   return parsedToken.access || []
    // },
  };
};
