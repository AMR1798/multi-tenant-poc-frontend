const ID_TOKEN_KEY = "id_token" as string;
const REFRESH_TOKEN_KEY = 'refresh_token' as string;

/**
 * @description get token form localStorage
 */
export const getToken = (refresh = false): string | null => {
  return window.localStorage.getItem(refresh ? REFRESH_TOKEN_KEY : ID_TOKEN_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string, refresh = false): void => {
  window.localStorage.setItem(refresh ? REFRESH_TOKEN_KEY : ID_TOKEN_KEY, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = (refresh = false): void => {
  window.localStorage.removeItem(refresh ? REFRESH_TOKEN_KEY : ID_TOKEN_KEY);
};

export default { getToken, saveToken, destroyToken };
