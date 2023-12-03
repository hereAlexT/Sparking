import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonGrid,
    IonCol,
    IonRow,
    IonList,
    IonItem,
    IonButtons,
    IonBackButton,
    IonCard,
    IonModal,
    IonCheckbox,
    IonFooter,
    IonTextarea,
    IonIcon

} from '@ionic/react';
import { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NoteCardV2 from '../components/NoteCardV2';
import { NoteId, Note, SyncedNote, UnSyncedNote } from '../shared/types';
import { v4 as uuidv4 } from 'uuid';
import CardEditorV2 from '../components/CardEditorV2';
import CardEditorMobileModal from '../components/CardEditorMobileModal';
import Markdown from 'react-markdown'

import { arrowUpOutline as arrowUpOutlineIcon } from 'ionicons/icons';

const notes_mock: (SyncedNote | UnSyncedNote)[] = [
    {
        id: uuidv4(),
        body: "First note",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: uuidv4(),
        body: "Second note",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: uuidv4(),
        body: "Third note",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: uuidv4(),
        body: "Fourth note",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: uuidv4(),
        body: "Fifth note",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: uuidv4(),
        body: "6 note",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: uuidv4(),
        body: "7 note",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: uuidv4(),
        body: "8 note",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const ComponentLab: React.FC = () => {
    const { isAuthenticated, session, user } = useAuth();



    const handleOnEdit = (noteId: NoteId) => {
        console.log("Edit note: " + noteId)
    }
    const handleOnDelete = (noteId: NoteId) => {
        console.log("Delete note: " + noteId)
    }



    const pageRef = useRef(undefined);


    return (
        <IonPage ref={pageRef}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Settings</IonTitle>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/timeline/pri"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
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
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            {/** use a button Get session and print in console*/}
                            <IonButton
                                color="primary"
                                fill='outline'
                                expand="block"
                                id="open-mobile-editor-modal-comlab"
                            >
                                Open MobileEditor
                            </IonButton>

                            <CardEditorMobileModal
                                onSubmit={(note: Note) => console.log(note)}
                                trigger="open-mobile-editor-modal-comlab"
                                pageRef={pageRef}
                            />


                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCard className='m-0 px-5 pt-2 pb-1 rounded-xl w-full border border-slate-400  shadow-none'>
                            <CardEditorV2
                                onSubmit={(note: Note) => console.log(note)}
                                isOnline={true}
                            />
                        </IonCard>
                    </IonRow>
                    <IonRow>

                        <IonList className="w-full m-0" lines='none'>
                            {notes_mock.map((note, index) => (
                                <IonItem key={index}>
                                    <NoteCardV2
                                        cardSetId='comlab1'
                                        note={note}
                                        isOnline={true}
                                        onEditNote={handleOnEdit}
                                        onDeleteNote={handleOnDelete}
                                    />
                                </IonItem>
                            ))}
                        </IonList>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )

}

export default ComponentLab;