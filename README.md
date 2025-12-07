# Poputka Mobile 🚗

A ride-sharing mobile application for Kyrgyzstan built with Expo and React Native.

## Features

- 🔐 Phone-based authentication with OTP
- 🚗 Browse available trips with real-time updates (WebSocket)
- ➕ Multi-step trip creation wizard (9 steps)
- 👤 User profile management
- 🌐 Russian/Kyrgyz localization
- 📱 iOS & Android support

## Tech Stack

- **Framework**: Expo + React Native
- **Routing**: Expo Router (file-based)
- **State Management**: TanStack React Query
- **API Client**: openapi-fetch + openapi-react-query
- **Styling**: React Native StyleSheet
- **Authentication**: JWT with expo-secure-store

## Prerequisites

- Node.js 18+
- npm or yarn
- iOS Simulator (macOS) or Android Emulator
- EAS CLI (for builds): `npm install -g eas-cli`

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   - The API URL is configured in `eas.json` build profiles
   - For local development, it defaults to `http://localhost:8000`

## Development

Start the development server:
```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web

### Run on specific platforms:
```bash
npm run ios        # Run on iOS
npm run android    # Run on Android
npm run web        # Run on web
```

## Building

### Local Builds (using EAS)

**Development builds (localhost API):**
```bash
npm run build:local:dev:android     # Android APK for localhost
npm run build:local:dev:ios         # iOS for simulator with localhost
```

**Staging builds:**
```bash
npm run build:local:staging:android # Android APK for staging API
npm run build:local:staging:ios     # iOS for staging API
```

**Production builds:**
```bash
npm run build:local:prod:android    # Android APK for production API
npm run build:local:prod:ios        # iOS for production API
```

### Cloud Builds (using EAS)

**Development:**
```bash
npm run build:dev:android
npm run build:dev:ios
```

**Preview:**
```bash
npm run build:preview:android
npm run build:preview:ios
```

**Production:**
```bash
npm run build:prod:android
npm run build:prod:ios
```

## EAS Build Profiles

The project uses EAS Build with the following profiles configured in `eas.json`:

- **`local-dev`**: Local builds pointing to `http://localhost:8000`
- **`local-staging`**: Local builds pointing to staging API
- **`local-production`**: Local builds pointing to production API
- **`development`**: Development client with localhost API
- **`preview`**: Preview builds with production API
- **`production`**: Production builds with production API

## API Configuration

The API URL is configured via the `EXPO_PUBLIC_API_URL` environment variable in build profiles.

Available endpoints:
- **Local**: `http://localhost:8000`
- **Staging**: `https://staging-api.poputka.app`
- **Production**: `https://api.poputka.app`

To generate TypeScript types from the API schema:
```bash
npx openapi-typescript https://api.poputka.app/openapi.json -o ./api/paths.d.ts
```

## Project Structure

```
poputka_mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen (browse trips)
│   │   ├── create.tsx     # Trip creation wizard
│   │   ├── my-trips.tsx   # User's trips
│   │   └── profile.tsx    # User profile
│   ├── auth/              # Authentication screens
│   │   ├── phone.tsx      # Phone number input
│   │   └── verify.tsx     # OTP verification
│   └── _layout.tsx        # Root layout with auth check
├── api/                   # API client
│   ├── index.ts          # OpenAPI fetch client
│   └── paths.d.ts        # Auto-generated API types
├── components/            # Reusable components
├── constants/             # Colors, theme, env
├── utils/                 # Helper functions
└── types/                 # TypeScript types
```

## Features Status

### ✅ Implemented
- Phone authentication (OTP)
- Browse trips with infinite scroll
- Real-time trip updates via WebSocket
- Multi-step trip creation (9 steps)
- User profile with real API data
- Russian/Kyrgyz localization

### 🚧 Pending (API not available)
- View user's own trips
- Edit/delete trips
- Trip statistics
- Saved locations
- Vehicle management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue on the GitHub repository.
