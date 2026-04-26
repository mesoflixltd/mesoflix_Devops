/**
 * Deriv OAuth 2.0 PKCE Utilities
 */

export async function generatePKCE() {
  // 1. Generate a random code_verifier
  const array = new Uint8Array(64);
  window.crypto.getRandomValues(array);
  const codeVerifier = Array.from(array)
    .map(v => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'[v % 66])
    .join('');

  // 2. Derive the code_challenge
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // 3. Generate a random state for CSRF protection
  const stateArray = new Uint8Array(16);
  window.crypto.getRandomValues(stateArray);
  const state = Array.from(stateArray)
    .reduce((s, b) => s + b.toString(16).padStart(2, '0'), '');

  return { codeVerifier, codeChallenge, state };
}

const AFFILIATE_TOKEN = "4PYVLDWB6GK5";

export function initiateDerivAuth(clientId: string, redirectUri: string, challenge: string, state: string, codeVerifier: string, prompt: 'login' | 'registration' = 'login') {
  const url = new URL("https://auth.deriv.com/oauth2/auth");
  url.searchParams.append("response_type", "code");
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("redirect_uri", redirectUri);
  url.searchParams.append("scope", "trade account_manage");
  url.searchParams.append("state", state);
  url.searchParams.append("code_challenge", challenge);
  url.searchParams.append("code_challenge_method", "S256");
  
  // Affiliate Tracking Integration
  url.searchParams.append("t", AFFILIATE_TOKEN);
  url.searchParams.append("utm_source", AFFILIATE_TOKEN);
  url.searchParams.append("utm_medium", "affiliate");
  url.searchParams.append("utm_campaign", "mesoflix_devops");

  if (prompt === 'registration') {
    url.searchParams.append("prompt", "registration");
  }

  // Securely store parameters for the callback
  sessionStorage.setItem('pkce_code_verifier', codeVerifier);
  sessionStorage.setItem('oauth_state', state);

  window.location.href = url.toString();
}
