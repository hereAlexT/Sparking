import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonButton,
    IonModal,
    IonButtons,
    IonMenuButton
} from '@ionic/react';
import BasicNoteCard from '../components/BasicNoteCard';
import CardEditor from '../components/CardEditor';
import { useState, useEffect } from 'react';
import { useNotes } from '../contexts/NotesContext';
import {
    Note,
    UnSyncedNote,
    NoteId,
} from '../shared/types';
import { v4 as uuidv4 } from 'uuid';

const TimeLine: React.FC = () => {



    const { notes, createNote, deleteNote, updateNote, getNotes } = useNotes();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getNotes().then(() => {
            setIsLoading(false);
        });
    }, []);

    const handleOnCreateNote = async (note: UnSyncedNote) => {
        console.log("handleOnCreateNote")
        await createNote({
            id: note.id || uuidv4(),
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            body: note.body
        })

    }

    const handleOnUpdateNote = (note: UnSyncedNote) => {
        updateNote({
            id: note.id,
            createdAt: note.createdAt,
            updatedAt: new Date(),
            body: note.body
        });
    }


    const handleOnDeleteNote = (noteId: NoteId) => {
        deleteNote(noteId);
    }


    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);


    const handleOnEditNote = (noteId: NoteId) => {
        const foundNote = notes.find((n: Note) => n.id === noteId);
        setSelectedNote(foundNote || undefined);
        setIsEditorOpen(true);
    };


    return (
        <IonPage id="main">
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
                <IonList>
                    <IonItem>
                        <CardEditor onProcessNote={handleOnCreateNote} />
                    </IonItem>
                    {isLoading ? <IonItem>Loading...</IonItem> :
                        notes.map((note: Note) => (
                            <IonItem key={note.id} button={true} detail={false}>
                                <BasicNoteCard
                                    note={note}
                                    onDeleteNote={handleOnDeleteNote}
                                    onEditNote={handleOnEditNote}
                                />
                            </IonItem>
                        ))}
                </IonList>

            </IonContent>
            <IonModal isOpen={isEditorOpen}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Edit Memo</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsEditorOpen(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <CardEditor onProcessNote={handleOnUpdateNote} note={selectedNote} />
                </IonContent>
            </IonModal>
        </IonPage >

    );
};

export default TimeLine;