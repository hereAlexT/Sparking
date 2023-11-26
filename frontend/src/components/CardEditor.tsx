import {
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonButton,
    IonCol,
    IonRow,

    IonGrid,
    IonTextarea

} from '@ionic/react';
import { useState, ChangeEvent } from 'react';
import './BasicNoteCard.css';
import { Note, SyncedNote, UnSyncedNote } from '../shared/types';
import { v4 as uuidv4 } from 'uuid';

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
            createdDate: note?.createdDate || new Date(),
            body: content
        }
        onProcessNote(newNote);
        setContent('');
    }

    return (
        <div className="m-0 p-0 w-full">
            <IonCard>
                <IonCardHeader></IonCardHeader>
                <IonCardContent>
                    <IonGrid>
                        <IonRow>
                            <IonTextarea
                                label="What just heppened?"
                                label-placement="floating"
                                value={content}
                                onIonInput={handleInput}
                                rows={5}></IonTextarea>
                        </IonRow>
                        <IonRow class="ion-justify-content-end">
                            <IonCol size="auto">
                                <IonButton color="tertiary" item-end size="small" onClick={HandleOnSubmitNote}>Submit</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonCardContent>
            </IonCard>
        </div>
    )
}
export default CardEditor;