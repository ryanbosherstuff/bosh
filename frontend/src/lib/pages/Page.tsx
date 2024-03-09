import { type FC } from 'react'
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'

import { useCapacitorUpdaterContext } from '../providers'

import './Page.css'

export const Page: FC = () => {

  const { currentBundle } = useCapacitorUpdaterContext()

  console.log('BOSH: Page: currentBundle:', JSON.stringify(currentBundle))

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton/>
          </IonButtons>
          <IonTitle>0.0.1</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">0.0.1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <h1>
          This is app version 0.0.1. (builtin)
        </h1>
        <p>
          Try putting the app into background for a bit then re-opening it.
        </p>
      </IonContent>
    </IonPage>
  )
}
