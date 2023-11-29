import {
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonToggle,
    IonToolbar,
    IonTitle,
    IonPage,
    IonIcon,
    IonButtons,
    IonMenuButton,
    IonBackButton
} from '@ionic/react';
import { useAuth } from '../contexts/AuthContext';
import {
    mailOutline as mailOutLineIcon,
    logOutOutline as logOutOutlineIcon,
} from 'ionicons/icons';


const Settings: React.FC = () => {
    console.log("Settings.tsx: Settings")
    const { user } = useAuth();

    return (
        <IonPage id="main" >
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Settings</IonTitle>
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent color="light">
                <IonList inset={true}>
                    <IonItem>
                        <IonIcon aria-hidden="true" icon={mailOutLineIcon} slot="start" />
                        <IonLabel>Email</IonLabel>
                        <IonLabel>{user?.email}</IonLabel>
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
                    <IonItem routerLink="/logout" routerDirection="none">
                        <IonIcon color="danger" areia-hidden={true} icon={logOutOutlineIcon} slot="start" ></IonIcon>
                        <IonLabel color="danger">Logout</IonLabel>
                    </IonItem>

                </IonList>
            </IonContent>
        </IonPage>)
}

export default Settings;