# Baby Names Mobile App

React Native application (Expo) for collaboratively discovering baby names with your partner. The project ships with TypeScript, ESLint, Prettier, React Navigation, Zustand, React Query and testing tooling (Jest + Detox).

## Getting started

```bash
cd mobile
npm install
```

> **Note:** If you are using `yarn` or `pnpm` feel free to replace `npm` with the package manager of your choice.

### Development commands

| Command | Description |
| --- | --- |
| `npm run start` | Start Expo development server. |
| `npm run android` | Start the Android simulator (requires local Android tooling). |
| `npm run ios` | Start the iOS simulator (requires Xcode). |
| `npm run web` | Run Expo on the web target. |
| `npm run lint` | Run ESLint using the shared configuration. |
| `npm run typecheck` | Verify TypeScript types without emitting files. |
| `npm test` | Execute unit tests with Jest and React Testing Library. |
| `npm run test:e2e` | Run Detox tests on iOS simulator (requires build). |
| `npm run test:e2e:android` | Run Detox tests on Android emulator. |

> **Assets note:** The repository omits generated icon/splash images. Provide your own assets in `mobile/assets/` or update
> `app.json` to point at branding appropriate for your build before publishing.

## Architecture overview

- **Navigation** is handled via `@react-navigation/native` in `src/navigation`.
- **State management** combines [Zustand](https://github.com/pmndrs/zustand) for synchronous state and [React Query](https://tanstack.com/query/latest) for server cache.
- **API client** (`src/services/api.ts`) wraps Axios with interceptors, JWT persistence (SecureStore with AsyncStorage fallback) and helper functions for the relevant endpoints.
- **Auth context** (`src/context/AuthContext.tsx`) bootstraps persisted credentials, toggles between public/authenticated navigation stacks, and reacts to token expiry events emitted by the API client.
- **Screens** live in `src/screens` and map directly to stack routes.
- **Reusable components** can be found in `src/components`.
- **Tests**
  - Unit tests: `__tests__/*.test.tsx` run with Jest + React Testing Library.
  - E2E tests: `e2e/*.e2e.ts` run with Detox (see below).

## Secure token storage

The API client stores JWT access tokens in Expo SecureStore when available, falling back to AsyncStorage during development or web builds. All requests automatically attach the bearer token via Axios interceptors.

## Detox setup

Detox requires a compiled binary of your Expo project. A minimal workflow:

```bash
# Build once per platform
npx expo run:ios --configuration Debug
npx expo run:android --variant debug

# Execute tests
npm run test:e2e
npm run test:e2e:android
```

Configure the simulator/emulator identifiers in `detox.config.js` to match your local environment.

## Environment variables

The API base URL reads from `expo.extra.apiUrl` when defined in `app.json` or `app.config.js`. By default it points to `http://localhost:3000` for development.

## Project structure

```
mobile/
├── App.tsx
├── app.json
├── assets/
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── store/
│   └── types/
├── __tests__/
├── e2e/
├── tsconfig.json
├── jest.config.js
├── detox.config.js
└── package.json
```
