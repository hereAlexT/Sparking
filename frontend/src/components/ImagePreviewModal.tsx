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
    trigger: string;
    url: string;

}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ trigger, url}) => {


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
        <IonModal ref={modal} trigger={trigger} onWillDismiss={(ev) => onWillDismiss(ev)}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>Welcome</IonTitle>
                    <IonButtons slot="end">
                        <IonButton strong={true} onClick={() => confirm()}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonImg src={url}/>
            </IonContent>
        </IonModal>
    );
};

export default ImagePreviewModal;
