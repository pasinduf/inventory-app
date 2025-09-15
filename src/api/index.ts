import { createClient } from './apiClient';
import { createTokenRepository } from './auth/tokenRepository';

export const tokenRepository = createTokenRepository();
export const apiClient = createClient({ tokenRepository });
