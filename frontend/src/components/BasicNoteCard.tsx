import {
    IonCardContent,
    IonCard,
    IonButton,
    IonCol,
    IonRow,
    IonItem,
    IonList,
    IonPopover,
    IonContent,
    IonIcon,
    IonText
} from '@ionic/react';
import {
    menuOutline as meanuOutlineIcon,
    createOutline as CreateOutlineIcon,
    trashOutline as TrashOutlineIcon
} from 'ionicons/icons';
import { useRef } from 'react';
import { Note, NoteId } from '../shared/types';
import './BasicNoteCard.css'

interface ContainerProps {
    note: Note;
    onDeleteNote(noteId: NoteId): void;
    onEditNote(noteId: NoteId): void;
    isOnline: boolean;
    className?: string;
    /**
     * An identifier indicating where this BasicNoteCard is used.
     * If used in the timeline, you can assign it a cardSetId such as "timeline".
     * This is used to ensure that the same id is not issued to cards requested from different components.
     * For example, a searching card and a timeline card may both request the basic notecard and may need access to the same card.
     */
    cardSetId: string;
}

const BasicNoteCard: React.FC<ContainerProps> = ({ note, onDeleteNote, onEditNote, isOnline, className, cardSetId }) => {
    



    return (
        <>
            <div className="m-0 p-0 w-full">
                <IonCard className={className}>
                    <IonCardContent className="p-2">
                        <IonRow className="p-0 m-0">
                            <IonCol
                                className='m-0 p-0 font-bold text-[13px]'
                                style={{ color: '#71717A' }}
                            >
                                {note.createdAt.toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZone: 'UTC'
                                }).replace(',', '')}
                            </IonCol>
                            <IonCol size="auto" className='m-0 p-0 align-top'>
                                <IonButton
                                    /* Style here is used to remove default style, do not modify. Always use tailwind CSS */
                                    style={{ '--padding-start': '0px', '--padding-end': '0px' }}
                                    className='pr-1 m-0 align-top'
                                    item-end size="small"
                                    fill="clear"
                                    id={`${cardSetId}-${note.id}`}>
                                    <IonIcon slot="icon-only" size="small" icon={meanuOutlineIcon}></IonIcon>
                                </IonButton>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonText color="primary">
                                <p>{note.body}</p>
                            </IonText>

                        </IonRow>


                    </IonCardContent>
                </IonCard>

            </div>
            <IonPopover
                trigger={`${cardSetId}-${note.id}`}
                dismissOnSelect={true}
                keyboardClose={true}
                side="bottom"
                alignment='end'
                showBackdrop={true}
                arrow={false}
                className='basic-note-card'
            >
                <IonContent>
                    <IonList className="" lines='none'>
                        <IonItem button={true} detail={false} onClick={((e) => onEditNote(note.id))}>
                            <IonIcon slot="start" size="small" icon={CreateOutlineIcon}></IonIcon>
                            Edit
                        </IonItem>
                        <IonItem disabled={!isOnline} button={true} detail={false} onClick={(e) => onDeleteNote(note.id)}>
                            <IonIcon slot="start" size="small" icon={TrashOutlineIcon}></IonIcon>
                            Delete
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonPopover>
        </>

    );
};

export default BasicNoteCard;
