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
    IonBackButton
} from '@ionic/react';
import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMeta } from '../contexts/MetaContext';
import {
    mailOutline as mailOutLineIcon,
    logOutOutline as logOutOutlineIcon,
    hammerOutline as hammerOutlineIcon,
} from 'ionicons/icons';
import "./Settings.css"



interface StyledIonListProps {
    inset?: boolean;
    customClass?: string;
    children?: ReactNode;
}

const StyledIonList: React.FC<StyledIonListProps> = ({ children, inset, customClass }) => (
    <IonList inset={inset} className={`border border-slate-300 ${customClass}`}>
        {children}
    </IonList>
);

const Settings: React.FC = () => {
    console.log("Settings.tsx: Settings")
    const { user } = useAuth();
    const { isSplitPaneOn } = useMeta();

    return (
        <IonPage id="main" >
            <IonHeader>
                {!isSplitPaneOn ? (
                    <IonToolbar>
                        <IonTitle>Settings</IonTitle>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/timeline/pri"></IonBackButton>
                        </IonButtons>
                    </IonToolbar>

                ) :<div className='mt-5' />}
            </IonHeader>


            <IonContent>
                <StyledIonList inset={true}>
                    <IonItem>
                        <IonIcon aria-hidden="true" icon={mailOutLineIcon} slot="start" />
                        <IonLabel>Email</IonLabel>
                        <IonLabel>{user?.email}</IonLabel>
                    </IonItem>
                </StyledIonList>

                <StyledIonList inset={true}>
                    <IonItem>
                        <IonToggle disabled={true}>
                            <IonLabel>Location Service (Developing)</IonLabel>
                            <IonNote color="medium">Add your location data to every note.</IonNote>
                        </IonToggle>
                    </IonItem>
                </StyledIonList>

                <StyledIonList inset={true} >
                    <IonItem routerLink="/logout" routerDirection="none">
                        <IonIcon color="danger" areia-hidden={true} icon={logOutOutlineIcon} slot="start" ></IonIcon>
                        <IonLabel color="danger">Logout</IonLabel>
                    </IonItem>
                </StyledIonList>

                <StyledIonList inset={true} >
                    <IonItem routerLink="/comlab" routerDirection="none">
                        <IonIcon color="" areia-hidden={true} icon={hammerOutlineIcon} slot="start" ></IonIcon>
                        <IonLabel color="">Developer Tool</IonLabel>
                    </IonItem>
                </StyledIonList>

            </IonContent>
        </IonPage>
    );
};

export default Settings;