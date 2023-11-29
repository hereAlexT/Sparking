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
import { useMeta } from '../contexts/MetaContext';
import { useAuth } from '../contexts/AuthContext';
import {
    Note,
    UnSyncedNote,
    NoteId,
} from '../shared/types';
import { isPlatform } from '@ionic/react';
import { getPlatforms } from '@ionic/react';
import { v4 as uuidv4 } from 'uuid';

const TimeLine: React.FC = () => {
    console.log("timeline render")

    const { notes, createNote, deleteNote, updateNote, getNotes } = useNotes();
    const [isLoading, setIsLoading] = useState(true);
    const { isOnline } = useMeta();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        console.log(getPlatforms())
        setIsLoading(true);
        console.log("i fire once. isAuthenticated:" + isAuthenticated)
        getNotes().then(() => {
            setIsLoading(false);
        });
    }, []);

    const handleOnCreateNote = async (note: UnSyncedNote) => {
        try {
            await createNote({
                id: note.id || uuidv4(),
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
                body: note.body
            })
        } catch (error) {
            console.log("error")
            console.log(error)
            alert((error as Error).message);
        }

    }

    const handleOnUpdateNote = async (note: UnSyncedNote) => {
        try {
            await updateNote({
                id: note.id,
                createdAt: note.createdAt,
                updatedAt: new Date(),
                body: note.body
            });
        } catch (error) {
            console.log("error")
            console.log(error)
            alert((error as Error).message);
        }
    }


    const handleOnDeleteNote = async (noteId: NoteId) => {
        try {
            await deleteNote(noteId);
        } catch (error) {
            console.log("error")
            console.log(error)
            alert((error as Error).message);
        }
    }


    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);


    const handleOnEditNote = (noteId: NoteId) => {
        const foundNote = notes.find((n: Note) => n.id === noteId);
        setSelectedNote(foundNote || undefined);
        setIsEditorOpen(true);
    };


    return (
        <IonPage id="main" >
            {isPlatform("mobile") ? (
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Timeline {isOnline ? '' : '[Offline]'}</IonTitle>
                    </IonToolbar>
                </IonHeader>
            ) : <div className='m-5' />}
            <IonContent >
                <IonList lines="none">
                    <IonItem>
                        <CardEditor
                            isOnline={isOnline}
                            className='w-full p-0 my-1.5 mx-1 shadow-md border border-gray-500'
                            onProcessNote={handleOnCreateNote} />
                    </IonItem>
                    {isLoading ? <IonItem>Loading...</IonItem> :
                        notes.map((note: Note) => (
                            <IonItem key={note.id} button={false} detail={false}>
                                <BasicNoteCard
                                    isOnline={isOnline}
                                    note={note}
                                    onDeleteNote={handleOnDeleteNote}
                                    onEditNote={handleOnEditNote}
                                    className='my-2 mx-1 shadow-md border border-gray-200'
                                />
                            </IonItem>
                        ))}
                </IonList>

            </IonContent>
            <IonModal isOpen={isEditorOpen} className='p-5'>
                <IonHeader>
                    <IonToolbar>
                        {/* <IonTitle>Edit Memo</IonTitle> */}
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsEditorOpen(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="p-0 m-0 w-full h-full">
                    <div>
                        <CardEditor isOnline={isOnline} onProcessNote={handleOnUpdateNote} note={selectedNote} />
                    </div>
                </IonContent>
            </IonModal>
        </IonPage >

    );
};

export default TimeLine;