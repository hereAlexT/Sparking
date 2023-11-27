import {
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonTextarea,
    IonIcon

} from '@ionic/react';
import { useState, ChangeEvent } from 'react';
import './BasicNoteCard.css';
import { Note, SyncedNote, UnSyncedNote } from '../shared/types';
import { v4 as uuidv4 } from 'uuid';
import { sendOutline as sendOutLineIcon } from 'ionicons/icons';

interface ContainerProps {
    onProcessNote: (noteContent: Note) => void;
    note?: Note;
}

const CardEditor: React.FC<ContainerProps> = ({ onProcessNote: onProcessNote, note }) => {
    const [content, setContent] = useState(note?.body || '');
    const handleInput = (event: CustomEvent) => {
        const value = event.detail.value;
        setContent(value);
    };

    const HandleOnSubmitNote = () => {
        const newNote: Note = {
            id: note?.id || uuidv4(),
            createdAt: note?.createdAt || new Date(),
            updatedAt: new Date(),
            body: content
        }
        onProcessNote(newNote);
        setContent('');
    }

    return (
        <div className="m-0 p-0 w-full">
            <IonCard>
                <IonCardContent className='p-1'>
                    <IonGrid>
                        <IonRow>
                            <IonTextarea
              
                                value={content}
                                onIonInput={handleInput}
                                rows={5}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        HandleOnSubmitNote();
                                    }
                                }}
                            />
                        </IonRow>
                        <IonRow class="ion-justify-content-end">
                            <IonCol size="auto" className="m-0 p-0">
                                <IonButton
                                    color="tertiary"
                                    item-end size="small"
                                    onClick={HandleOnSubmitNote}
                                    className='m-0'
                                    >
                                    <IonIcon slot="icon-only" icon={sendOutLineIcon}></IonIcon>
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonCardContent>
            </IonCard>
        </div>
    )
}
export default CardEditor;