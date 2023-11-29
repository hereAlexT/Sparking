import {
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonTextarea,
    IonToggle,
    IonToolbar,
    IonTitle,
    IonPage,
    IonIcon,
    IonButton,
    IonButtons,
    IonMenuButton
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    mailOutline as mailOutLineIcon,
    logOutOutline as logOutOutlineIcon,
} from 'ionicons/icons';
import { useMeta } from '../contexts/MetaContext';
import { settings } from 'ionicons/icons';


const Settings: React.FC = () => {
    console.log("Settings.tsx: Settings")

    return (
        <IonPage id="main" >
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Settings</IonTitle>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent color="light">
                <IonList inset={true}>
                    <IonItem>
                        <IonIcon aria-hidden="true" icon={mailOutLineIcon} slot="start" />
                        <IonLabel>Email</IonLabel>
                        <IonLabel>Email</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonInput label="Subscription"></IonInput>
                    </IonItem>
                </IonList>

                <IonList inset={true}>
                    <IonItem>
                        <IonToggle disabled={true}>
                            <IonLabel>Location Service (Developing)</IonLabel>
                            <IonNote color="medium">Add your location data to every note.</IonNote>
                        </IonToggle>
                    </IonItem>
                </IonList>

                <IonList inset={true} >
                    {/* routerlink is causing bug */}
                    <IonItem routerLink="/logout">
                        <IonIcon color="danger" areia-hidden={true} icon={logOutOutlineIcon} slot="start" ></IonIcon>
                        <IonLabel color="danger">Logout</IonLabel>
                    </IonItem>

                </IonList>
            </IonContent>
        </IonPage>)
}

export default Settings;