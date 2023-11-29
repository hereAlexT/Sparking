import {
    IonContent, IonHeader, IonInput, IonPage, IonText, IonTitle, IonToolbar, IonButton, IonGrid, IonCol, IonRow,
    IonPopover, IonList, IonItem, IonButtons, IonMenuButton, IonIcon
} from '@ionic/react';
import { useAuth } from '../contexts/AuthContext';

const ComponentLab: React.FC = () => {
    const { isAuthenticated, session, user } = useAuth();

    return (

        <IonPage>
            <IonGrid>
                <IonCol>
                    {/** use a button Get session and print in console*/}
                    <IonButton
                        onClick={() => {
                            alert("Sesssion info: \n" + isAuthenticated + "\n" + session + "\n" + user)
                            console.log("Sesssion info: \n" + isAuthenticated + "\n" + session + "\n" + user)
                        }}
                        color="primary"
                        fill="outline"
                        expand="block"
                    >
                        Get Session
                    </IonButton>
                </IonCol>
            </IonGrid>
        </IonPage>


    )

}

export default ComponentLab;