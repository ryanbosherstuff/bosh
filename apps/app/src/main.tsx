import { createRoot } from 'react-dom/client'
import { App as CapApp, type AppState } from '@capacitor/app'
import { SplashScreen } from '@capacitor/splash-screen'
import { type BundleInfo, CapacitorUpdater } from '@capgo/capacitor-updater'

import { App } from './app'

CapacitorUpdater.notifyAppReady().catch(console.error)

let bundle: BundleInfo | undefined = undefined

CapApp.addListener('appStateChange', async (state: AppState) => {
  console.log('BOSH: app: appStateChange!!!!!!!!!!!!!!!!!!!!!!:', state)

  if (state.isActive) {
    // Ensure download occurs while the app is active, or download may fail
    bundle = await CapacitorUpdater.download({
      version: '0.0.3',
      url: 'https://github.com/Cap-go/demo-app/releases/download/0.0.3-v4/dist.zip',
    })
  }

  if (!state.isActive && bundle) {
    console.log('App is background')
    const list = await CapacitorUpdater.list()
    console.log('bundle list', JSON.stringify(list))
    // Activate the update when the application is sent to background
    await SplashScreen.show()
    try {
      console.log('BOSH: app: in try:');
      await CapacitorUpdater.set({ id: bundle.id })
      // At this point, the new bundle should be active, and will need to hide the splash screen
    } catch (e) {
      console.log('BOSH: use-app-listeners: e:', e)
      await SplashScreen.hide() // Hide the splash screen again if something went wrong
    }
  }
})

const root = createRoot(
  document.getElementById('root') as HTMLElement
)
// No strict mode to avoid double rendering
root.render(<App/>)
