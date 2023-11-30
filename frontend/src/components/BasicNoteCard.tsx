import {
    IonCardContent,
    IonCard,
    IonCardSubtitle,
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
import { menuOutline as meanuOutlineIcon } from 'ionicons/icons';
import { Note, NoteId } from '../shared/types';
import './BasicNoteCard.css'

interface ContainerProps {
    note: Note;
    onDeleteNote(noteId: NoteId): void;
    onEditNote(noteId: NoteId): void;
    isOnline: boolean;
    className?: string;
}

const BasicNoteCard: React.FC<ContainerProps> = ({ note, onDeleteNote, onEditNote, isOnline, className }) => {
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
                                    id={`note-popover-${note.id}`}>
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
                trigger={`note-popover-${note.id}`}
                dismissOnSelect={true}
                keyboardClose={true}
                side="bottom"
                alignment='end'
                showBackdrop={false}
                arrow={false}
            >
                <IonContent>
                    <IonList>
                        <IonItem button={true} detail={false} onClick={((e) => onEditNote(note.id))}>
                            Edit
                        </IonItem>
                        <IonItem disabled={!isOnline} button={true} detail={false} onClick={(e) => onDeleteNote(note.id)}>
                            Delete
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonPopover>
        </>

    );
};

export default BasicNoteCard;
