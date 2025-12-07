# Poputka Mobile - Build Guide

Quick reference for building the app with different API configurations.

## Prerequisites

```bash
npm install -g eas-cli
eas login
```

## Quick Commands

### For Local Testing (Localhost API)

```bash
# Android APK
npm run build:local:dev:android

# iOS Simulator
npm run build:local:dev:ios
```

**API URL**: `http://localhost:8000`

### For Staging Testing

```bash
# Android APK
npm run build:local:staging:android

# iOS Device
npm run build:local:staging:ios
```

**API URL**: `https://staging-api.poputka.app`

### For Production Testing

```bash
# Android APK
npm run build:local:prod:android

# iOS Device
npm run build:local:prod:ios
```

**API URL**: `https://api.poputka.app`

## Build Profiles Explained

| Profile | API URL | Platform | Build Type | Use Case |
|---------|---------|----------|------------|----------|
| `local-dev` | `http://localhost:8000` | iOS/Android | Local | Development with local backend |
| `local-staging` | `https://staging-api.poputka.app` | iOS/Android | Local | Testing with staging backend |
| `local-production` | `https://api.poputka.app` | iOS/Android | Local | Testing production build locally |
| `development` | `http://localhost:8000` | iOS/Android | Cloud | Development builds on EAS |
| `preview` | `https://api.poputka.app` | iOS/Android | Cloud | Preview/internal testing |
| `production` | `https://api.poputka.app` | iOS/Android | Cloud | Production release |

## Local Build Process

When you run a local build command, EAS will:

1. ✅ Use your local machine to build
2. ✅ Configure the API URL based on the profile
3. ✅ Generate an APK (Android) or .app (iOS)
4. ✅ Output the build to your local directory

### Android Output
APK will be in: `./build-<timestamp>/android/app/build/outputs/apk/release/`

### iOS Output
.app will be in the build output directory for simulator builds

## Cloud Build Process

Cloud builds are processed on EAS servers:

```bash
# Submit to EAS (builds in the cloud)
npm run build:dev:android
npm run build:preview:ios
npm run build:prod:android
```

Monitor builds at: https://expo.dev/accounts/muratsat/projects/poputka_mobile/builds

## Testing Builds

### Android APK
```bash
# Install on connected device or emulator
adb install path/to/app.apk
```

### iOS Simulator
```bash
# Drag and drop .app to simulator, or:
xcrun simctl install booted path/to/app.app
```

## Environment Variables

Each build profile can have different environment variables configured in `eas.json`:

```json
{
  "env": {
    "EXPO_PUBLIC_API_URL": "https://your-api-url.com"
  }
}
```

## Troubleshooting

### Build fails locally
- Make sure you have Android Studio / Xcode installed
- Check `eas build:configure` is set up correctly
- Ensure all dependencies are installed: `npm install`

### Wrong API URL
- Check the profile in `eas.json`
- Verify the environment variable is correct
- Clear build cache: `eas build:configure`

### iOS Simulator build doesn't run
- Ensure you're using a simulator-compatible build
- Try: `xcrun simctl list` to see available simulators
- Reset simulator if needed

## Advanced: Custom API URL

To build with a custom API URL without changing `eas.json`:

```bash
EXPO_PUBLIC_API_URL=https://custom-api.com eas build --profile local-dev --platform android --local
```

## Quick Tips

- **Local builds** = Faster, uses your machine, good for testing
- **Cloud builds** = Slower, uses EAS servers, needed for app stores
- **Development builds** = Include dev tools, larger size
- **Production builds** = Optimized, smaller size, ready for release

## Next Steps After Build

1. **Android**: Install APK on device/emulator
2. **iOS**: Run on simulator or archive for TestFlight
3. **Test**: Verify API connectivity and features
4. **Deploy**: Submit to stores using EAS Submit

```bash
# Submit to stores
eas submit --platform ios
eas submit --platform android
```
