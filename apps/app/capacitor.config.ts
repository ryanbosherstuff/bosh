import { type CapacitorConfig } from '@capacitor/cli'
import { networkInterfaces } from 'node:os'

/**
 * Helper function to get machine's local ip address if live-reloading Android
 */
const getIpAddress = (): string | undefined => {
  const interfaces = networkInterfaces()

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]!) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }

  return undefined
}

/**
 * Sets the live reload server if live env var is set. Defaults to empty object
 */
const getWebServerURL = () => {
  if (process.env['LIVE']) {
    let url: string

    const ip = getIpAddress()

    if (!ip) throw ('Failed to obtain IP address')

    // iOS Simulator uses the same ip as host device, Android does not.
    // Use localhost on iOS so that live reload can access more environments.
    if (process.env['PLATFORM'] === 'IOS') {
      url = 'http://localhost:4200'
    } else if (ip) {
      url = `http://${ip}:4200`
    }

    console.log(`Live reloading enabled. Serving: ${url}`)

    return {
      url,
      cleartext: true,
    }
  } else return {}
}

const getUpdateServerURL = (): string => {
  const ip = getIpAddress()
  const env = process.env['NX_UIRA_ENVIRONMENT'] || 'PROD'

  if (!ip) throw ('Failed to obtain IP address')

  const url = `http://${ip}:3000/updates/${env.toLowerCase()}`

  console.log('BOSH: capacitor.config: update server url:', url)

  return url
}

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
  server: getWebServerURL(),
  ios: {
    path: 'ios',
    // Use a mobile useragent on iPad, resolves SRP-3779
    preferredContentMode: 'mobile',
    // Force webview debugging on unless uira env is prod
    webContentsDebuggingEnabled: true
  },
  includePlugins: [
    '@capacitor/app',
    '@capacitor/browser',
    '@capacitor/device',
    '@capacitor/haptics',
    '@capacitor/keyboard',
    '@capacitor/network',
    '@capacitor/splash-screen',
    '@capacitor/status-bar',
    '@capgo/capacitor-updater',
  ],
  plugins: {
    CapacitorUpdater: {
      autoUpdate: false,
      updateUrl: getUpdateServerURL(),
      // autoUpdate: true,
      // directUpdate: true,
      // allowModifyUrl: true,
      statsUrl: '',
      // version: '0.0.1',
      defaultChannel: 'test'
    },
    CapacitorCookies: {
      enabled: true,
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
