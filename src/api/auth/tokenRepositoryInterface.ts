//import { USER_ROLES } from '../RBAC';

export type TokenRepository = {
  getAccessAuth(): string | null;
  setAccessAuth(token: string): void;
  getAccessToken(): string | null;
  removeAccessAuth(): void;
  //getUserRole(): USER_ROLES | null;
 // getUserAccess(): string[] | null;
};
