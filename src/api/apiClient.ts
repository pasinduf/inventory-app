import axios from 'axios';
import { TokenRepository } from './auth/tokenRepositoryInterface';

export const createClient = ({
  tokenRepository,
}: {
  tokenRepository: TokenRepository;
}) => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_APP_SERVER_PATH, //'/api' 
  });

  //let refreshRequest: AxiosPromise | null = null;

  client.interceptors.request.use((config: any) => {
    const accessToken = tokenRepository.getAccessToken();
    if (!accessToken) {
      return config;
    }
    const newConfig = {
      ...config,
      headers: {},
    };

    newConfig.headers.Authorization = `Bearer ${accessToken}`;
    return newConfig;
  });

  return client;
};
