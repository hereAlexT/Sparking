import React from 'react';
import {
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonIcon,
    IonContent,
    IonButton,
    IonPopover,
    IonList,
    IonItem
} from '@ionic/react';
import {
    navigateOutline as navigateOutlineIcon,
    cloudOutline as cloudOutlineIcon,
    cloudOfflineOutline as cloudOfflineOutlineIcon,
    ellipsisHorizontalSharp as ellipsisHorizontalSharpeIcon,
    chevronForwardOutline as chevronForwardOutlineIcon,
    createOutline as CreateOutlineIcon,
    trashOutline as TrashOutlineIcon
} from 'ionicons/icons';
import { Note, NoteId } from '../shared/types';
import './NoteCardV2.css';
import { createRoot } from 'react-dom/client'
import Markdown from 'react-markdown'


const formatDate = (date: Date): string => {
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
interface NoteCardV2Props {
    note: Note;
    cardSetId: string;
    isOnline: boolean;
    onDeleteNote: (noteId: NoteId) => void;
    onEditNote: (noteId: NoteId) => void;
}

const NoteCardV2: React.FC<NoteCardV2Props> = ({ note, cardSetId, isOnline, onDeleteNote, onEditNote }) => {
    return (
        <IonCard className='m-0 p-0 rounded-none w-full border-b border-slate-300  shadow-none'>
            <IonCardContent className='m-0 p-0'>
                <IonGrid class="ion-no-padding" style={{ "--ion-grid-columns": "25" }}>
                    <IonRow className='pt-3'>
                        <IonCol size="24" className='' id="dt-col" >
                            <IonText className='font-light font-roboto-condensed text-sm'>{formatDate(note.createdAt)}</IonText>
                            {/* <IonIcon icon={navigateOutlineIcon} />
                            <IonText className='font-roboto-condensed font-light'>Summer Hill, Sydney</IonText> */}
                        </IonCol>

                        <IonCol size="1" className='' id='sync-col' >
                            {/* <IonIcon className="float-right" icon={cloudOutlineIcon} /> */}
                            {/* <IonIcon className="float-right" icon={cloudOfflineOutlineIcon} /> */}
                        </IonCol>
                    </IonRow>
                    <IonRow className='pt-3'>
                        <IonCol size="24" id='body-col' className=''>
                            {/* {note.body.split('\n').map((line, index) => (
                                <IonText key={index} className='font-poppins font-light' color="dark">
                                    {line}
                                    <br />
                                </IonText>))} */}

                            <Markdown className='font-poppins font-light' children={note.body} />
                        </IonCol>
                        <IonCol size="1" id='link-col' className="flex items-center justify-end ">
                            {/* <IonIcon className='' icon={chevronForwardOutlineIcon} /> */}
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="24">
                        </IonCol>
                        <IonCol size="1" id='menu-col' className=''>
                            <IonButton
                                id={`${cardSetId}-${note.id}`}
                                size="small"
                                fill="clear"
                                className='float-right note-menu-button'>
                                <IonIcon size="small" color="medium" icon={ellipsisHorizontalSharpeIcon} />
                            </IonButton>
                            <IonPopover
                                trigger={`${cardSetId}-${note.id}`}
                                dismissOnSelect={true}
                                keyboardClose={true}
                                side="left"
                                alignment='end'
                                showBackdrop={true}
                                arrow={false}
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
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCardContent>

        </IonCard >
    );
};

export default NoteCardV2;
