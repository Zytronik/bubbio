import { jwtDecode, JwtPayload } from "jwt-decode";
import { reconnectGlobalSocket } from "./networking.client-websocket";
import { httpClient } from "./networking.http-client";
import axios from "axios";
import eventBus from "../page/page.event-bus";

export async function logUserOut() {
  const authToken = localStorage.getItem('authToken');

  // Attempt to make the logout request if there's a token
  if (authToken) {
    try {
      await httpClient.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  clearClientState();
  showLoginForm();
  reconnectGlobalSocket();
}

export function clearClientState() {
  // Delete the authentication cookie
  document.cookie = 'authToken=; Max-Age=0; path=/; domain=yourdomain.com';
  localStorage.clear();
  sessionStorage.clear();
}

export function showLoginForm() {
  eventBus.setShowLogin(true);
}

export async function login(username: string, password: string): Promise<{success: boolean, error: string}> {
  try {
    const response = await httpClient.post('/auth/login', { username, password });

    // Assuming the token is in response.data.access_token
    const token = response.data.access_token;
    if (token) {
      // Store the token in local storage
      localStorage.setItem('authToken', token);
      /* state.socket?.emit('userAuthenticated'); */
      return { success: true, error: '' };
    } else {
      return { success: false, error: 'No token received' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, error: error.response?.data?.message[0] || 'Login failed' };
    } else {
      return { success: false, error: 'An unknown error occurred' };
    }
  }
}

export async function register(username: string, password: string, passwordAgain: string): Promise<{success: boolean, error: string}> {
  if (password !== passwordAgain) {
    return { success: false, error: 'Passwords do not match' };
  }

  try {
    await httpClient.post('/auth/register', { username, password });
    /* state.socket?.emit('userAuthenticated'); */
    return { success: true, error: '' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, error: error.response?.data?.message[0] || 'Registration failed' };
    } else {
      return { success: false, error: 'An unknown error occurred' };
    }
  }
}

export async function loginAsGuest(username: string) {
  sessionStorage.setItem('isGuest', 'true');
  if(username.length < 5){
    username = generateRandomString(6);
  }
  sessionStorage.setItem('guestUsername', username );
  /* state.socket?.emit('guestLoggedIn'); */
}

function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function checkIfUsernameIsTaken(username: string): Promise<boolean> {
  const response = await httpClient.get('/users/userExists', { params: { username } });

  if (response.data) {
    return true;
  } else {
    return false;
  }
}

export function checkUserAuthentication() {
  const token = localStorage.getItem('authToken');
  const isGuest = sessionStorage.getItem('isGuest') === 'true';
  if (token) {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const isExpired = decodedToken && decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : true;

      if (isExpired) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  } else if (isGuest) {
    return true;
  } else {
    return false;
  }
}