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
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { arrowDownOutline as arrowDownOutlineIcon } from 'ionicons/icons';

import { Note } from '../shared/types';

import './CardEditor.css';

interface ContainerProps {
    onProcessNote: (noteContent: Note) => void;
    note?: Note;
    className?: string;
    isOnline: boolean;
}

const CardEditor: React.FC<ContainerProps> = ({ onProcessNote: onProcessNote, note, className, isOnline }) => {
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
        <IonCard className={className} >
            <IonCardContent className='p-0 m-0'>
                <IonGrid className='p-0 m-0'>
                    <IonRow >
                        <IonCol>
                            <IonTextarea
                                className='pt-1 px-1 text-black native-textarea-p0-m0 border-b border-slate-400'
                                disabled={!isOnline}
                                value={isOnline ? content : "We are working on offline editing!"}
                                onIonInput={handleInput}
                                rows={0}
                                autoGrow={true}
                                color="primary"
                                placeholder="You got a good idea💡, right?"
                                // onKeyDown={(e) => {
                                //     if (e.key === 'Enter' && !(e.metaKey || e.ctrlKey)) {
                                //         HandleOnSubmitNote();
                                //     } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                //         console.log('Ctrl + Enter');
                                //         const textareaElement = e.currentTarget.querySelector('textarea');
                                //         if (textareaElement) {
                                //             const cursorPosition = textareaElement.selectionStart;
                                //             const newContent = content.slice(0, cursorPosition) + '\n' + content.slice(cursorPosition);
                                //             setContent(newContent);
                                //         }
                                //     }
                                // }}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-justify-content-end p-0 m-0">
                        <IonCol size="auto" className="m-0 p-0 ion-no-padding">
                            <IonButton
                                disabled={!isOnline}
                                color="primary"
                                size="small"
                                fill="outline"
                                onClick={HandleOnSubmitNote}
                                className='circular-button'>
                                <IonIcon className="m-0 p-0" size="small" slot="icon-only" icon={arrowDownOutlineIcon}></IonIcon>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCardContent>
        </IonCard>

    )
}
export default CardEditor;