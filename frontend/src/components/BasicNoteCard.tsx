import {
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
    IonCol,
    IonRow,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    IonPopover,
    IonContent,
    IonActionSheet,
    IonIcon
} from '@ionic/react';
import { menuOutline as meanuOutlineIcon } from 'ionicons/icons';
import {Note, NoteId} from '../shared/types';
import './BasicNoteCard.css'

interface ContainerProps {
    note: Note;
    onDeleteNote(noteId: NoteId): void;
    onEditNote(noteId: NoteId): void;
}

const BasicNoteCard: React.FC<ContainerProps> = ({ note, onDeleteNote, onEditNote }) => {
    return (
        <>
            <div className="m-0 p-0 w-full">
                <IonCard >
                    <IonCardContent className="">
                        <IonRow className="ion-justify-content-end ion-align-items-start" style={{ padding: 0 }}>
                            <IonCol size="auto">
                                <IonButton item-end size="small" fill="clear" id={`note-popover-${note.id}`}>
                                    <IonIcon slot="icon-only" icon={meanuOutlineIcon}></IonIcon>
                                </IonButton>
                            </IonCol>
                        </IonRow>
                        <IonRow> {note.body}</IonRow>
                        <IonRow><IonCardSubtitle className="">{note.createdAt.toTimeString()}</IonCardSubtitle></IonRow>

                    </IonCardContent>
                </IonCard>

            </div>
            <IonPopover
                trigger={`note-popover-${note.id}`}
                dismissOnSelect={true}
                keyboardClose={true}
                side="bottom"
                alignment='end'
                showBackdrop={false}
            >
                <IonContent>
                    <IonList>
                        <IonItem button={true} detail={false} onClick={((e) => onEditNote(note.id))}>
                            Edit
                        </IonItem>
                        <IonItem button={true} detail={false} onClick={(e) => onDeleteNote(note.id)}>
                            Delete
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonPopover>
        </>

    );
};

export default BasicNoteCard;
