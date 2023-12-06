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
    IonSearchbar,
    IonFab,
    IonFabButton,
    IonIcon
} from '@ionic/react';
import CardEditor from '../components/CardEditor';
import CardEditorV2 from '../components/CardEditorV2';
import CardEditorModal from '../components/CardEditorModal';
import CardEditorMobileModal from '../components/CardEditorMobileModal';
import { useState, useEffect, useRef } from 'react';
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
import { arrowUpOutline as arrowUpOutlineIcon } from 'ionicons/icons';


const TimeLine: React.FC = () => {
    console.log("timeline render")

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { notes, createNote, deleteNote, updateNote, getNotes } = useNotes();
    const { isOnline, isSplitPaneOn } = useMeta();
    const { isAuthenticated, user } = useAuth();
    const [filteredNotes, setFilteredNotes] = useState(notes);

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredNotes(notes);
        } else {
            const filtered = notes.filter((note: Note) =>
                note.body.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredNotes(filtered);
        }
    }, [searchQuery, notes]);

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
                body: note.body,
                userId: user?.id,
                images: note.images,
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




    const pageRef = useRef(undefined);


    return (
        <IonPage id="main" ref={pageRef}>
            {!isSplitPaneOn && (
                <IonFab slot="fixed" vertical="bottom" horizontal="end">
                    <IonFabButton id="open-mobile-editor-modal-timeline">
                        <IonIcon icon={arrowUpOutlineIcon}></IonIcon>
                    </IonFabButton>
                    <CardEditorMobileModal
                        trigger="open-mobile-editor-modal-timeline"
                        onSubmit={handleOnCreateNote}
                        pageRef={pageRef}
                    />
                </IonFab>)}
            {!isSplitPaneOn ? (
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Timeline {isOnline ? '' : '[Offline]'}</IonTitle>
                    </IonToolbar>
                    <IonToolbar>
                        <IonSearchbar className="mb-1 pb-1" placeholder="Search" onIonInput={(e) => setSearchQuery(e.detail.value!)} ></IonSearchbar>
                    </IonToolbar>
                </IonHeader>
            ) : <div className='m-5' />}


            {isSplitPaneOn && (<IonCard className='my-1 px-5 pt-2 pb-1 rounded-md border border-slate-400  shadow-md'>
                <CardEditorV2
                    onSubmit={handleOnCreateNote}
                    isOnline={true}
                />
            </IonCard>)}
            {isSplitPaneOn && (
                <IonSearchbar className="mb-1 pb-1" placeholder="Search" onIonInput={(e) => setSearchQuery(e.detail.value!)} ></IonSearchbar>)}



            <IonContent className='m5'>
                <IonList lines="none">
                    {isLoading ? <IonItem>Loading...</IonItem> :
                        filteredNotes.map((note: Note) => (
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
            {/* <CardEditorModal
                isOnline={isOnline}
                isEditorOpen={isEditorOpen}
                setIsEditorOpen={setIsEditorOpen}
                selectedNote={selectedNote}
                handleOnUpdateNote={handleOnUpdateNote}
                isSecondModalOpen={false}
                setIsSecondModalOpen={setIsEditorOpen}
            /> */}
            <CardEditorMobileModal
                onSubmit={handleOnUpdateNote}
                pageRef={pageRef}
                setIsEditorOpen={setIsEditorOpen}
                isEditorOpen={isEditorOpen}
                note={selectedNote}
            />

        </IonPage >

    );
};

export default TimeLine;