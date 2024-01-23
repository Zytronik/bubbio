import { jwtDecode, JwtPayload } from "jwt-decode";
import { eventBus } from "../page/page.event-bus";
import { disconnectGlobalSocket } from "./networking.client-websocket";
import { httpClient } from "./networking.http-client";
import axios from "axios";

export function logUserOut() {
  const authToken = localStorage.getItem('authToken');

  // If there's a token, include it in the logout request
  if (authToken) {
    httpClient.post('/auth/logout', {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    }).then(() => {
      clearClientState();
      showLoginForm();
    }).catch(error => {
      console.error('Error during logout:', error);
      clearClientState();
      showLoginForm();
    });
  } else {
    clearClientState();
    showLoginForm();
  }
}

export function clearClientState() {
  // Delete the authentication cookie
  document.cookie = 'authToken=; Max-Age=0; path=/; domain=yourdomain.com';
  localStorage.clear();
  sessionStorage.clear();
  disconnectGlobalSocket();
}

export function showLoginForm() {
  if (eventBus.setShowLogin) {
    eventBus.setShowLogin(true);
  }
}

export async function login(username: string, password: string): Promise<{success: boolean, error: string}> {
  try {
    const response = await httpClient.post('/auth/login', { username, password });

    // Assuming the token is in response.data.access_token
    const token = response.data.access_token;
    if (token) {
      // Store the token in local storage
      localStorage.setItem('authToken', token);
      return { success: true, error: '' };
    } else {
      //console.error('No token received');
      return { success: false, error: 'No token received' };
    }
  } catch (error) {
    //console.error('Login failed:', error);
    if (axios.isAxiosError(error)) {
      return { success: false, error: error.response?.data?.message[0] || 'Login failed' };
    } else {
      return { success: false, error: 'An unknown error occurred' };
    }
  }
}

export function checkUserAuthentication() {
  const token = localStorage.getItem('authToken');
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
  } else {
    return false;
  }
}