/**
 * Backend Config Plugin
 * ─────────────────────
 * Controls which EverShop backend the storefront talks to.
 *
 * To switch backend, set NEXT_PUBLIC_BACKEND in .env.local:
 *   NEXT_PUBLIC_BACKEND=local   → http://localhost:3000  (default)
 *   NEXT_PUBLIC_BACKEND=heroku  → uses EVERSHOP_API_URL env var
 *   NEXT_PUBLIC_BACKEND=custom  → uses EVERSHOP_API_URL env var
 *
 * Or set EVERSHOP_API_URL directly to override everything.
 */

type BackendPreset = 'local' | 'heroku' | 'custom';

const PRESETS: Record<BackendPreset, string> = {
  local:  'http://localhost:3000',
  heroku: process.env.EVERSHOP_API_URL ?? 'https://YOUR-APP.herokuapp.com',
  custom: process.env.EVERSHOP_API_URL ?? 'http://localhost:3000',
};

function resolveBaseUrl(): string {
  // Explicit full URL always wins
  if (process.env.EVERSHOP_API_URL) {
    return process.env.EVERSHOP_API_URL.replace(/\/+$/, '');
  }
  const preset = (process.env.NEXT_PUBLIC_BACKEND ?? 'local') as BackendPreset;
  return (PRESETS[preset] ?? PRESETS.local).replace(/\/+$/, '');
}

export const BACKEND_BASE_URL = resolveBaseUrl();
export const GRAPHQL_ENDPOINT = `${BACKEND_BASE_URL}/api/graphql`;

export function getBackendInfo() {
  return {
    baseUrl: BACKEND_BASE_URL,
    graphql: GRAPHQL_ENDPOINT,
    preset: process.env.NEXT_PUBLIC_BACKEND ?? 'local',
  };
}
