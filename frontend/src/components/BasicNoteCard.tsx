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
import { Note, NoteId } from '../shared/interfaces/Note.interfaces';
import './BasicNoteCard.css'

interface ContainerProps {
    noteId: NoteId;
    createdDate: Date;
    body: string;
    onDeleteNote(noteId: NoteId): void;
    onEditNote(noteId: NoteId): void;
}

const BasicNoteCard: React.FC<ContainerProps> = ({ noteId, createdDate, body, onDeleteNote, onEditNote }) => {
    return (
        <>
            <div className="m-0 p-0 w-full">
                <IonCard >
                    <IonCardContent className="">
                        <IonRow className="ion-justify-content-end ion-align-items-start" style={{ padding: 0 }}>
                            <IonCol size="auto">
                                <IonButton item-end size="small" fill="clear" id={`note-popover-${noteId}`}>
                                    <IonIcon slot="icon-only" icon={meanuOutlineIcon}></IonIcon>
                                </IonButton>
                            </IonCol>
                        </IonRow>
                        <IonRow> {body}</IonRow>
                        <IonRow><IonCardSubtitle className="">{createdDate.toISOString()}</IonCardSubtitle></IonRow>

                    </IonCardContent>
                </IonCard>

            </div>
            <IonPopover
                trigger={`note-popover-${noteId}`}
                dismissOnSelect={true}
                keyboardClose={true}
                side="bottom"
                alignment='end'
                showBackdrop={false}
            >
                <IonContent>
                    <IonList>
                        <IonItem button={true} detail={false} onClick={((e) => onEditNote(noteId))}>
                            Edit
                        </IonItem>
                        <IonItem button={true} detail={false} onClick={(e) => onDeleteNote(noteId)}>
                            Delete
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonPopover>
        </>

    );
};

export default BasicNoteCard;
