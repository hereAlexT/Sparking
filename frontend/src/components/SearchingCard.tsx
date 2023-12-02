import {
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonModal
} from '@ionic/react';
import { useState, useRef } from 'react';
import { useNotes } from '../contexts/NotesContext';
import { useMeta } from '../contexts/MetaContext';
import { Note, UnSyncedNote } from '../shared/types';
import { NoteId } from '../shared/types';
import BasicNoteCard from './BasicNoteCard';
import NoteCardV2 from './NoteCardV2';
import CardEditorModal from './CardEditorModal';
import './SearchingCard.css';

interface ContainerProps { }

/**
 * @deprecated This component is deprecated and should not be used anymore.
 * @param param0 
 * @returns 
 */
const SearchingCard: React.FC<ContainerProps> = ({ }) => {
    const modal = useRef<HTMLIonModalElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { notes, createNote, deleteNote, updateNote, getNotes } = useNotes();
    const { isOnline } = useMeta();
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);


    const filteredNotes = notes.filter((note: Note) =>
        note.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOnDeleteNote = async (noteId: NoteId) => {
        try {
            await deleteNote(noteId);
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

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
    const handleOnEditNote = (noteId: NoteId) => {
        const foundNote = notes.find((n: Note) => n.id === noteId);
        setSelectedNote(foundNote || undefined);
        setIsEditorOpen(true);
        console.debug("try to close Searching modal")

        if (modal.current) {
            modal.current.dismiss();
        }
    };

    return (
        <IonContent>
            <IonSearchbar
                value={searchQuery}
                onIonInput={(e) => setSearchQuery(e.detail.value!)}
            ></IonSearchbar>
            <IonList>
                {filteredNotes.map((note: Note) => (
                    <IonItem key={note.id}>
                        {/* <BasicNoteCard
                            isOnline={true}
                            note={note}
                            onDeleteNote={handleOnDeleteNote}
                            onEditNote={handleOnEditNote}
                            className='my-1 mx-1 shadow-sm border border-gray-300'
                            cardSetId='SearchingCard'
                        /> */}
                        <NoteCardV2
                            isOnline={isOnline}
                            note={note}
                            cardSetId='TimeLine'
                            onDeleteNote={handleOnDeleteNote}
                            onEditNote={handleOnEditNote}
                        ></NoteCardV2>
                        <IonLabel>{note.createdAt.toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'UTC'
                        }).replace(',', '')}</IonLabel>
                        <IonLabel>{note.body}</IonLabel>
                    </IonItem>
                ))}
            </IonList>
            <CardEditorModal
                isOnline={isOnline}
                isEditorOpen={isEditorOpen}
                setIsEditorOpen={setIsEditorOpen}
                selectedNote={selectedNote}
                handleOnUpdateNote={handleOnUpdateNote}
                isSecondModalOpen={isSecondModalOpen}
                setIsSecondModalOpen={setIsSecondModalOpen}
            />
        </IonContent>
    );
};

export default SearchingCard;