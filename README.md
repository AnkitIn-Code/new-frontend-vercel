# Frontend Environment Configuration

This project is a Create React App frontend. API calls use an environment-based base URL and automatically attach a JWT Authorization header when available.

## Environment variable

Create a `.env` file in the project root (same folder as `package.json`) with:

```
REACT_APP_API_BASE_URL=https://your-backend.onrender.com
```

- In development, if `REACT_APP_API_BASE_URL` is not set, axios will use relative paths (e.g. `/api/...`) against the same origin. For local dev with a separate backend port, set `REACT_APP_API_BASE_URL` to your local backend (e.g., `http://localhost:5000`).
- After changing `.env`, restart the dev server.

## Where it's used

- All axios requests use a centralized `axiosInstance` with `baseURL` from the env var: `src/config/api.js`.
- `axiosInstance` automatically includes `Authorization: Bearer <token>` if `localStorage.authToken` exists.
- For `fetch`, use `authFetch(pathOrUrl, options)` from the same file to automatically attach the token. `apiUrl(path)` remains available to build URLs when needed.

Files updated to use the env base URL:
- `src/context/AuthContext.js`
- `src/pages/PostList.js`
- `src/pages/AdminDashboard.js`

## Vercel deployment

Define the same environment variable in your Vercel project settings:
- Key: `REACT_APP_API_BASE_URL`
- Value: `https://your-backend.onrender.com`
- Apply to: Production, Preview, and Development environments as needed.
- Redeploy to apply changes.

### CORS and credentials

- The frontend uses `withCredentials: true` for axios and passes `credentials: 'include'` in the `authFetch` helper.
- Ensure the backend CORS configuration allows your Vercel domain and credentials:
  - `origin: ["https://<your-frontend>.vercel.app"]`
  - `credentials: true`
  - Allow headers: `Authorization, Content-Type`
  - Allow methods: `GET, POST, PUT, DELETE, OPTIONS`

If you see 401/403 or CORS errors in production, confirm these backend settings and that `REACT_APP_API_BASE_URL` points to the correct backend URL.

## Helpers

- `src/config/api.js` exports:
  - `API_BASE_URL` — resolved from env (defaults to empty string in dev)
  - `apiUrl(path)` — prefixes a path with the base URL
  - `axiosInstance` — preconfigured axios client with `baseURL`, `withCredentials: true`, and an Authorization header interceptor
  - `authFetch(pathOrUrl, options)` — `fetch` wrapper that adds Authorization and credentials

### Auth token storage

- After successful login/register, the JWT is saved to `localStorage` under the key `authToken`.
- Protected routes also verify the presence of `authToken` in `localStorage`.
