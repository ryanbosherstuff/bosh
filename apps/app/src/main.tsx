import { createRoot } from 'react-dom/client'
import { App as CapApp, type AppState } from '@capacitor/app'
import { SplashScreen } from '@capacitor/splash-screen'
import {
  type BundleInfo,
  CapacitorUpdater,
  type DownloadCompleteEvent,
  type DownloadEvent,
  type DownloadFailedEvent,
  type updateAvailableEvent
} from '@capgo/capacitor-updater'

import { App } from './app'

CapacitorUpdater.removeAllListeners().catch(console.error)
CapacitorUpdater.notifyAppReady().catch(console.error)

let bundle: BundleInfo | undefined = undefined

CapApp.addListener('appStateChange', async (state: AppState) => {
  console.log('BOSH: app: appStateChange!!!!!!!!!!!!!!!!!!!!!!:', state)

  if (state.isActive) {
    const { version, url } = await CapacitorUpdater.getLatest()

    if (version && url) {
      // Ensure download occurs while the app is active, or download may fail
      bundle = await CapacitorUpdater.download({
        version: version,
        url: url,
      })
    }
  }

  if (!state.isActive && bundle) {
    console.log('App is background')
    const list = await CapacitorUpdater.list()
    console.log('bundle list', JSON.stringify(list))
    // Activate the update when the application is sent to background
    await SplashScreen.show()
    try {
      console.log('BOSH: app: in try:')
      await CapacitorUpdater.set({ id: bundle.id })
      // At this point, the new bundle should be active, and will need to hide the splash screen
    } catch (e) {
      console.log('BOSH: use-app-listeners: e:', e)
      await SplashScreen.hide() // Hide the splash screen again if something went wrong
    }
  }
})

CapacitorUpdater.addListener('download', async (downloadEvent: DownloadEvent) => {
  const { percent } = downloadEvent

  if (percent % 10 === 0) {
    console.log('BOSH: use-app-listeners: downloadEvent:', JSON.stringify(downloadEvent))
  }
})

CapacitorUpdater.addListener('downloadComplete', async (downloadCompleteEvent: DownloadCompleteEvent) => {
  console.log('BOSH: use-app-listeners: downloadCompleteEvent:', JSON.stringify(downloadCompleteEvent))
})

CapacitorUpdater.addListener('updateAvailable', async (updateAvailableEvent: updateAvailableEvent) => {
  console.log('BOSH: use-app-listeners: updateAvailableEvent:', JSON.stringify(updateAvailableEvent))

})

CapacitorUpdater.addListener('downloadFailed', async (downloadFailedEvent: DownloadFailedEvent) => {
  console.log('BOSH: use-app-listeners: downloadFailedEvent:', JSON.stringify(downloadFailedEvent))
})

const root = createRoot(
  document.getElementById('root') as HTMLElement
)
// No strict mode to avoid double rendering
root.render(<App/>)
