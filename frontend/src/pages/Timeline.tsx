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
    IonMenuButton,
    IonCard,
    IonCardContent,
    IonSearchbar
} from '@ionic/react';
import BasicNoteCard from '../components/BasicNoteCard';
import CardEditor from '../components/CardEditor';
import CardEditorV2 from '../components/CardEditorV2';
import CardEditorModal from '../components/CardEditorModal';
import { useState, useEffect } from 'react';
import { useNotes } from '../contexts/NotesContext';
import { useMeta } from '../contexts/MetaContext';
import { useAuth } from '../contexts/AuthContext';
import {
    Note,
    UnSyncedNote,
    NoteId,
} from '../shared/types';
import { getPlatforms } from '@ionic/react';
import { v4 as uuidv4 } from 'uuid';
import NoteCardV2 from '../components/NoteCardV2';
import { on } from 'events';

const TimeLine: React.FC = () => {
    console.log("timeline render")

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const { notes, createNote, deleteNote, updateNote, getNotes } = useNotes();
    const { isOnline, isSplitPaneOn } = useMeta();
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


    const handleOnEditNote = (noteId: NoteId) => {
        const foundNote = notes.find((n: Note) => n.id === noteId);
        setSelectedNote(foundNote || undefined);
        setIsEditorOpen(true);
    };


    return (
        <IonPage id="main" >
            {!isSplitPaneOn ? (
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Timeline {isOnline ? '' : '[Offline]'}</IonTitle>
                    </IonToolbar>
                </IonHeader>
            ) : <div className='m-5' />}

            <IonSearchbar className="mb-1 pb-1" placeholder="Searching"></IonSearchbar>
            <IonCard className='my-1 px-5 pt-2 pb-1 rounded-xl border border-slate-400  shadow-none'>
                <CardEditorV2
                    onSubmit={handleOnCreateNote}
                    isOnline={true}
                />
            </IonCard>

            <IonContent >
                <IonList lines="none">
                    {isLoading ? <IonItem>Loading...</IonItem> :
                        notes.map((note: Note) => (
                            <IonItem key={note.id} button={false} detail={false}>
                                <NoteCardV2
                                    isOnline={isOnline}
                                    note={note}
                                    cardSetId='TimeLine'
                                    onDeleteNote={handleOnDeleteNote}
                                    onEditNote={handleOnEditNote}
                                ></NoteCardV2>
                            </IonItem>
                        ))}
                </IonList>

            </IonContent>
            <CardEditorModal
                isOnline={isOnline}
                isEditorOpen={isEditorOpen}
                setIsEditorOpen={setIsEditorOpen}
                selectedNote={selectedNote}
                handleOnUpdateNote={handleOnUpdateNote}
                isSecondModalOpen={false}
                setIsSecondModalOpen={setIsEditorOpen}
            />
        </IonPage >

    );
};

export default TimeLine;