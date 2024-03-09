import { type Context, createContext, type FC, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { App, type AppState } from '@capacitor/app'
import { type PluginListenerHandle } from '@capacitor/core'
import {
  type AppReadyEvent,
  type BundleInfo,
  CapacitorUpdater,
  type DownloadCompleteEvent,
  type DownloadEvent,
  type DownloadFailedEvent,
  type updateAvailableEvent
} from '@capgo/capacitor-updater'

interface CapacitorUpdaterContextType {
  getCurrentBundle: () => Promise<BundleInfo>
}

const CapacitorUpdaterContext: Context<CapacitorUpdaterContextType> = createContext({} as CapacitorUpdaterContextType)
export const useCapacitorUpdaterContext = () => useContext(CapacitorUpdaterContext)

export const CapacitorUpdateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Reference to the next bundle to be applied
  const [bundle, setBundle] = useState<BundleInfo>()
  const [appStateChangeListener, setAppStateChangeListener] = useState<PluginListenerHandle>()

  const setupCapacitorUpdaterListeners = async () => {
    CapacitorUpdater.addListener('appReady', async (appReadyEvent: AppReadyEvent) => {
      console.log('BOSH: use-app-listeners: appReadyEvent:', JSON.stringify(appReadyEvent))
    })

    CapacitorUpdater.addListener('updateAvailable', async (updateAvailableEvent: updateAvailableEvent) => {
      console.log('BOSH: use-app-listeners: updateAvailableEvent:', JSON.stringify(updateAvailableEvent))
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

    CapacitorUpdater.addListener('downloadFailed', async (downloadFailedEvent: DownloadFailedEvent) => {
      console.log('BOSH: use-app-listeners: downloadFailedEvent:', JSON.stringify(downloadFailedEvent))
    })
  }

  const setupListeners = async () => {
    await setupCapacitorUpdaterListeners()
    // Set a state variable to keep track of the listener for removing later
    setAppStateChangeListener(await App.addListener('appStateChange', async (state: AppState) => {
      if (state.isActive) {
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
        }
      }

      // If app has entered background, and we have a bundle downloaded, apply it.
      if (!state.isActive && bundle) {
        console.log('App is background')
        const list = await CapacitorUpdater.list()
        console.log('bundle list', JSON.stringify(list))
        // Activate the update when the application is sent to background
        // await SplashScreen.show()
        try {
          console.log('BOSH: app: in try:')
          await CapacitorUpdater.set({ id: bundle.id })
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
  }

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
  const getCurrentBundle = async () => {
    const { bundle } = await CapacitorUpdater.current()
    return bundle
  }

  useEffect(() => {
    const init = async () => {
      // Set up listeners first
      await setupListeners()

      // Then, tell plugin we are ready to check and install updates
      await CapacitorUpdater.notifyAppReady().catch(console.error)
    }

    init().catch(console.error)

    // On unmount, remove listeners
    return () => {
      removeListeners().catch(console.error)
    }
  }, [])

  const CapacitorUpdaterProviderValue: CapacitorUpdaterContextType = useMemo(
    (): CapacitorUpdaterContextType => ({
      getCurrentBundle
    }),
    []
  )

  return (
    <CapacitorUpdaterContext.Provider value={CapacitorUpdaterProviderValue}>
      {children}
    </CapacitorUpdaterContext.Provider>
  )
}
