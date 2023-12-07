import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
    IonButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonModal,
    IonContent,
    IonItem,
    IonInput,
    IonImg
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';

interface ImagePreviewModalProps {
    trigger?: string;
    url?: string;
    isOpen?: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ trigger, url, isOpen, setIsOpen }) => {


    const modal = useRef<HTMLIonModalElement>(null);
    const input = useRef<HTMLIonInputElement>(null);

    const [message, setMessage] = useState(
        'This modal example uses triggers to automatically open a modal when the button is clicked.'
    );

    function confirm() {
        modal.current?.dismiss(input.current?.value, 'confirm');
    }

    function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
        if (ev.detail.role === 'confirm') {
            setMessage(`Hello, ${ev.detail.data}!`);
        }
    }


    return (
        // JSX markup goes here
        <IonModal ref={modal} isOpen={isOpen} trigger={trigger} onWillDismiss={(ev) => onWillDismiss(ev)}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Welcome</IonTitle>
                    <IonButtons slot="end">
                        <IonButton strong={true} onClick={() => { setIsOpen(false); modal.current?.dismiss() }}>
                            Close
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonImg src={url} />
            </IonContent>
        </IonModal>
    );
};

export default ImagePreviewModal;
