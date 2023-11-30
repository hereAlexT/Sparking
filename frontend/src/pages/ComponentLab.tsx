import {
    IonContent,
    IonHeader,
    IonInput,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar,
    IonButton,
    IonGrid,
    IonCol,
    IonRow,
    IonPopover,
    IonList,
    IonItem,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonBackButton
} from '@ionic/react';
import { useAuth } from '../contexts/AuthContext';

const ComponentLab: React.FC = () => {
    const { isAuthenticated, session, user } = useAuth();

    return (

        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Settings</IonTitle>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/timeline"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonCol>
                        {/** use a button Get session and print in console*/}
                        <IonButton
                            onClick={() => {
                                let sessionCopy = { ...session };
                                if (sessionCopy.access_token) {
                                    sessionCopy.access_token = '****';
                                }
                                alert("Sesssion info: \n" + isAuthenticated + "\n" + JSON.stringify(sessionCopy, null, 2) + "\n" + user)
                                console.log("Sesssion info: \n" + isAuthenticated + "\n" + JSON.stringify(sessionCopy, null, 2) + "\n" + user)
                            }}
                            color="primary"
                            fill="outline"
                            expand="block"
                        >
                            Get Session
                        </IonButton>
                    </IonCol>
                </IonGrid>
            </IonContent>
        </IonPage>


    )

}

export default ComponentLab;