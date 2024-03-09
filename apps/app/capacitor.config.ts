import { type CapacitorConfig } from '@bosh-code/cli'

// Stuff specific config that deviates from base
const config: CapacitorConfig = {
  appId: 'nz.co.bosher.app',
  appName: 'App',
  webDir: '../../dist/apps/app',
  loggingBehavior: 'production',
  android: {
    path: 'android',
    webContentsDebuggingEnabled: true
  },
  ios: {
    path: 'ios',
    // Use a mobile useragent on iPad, resolves SRP-3779
    preferredContentMode: 'mobile',
    // Force webview debugging on unless uira env is prod
    webContentsDebuggingEnabled: true
  },
  includePlugins: [
    '@byteowls/capacitor-oauth2',
    '@capacitor/app',
    '@capacitor/browser',
    '@capacitor/device',
    '@capacitor/haptics',
    '@capacitor/keyboard',
    '@capacitor/network',
    '@capacitor/preferences',
    '@capacitor/push-notifications',
    '@capacitor/share',
    '@capacitor/splash-screen',
    '@capacitor/status-bar',
    '@capacitor/text-zoom',
    '@capgo/capacitor-updater',
    'capacitor-plugin-safe-area',
    'cordova-plugin-inappbrowser',
  ],
  plugins: {
    CapacitorUpdater: {
      autoUpdate: false,
    },
    CapacitorCookies: {
      enabled: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SplashScreen: {
      launchAutoHide: true,
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true,
    },
  },
}

export default config
