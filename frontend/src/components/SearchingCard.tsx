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
import { Note } from '../shared/types';
import BasicNoteCard from './BasicNoteCard';

interface ContainerProps {}

const SearchingCard: React.FC<ContainerProps> = ({ }) => {
    const modal = useRef<HTMLIonModalElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { notes } = useNotes();

    function dismiss() {
        modal.current?.dismiss();
    }

    const filteredNotes = notes.filter((note: Note) =>
        note.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <IonContent>
            <IonSearchbar
                value={searchQuery}
                onIonInput={(e) => setSearchQuery(e.detail.value!)}
            ></IonSearchbar>
            <IonList>
                {filteredNotes.map((note: Note) => (
                    <IonItem key={note.id}>
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
        </IonContent>
    );
};

export default SearchingCard;