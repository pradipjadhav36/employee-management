# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Employee Management

  A responsive React and TypeScript employee directory using Redux Toolkit, Axios, Bootstrap controls, and the provided MockAPI endpoints.

  ## Run locally

  ```sh
  npm install
  npm run dev
  ```

  ## Verify

  ```sh
  npm test
  npm run lint
  npm run build
  ```

  ## Features

  - Loads employees and country options from MockAPI with loading, error, and empty states.
  - Searches by employee ID and displays an explicit not-found state.
  - Creates, edits, and deletes employees through the API; delete requires confirmation.
  - Validates name, email, mobile, country, state, and district before submitting.
  - Maintains normalized employee entities and request states in Redux Toolkit.
  - Keeps presentation controls separate from page-level data and business logic.

  The country endpoint provides country names only, so State and District are required text fields.
```js
