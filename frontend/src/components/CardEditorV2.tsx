import React, { useState } from 'react';
import {
    IonCardContent,
    IonCard,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonTextarea,
    IonIcon

} from '@ionic/react';
import { Note, UnSyncedNote } from '../shared/types';
import { arrowForwardOutline as  arrowForwardOutlineIcon } from 'ionicons/icons';
import { v4 as uuidv4 } from 'uuid';

interface CardEditorV2Props {
    onSubmit: (noteContent: Note) => void;
    note?: Note;
    isOnline: boolean;
}



const CardEditorV2: React.FC<CardEditorV2Props> = ({onSubmit, note, isOnline}) => {
    const [content, setContent] = useState('');

    const HandleOnSubmit = () => {
        const newNote: UnSyncedNote = {
            id: note?.id || uuidv4(),
            createdAt: note?.createdAt || new Date(),
            updatedAt: new Date(),
            body: content
        }
        onSubmit(newNote);
        setContent('');
    }

    return (
        <IonGrid class="ion-no-padding">
            <IonRow>
                <IonCol>
                    <IonTextarea
                        className='font-poppins font-light pt-1 px-1 text-black native-textarea-p0-m0 border-b border-slate-400'
                        disabled={!isOnline}
                        value={isOnline ? content : "We are working on offline editing!"}
                        onIonInput={(event: CustomEvent) => setContent(event.detail.value)}
                        rows={0}
                        autoGrow={true}
                        color="primary"
                        placeholder="You got a good idea💡, what's that?"

                    />
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol size="11" className='' />
                <IonCol size="1" className='flex items-center justify-end'>
                    <IonButton
                        disabled={!isOnline || content.length === 0}
                        color="primary"
                        size="small"
                        fill="solid"
                        onClick={HandleOnSubmit}
                        className='circular-button'>
                        <IonIcon color="light" className="m-0 p-0" size="small" slot="icon-only" icon={arrowForwardOutlineIcon}></IonIcon>
                    </IonButton>
                </IonCol>
            </IonRow>

        </IonGrid>
    )
};

export default CardEditorV2;
