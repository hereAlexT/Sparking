import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton } from '@ionic/react';
import CardEditor from './CardEditor';
import { Note } from '../shared/types';
import './CardEditorModal.css'

interface CardEditorModalProps {
    isEditorOpen: boolean;
    isOnline: boolean;
    setIsEditorOpen: (isOpen: boolean) => void;
    handleOnUpdateNote: (note: Note) => void;
    selectedNote: Note | undefined;
    isSecondModalOpen: boolean;
    setIsSecondModalOpen: (isOpen: boolean) => void;


}

/**
 * @deprecated
 */
const CardEditorModal: React.FC<CardEditorModalProps> = ({ isEditorOpen, isOnline, selectedNote, handleOnUpdateNote, setIsEditorOpen }) => {
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const firstModalClass = isSecondModalOpen ? 'modal-with-backdrop' : '';


    return (
        <IonModal
            mode="ios"
            id="card-editor-modal"
            isOpen={isEditorOpen}
            className={`p-5 ${firstModalClass}`}
            onWillPresent={() => setIsSecondModalOpen(true)}
            onWillDismiss={() => setIsSecondModalOpen(false)}
        >
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => setIsEditorOpen(false)}>Cancel</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <CardEditor isOnline={isOnline} onProcessNote={handleOnUpdateNote} note={selectedNote} />
        </IonModal>
    );
};

export default CardEditorModal;
