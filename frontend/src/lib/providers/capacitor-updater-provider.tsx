import { type Context, createContext, type FC, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { App, type AppState } from '@capacitor/app'
import { type PluginListenerHandle } from '@capacitor/core'
import {
  type AppReadyEvent,
  type BundleInfo,
  CapacitorUpdater,
  type DownloadEvent,
  type DownloadFailedEvent,
  type updateAvailableEvent
} from '@capgo/capacitor-updater'

interface CapacitorUpdaterContextType {
  currentBundle: () => Promise<BundleInfo>
}

const CapacitorUpdaterContext: Context<CapacitorUpdaterContextType> = createContext({} as CapacitorUpdaterContextType)
export const useCapacitorUpdaterContext = () => useContext(CapacitorUpdaterContext)

let bundleLol: BundleInfo

export const CapacitorUpdateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Reference to the next bundle to be applied
  const [bundle, setBundle] = useState<BundleInfo>()
  const [appStateChangeListener, setAppStateChangeListener] = useState<PluginListenerHandle>()

  /**
   * @private
   * Set up the '@capacitor/app' listener to apply the bundle when the app enters the background
   */
  const setupAppListener = async () => {
    // Set a state variable to keep track of the listener for removing later
    setAppStateChangeListener(await App.addListener('appStateChange', async (state: AppState) => {
      console.log('BOSH: capacitor-updater-provider: appStateChange: bundle: ', bundle)

      let localBundle: BundleInfo
      if (bundle) {
        localBundle = bundle
        console.log('BOSH: capacitor-updater-provider: state bundle GOOD');
      } else {
        localBundle = bundleLol
        console.log('BOSH: capacitor-updater-provider: state bundle BAD, bundleLOL GOOOOD');
      }

      // If app has entered background, and we have a bundle downloaded, apply it.
      if (!state.isActive && localBundle) {
        console.log('App is background')
        const list = await CapacitorUpdater.list()
        console.log('bundle list', JSON.stringify(list))
        // Activate the update when the application is sent to background
        // await SplashScreen.show()
        try {
          console.log('BOSH: app: in try:')
          await CapacitorUpdater.set({ id: localBundle.id })
          // Clear the state variable to prevent applying the same bundle again
          setBundle(undefined)
          // At this point, the new bundle should be active, and will need to hide the splash screen
          // await SplashScreen.hide()
        } catch (e) {
          console.log('BOSH: use-app-listeners: e:', e)
          // Hide the splash screen again if something went wrong
          // await SplashScreen.hide()
        }
      }
    }))

    await App.addListener('pause', async () => {
      console.log('BOSH: capacitor-updater-provider onPause lol: bundle:', bundle)
    })
  }

  /**
   * @private
   * Set up the '@capgo/capacitor-updater' listeners
   */
  const setupCapacitorUpdaterListeners = async () => {
    CapacitorUpdater.addListener('appReady', async (appReadyEvent: AppReadyEvent) => {
      console.log('BOSH: use-app-listeners: appReadyEvent:', JSON.stringify(appReadyEvent))
    })

    CapacitorUpdater.addListener('download', async (downloadEvent: DownloadEvent) => {
      const { percent } = downloadEvent

      if (percent === 10) {
        console.log('BOSH: main: file download starting:')
      }

      if (percent === 70) {
        console.log('BOSH: main: file download complete:')
      }

      if (percent === 71) {
        console.log('BOSH: main: file unzip starting:')
      }

      if (percent === 91) {
        console.log('BOSH: main: file unzip completed:')
      }
    })

    CapacitorUpdater.addListener('downloadComplete', async () => {
      console.log('BOSH: main: total download procedure completed:')

    })

    CapacitorUpdater.addListener('downloadFailed', async (downloadFailedEvent: DownloadFailedEvent) => {
      console.log('BOSH: use-app-listeners: downloadFailedEvent:', JSON.stringify(downloadFailedEvent))
    })

    CapacitorUpdater.addListener('updateAvailable', async (updateAvailableEvent: updateAvailableEvent) => {
      // TODO: show an ion alert
      console.log('BOSH: use-app-listeners: updateAvailableEvent:', JSON.stringify(updateAvailableEvent))

      // Set the bundle to the new update as it's now ready
      bundleLol = updateAvailableEvent.bundle
      setBundle(updateAvailableEvent.bundle)
    })
  }

  /**
   * @private
   * Combined function to set up all required listeners
   */
  const setupListeners = async () => {
    await setupCapacitorUpdaterListeners()
    await setupAppListener()

  }

  /**
   * @private
   * Remove all listeners
   */
  const removeListeners = async () => {
    // Remove all update listeners as they are only used here
    CapacitorUpdater.removeAllListeners().catch(console.error)

    // Only remove the appStateChangeListener if it exists.
    appStateChangeListener && appStateChangeListener.remove().catch(console.error)
  }

  /**
   * @public
   * Returns the current bundle from the updater plugin
   */
  const currentBundle = async () => {
    const { bundle } = await CapacitorUpdater.current()
    return bundle
  }

  /**
   * @private
   * Checks for an update on the server and downloads it if available, saves it to state ready to apply on appStateChange
   */
  const initialUpdate = async () => {
    // Prepare next bundle for update
    const { version, url } = await CapacitorUpdater.getLatest()

    // If we have the vars, get the new bundle and save to state
    if (url) {
      const bundle = await CapacitorUpdater.download({
        version,
        url,
      })

      // Save the bundle to state, ready for the appStateChange listener to apply the bundle.
      setBundle(bundle)
      bundleLol = bundle
    }
  }

  useEffect(() => {
    const init = async () => {
      // Set up listeners first
      await setupListeners()

      // Then, tell plugin we are ready
      await CapacitorUpdater.notifyAppReady().catch(console.error)

      // Finally start the update initial update
      await initialUpdate()
    }

    init().catch(console.error)

    // On unmount, remove listeners
    return () => {
      removeListeners().catch(console.error)
    }
  }, [])

  return (
    <CapacitorUpdaterContext.Provider value={useMemo((): CapacitorUpdaterContextType => ({
        currentBundle
      }), []
    )}>
      {children}
    </CapacitorUpdaterContext.Provider>
  )
}
