import { type FC } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { App as CapApp, type AppState } from '@capacitor/app'
import { SplashScreen } from '@capacitor/splash-screen'
import { type BundleInfo, CapacitorUpdater } from '@capgo/capacitor-updater'
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

import { Menu, Page } from '@frontend'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'
/* Theme variables */
import '../theme/variables.css'

setupIonicReact()
CapacitorUpdater.notifyAppReady().catch(console.error)

export const App: FC = () => {
  CapApp.addListener('appStateChange', async (state: AppState) => {
    console.log('BOSH: app: appStateChange:', state);
    let bundle: BundleInfo | undefined = undefined

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
        await CapacitorUpdater.set({ id: bundle.id })
        // At this point, the new bundle should be active, and will need to hide the splash screen
      } catch (e) {
        console.log('BOSH: use-app-listeners: e:', e)
        await SplashScreen.hide() // Hide the splash screen again if something went wrong
      }
    }
  })

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu/>
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/folder/Inbox"/>
            </Route>
            <Route path="/folder/:name" exact={true}>
              <Page/>
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  )
}
