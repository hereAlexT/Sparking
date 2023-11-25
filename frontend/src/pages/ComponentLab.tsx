import {
    IonContent, IonHeader, IonInput, IonPage, IonText, IonTitle, IonToolbar, IonButton, IonGrid, IonCol, IonRow,
    IonPopover, IonList, IonItem, IonButtons, IonMenuButton, IonIcon
} from '@ionic/react';
import { useState } from 'react';
import CardEditor from '../components/CardEditor'
import BasicNoteCard from '../components/BasicNoteCard';

const ComponentLab: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>

                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />

                    </IonButtons>
                    <IonTitle>Timeline</IonTitle>
                    {/* <IonSearchbar disabled={true} placeholder="Search function under developing"></IonSearchbar> */}
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <CardEditor onCreateNote={()=>{}}/>
                        </IonCol>

                    </IonRow>
                    <IonRow>
                        <BasicNoteCard onDeleteNote={()=>{}} onEditNote={()=>{}} noteId="1" body="body" createdDate={new Date()}></BasicNoteCard>
                    </IonRow>
                    <IonRow>

                        <h1 className="text-3xl font-bold underline">
                            Hello world!
                        </h1>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )



}

export default ComponentLab;