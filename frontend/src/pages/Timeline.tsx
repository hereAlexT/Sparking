import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonAvatar,
    IonLabel,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
    IonPopover,
    IonSearchbar,
    IonAlert,
    useIonAlert,
    useIonModal,
    IonModal,
    IonIcon,
    IonButtons,
    IonMenuButton
} from '@ionic/react';
import BasicNoteCard from '../components/BasicNoteCard';
import CardEditor from '../components/CardEditor';
import { useState, useEffect } from 'react';
import { Note, NoteId } from '../shared/interfaces/Note.interfaces';

const defaultCards: Note[] = [
    // {
    //   noteId: "1",
    //   createdDate: new Date("2023-01-01T00:00:00Z"),
    //   body: "This is the body of note 1"
    // },
    // {
    //   noteId: "2",
    //   createdDate: new Date("2023-01-02T00:00:00Z"),
    //   body: "This is the body of note 2"
    // },
    // {
    //   noteId: "3",
    //   createdDate: new Date("2023-01-03T00:00:00Z"),
    //   body: "This is the body of note 3"
    // },
    // {
    //   noteId: "4",
    //   createdDate: new Date("2023-01-04T00:00:00Z"),
    //   body: "This is the body of note 4"
    // },
    // {
    //   noteId: "5",
    //   createdDate: new Date("2023-01-05T00:00:00Z"),
    //   body: "This is the body of note 5"
    // },
];

const TimeLine: React.FC = () => {
    const [cards, setCards] = useState<Note[]>(defaultCards);


    const handleOnCreateNote = (note: Note) => {
        // search on cards, check if noteId already exists
        if (cards.find(card => card.noteId === note.noteId)) {
            console.log("Note already exists, update the notes")
            // update the card in cards where card.noteId = note.noteId and use setCards to update State
            const updateCards = cards.map(card => {
                if (card.noteId === note.noteId) {
                    return note;
                }
                else {
                    return card;
                }
            });
            setCards(updateCards);
        }

        else {
            setCards([...cards, note]);
        }
    }


    const handleOnDeleteNote = (noteId: NoteId) => {
        const updateCards = cards.filter(card => card.noteId !== noteId);
        setCards(updateCards);
    }


    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);


    const handleOnEditNote = (noteId: NoteId) => {
        const foundNote = cards.find(card => card.noteId === noteId);
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
                        <CardEditor onCreateNote={handleOnCreateNote} />
                    </IonItem>

                    {cards.map((card, index) => (
                        <IonItem key={card.noteId} button={true} detail={false}>
                            <BasicNoteCard
                                noteId={card.noteId}
                                createdDate={card.createdDate}
                                body={card.body}
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
                    <CardEditor onCreateNote={handleOnCreateNote} note={selectedNote} />
                </IonContent>
            </IonModal>
        </IonPage >

    );
};

export default TimeLine;