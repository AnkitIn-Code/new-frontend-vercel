# Frontend Environment Configuration

This project is a Create React App frontend. API calls now use an environment-based base URL, so you can switch between environments without code changes.

## Environment variable

Create a `.env` file in the project root (same folder as `package.json`) with:

```
REACT_APP_API_BASE_URL=https://your-backend.onrender.com
```

- In development, if `REACT_APP_API_BASE_URL` is not set, requests will fall back to relative paths (e.g. `/api/...`). The existing `proxy` in `package.json` will forward these to your local backend.
- After changing `.env`, restart the dev server.

## Where it's used

- All axios requests use a centralized `axiosInstance` with `baseURL` from the env var: `src/config/api.js`
- `fetch` requests use the helper `apiUrl(path)` from the same file.

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

## Helpers

- `src/config/api.js` exports:
  - `API_BASE_URL` — resolved from env (defaults to empty string in dev)
  - `apiUrl(path)` — prefixes a path with the base URL
  - `axiosInstance` — preconfigured axios client with `baseURL` and `withCredentials: true`
