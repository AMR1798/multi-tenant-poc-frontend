import ApiService from '@/services/ApiService';
import JwtService from '@/services/JwtService';
import toast from '@/utils/toast';
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import axios, { AxiosError } from 'axios';



// need to check if authed (JWT token exists and valid)
// need to refresh JWT using refresh token (if provided)
// need to set user object based on provided JWT token
// need to register user and retrieve JWT token and refresh token
// need to login user and reteieve JWT token and resresh token

// JWT token and refresh token should always be in local storage together

type Token = string;

interface RefreshTokenResponse {
  access: {
    token: Token;
    expires: string;
  },
  refresh: {
    token: Token;
    expires: string;
  }
}

interface User {
  id: Number;
  email: String;
  name: String;
  role: "ADMIN" | "USER" | "SUPERADMIN";
  tenant?: String;
  isEmailVerified: boolean;
}

interface LoginResponse {
  user: User;
  tokens: RefreshTokenResponse
}


export const useAuthStore = defineStore('auth', () => {
  const init = ref(false);
  const isAuthed = ref(false);
  const user = ref<User | undefined>(undefined);
  const router = useRouter(); // Access router instance
  /**
   * set initial auth status of user based on jwt in local storage
   * @returns void
   */
  async function initAuth(): Promise<boolean> {
    if (init.value && user.value) {
      return true;
    }
    init.value = true
    return initToken();
  }

  async function initToken(): Promise<boolean> {
    try {
      await refreshToken()
      user.value = await getMe()
      isAuthed.value = true
      return true;
    } catch (e) {
      // no token or refresh is invalid, return
      return false;
    }
  }

  /**
   * 
   * @returns Token
   * @throws Error
   */
  async function refreshToken(): Promise<Token> {
    // get refresh token from local storage
    const refreshToken = JwtService.getToken(true);

    if (!refreshToken) {
      // throw token not found
      throw new Error('refresh token not found')
    }

    try {
      const res = await ApiService.post<RefreshTokenResponse>('/v1/api/auth/refresh-tokens', {
        refreshToken
      })

      const jwt = res.data.access.token;
      const refToken = res.data.refresh.token;

      // set both token to localStorage
      JwtService.saveToken(jwt)
      JwtService.saveToken(refToken, true)
      return jwt
    } catch (e: any) {
      if (ApiService.isAxiosError(e) && e.response) {
        toast(e.response.data.message, 'Error', 'error')
      }
      JwtService.destroyToken(true)
      JwtService.destroyToken()
      throw new Error('error refreshing token')
    }
  }

  function getBearer(): string | null {
    const token = JwtService.getToken()
    return token ? `Bearer ${token}` : null;
  }

  async function getMe(): Promise<User> {
    const res = await ApiService.query<User>('/v1/api/auth/me', {
      headers: {
        Authorization: getBearer()
      }
    })

    return res.data
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    try {
      const res = await ApiService.post<LoginResponse>('/v1/api/auth/register', {
        name,
        email,
        password
      })

      // set token and initAuth
      const jwt = res.data.tokens.access.token;
      const refToken = res.data.tokens.refresh.token;

      // set both token to localStorage
      JwtService.saveToken(jwt)
      JwtService.saveToken(refToken, true)

      await initAuth()
      // do toast
      toast('Yay', 'Register Success', 'success')
      // redirect user to main page
      router.push('/')
    } catch (e) {
      const error = e as Error | AxiosError;
      // login failed
      // show toast of login failed
      if (axios.isAxiosError(error)) {
        toast(error.response?.data.message, 'Uh Oh!', 'error')
      }

    }
  }

  async function login(email: string, password: string): Promise<void> {
    console.log(router)
    try {
      const res = await ApiService.post<LoginResponse>('/v1/api/auth/login', {
        email,
        password
      })

      // set token and initAuth
      const jwt = res.data.tokens.access.token;
      const refToken = res.data.tokens.refresh.token;

      // set both token to localStorage
      JwtService.saveToken(jwt)
      JwtService.saveToken(refToken, true)

      await initAuth()
      // do toast
      toast('Yay', 'Login Success', 'success')
      // redirect user to main page
      router.push('/')
    } catch (e) {
      const error = e as Error | AxiosError;
      // login failed
      // show toast of login failed
      if (axios.isAxiosError(error)) {
        toast(error.response?.data.message, 'Uh Oh!', 'error')
      }

    }
  }

  async function logout(): Promise<void> {
    const refreshToken = JwtService.getToken(true);
    if (refreshToken) {
      try {
        await ApiService.post<LoginResponse>('/v1/api/auth/logout', {
          refreshToken
        })
        toast('Bye :(', 'Logged out', 'info')
      } catch (e) {
        const error = e as Error | AxiosError;
        // login failed
        // show toast of login failed
        if (!axios.isAxiosError(error)) {
          toast('Uh Oh!', 'Logout API error', 'error')
        }
      }

    }

    // set both token to localStorage
    JwtService.destroyToken()
    JwtService.destroyToken(true)

    isAuthed.value = false
    //unset user
    user.value = undefined
    init.value = false
    // do toast
    // redirect user to main page
    router.push('/')

  }

  function isAdmin(): Boolean {
    return user.value?.role === "ADMIN" || user.value?.role === "SUPERADMIN"
  }

  function getName(): String {
    return String(user.value?.name)
  }

  return {
    initAuth,
    login,
    logout,
    isAuthed,
    user,
    register,
    getBearer,
    isAdmin,
    getName,
    initToken
  }


})
