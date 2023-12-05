import React, { useState } from 'react';

import {
    IonCardContent,
    IonCard,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonTextarea,
    IonIcon,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonImg,
    IonThumbnail

} from '@ionic/react';
import { Note, UnSyncedNote, NoteImage, NOTE_IMAGE_STATUS, NOTE_STATUS } from '../shared/types';
import {
    arrowForwardOutline as arrowForwardOutlineIcon,
    imageOutline as imageOutlineIcon,
    imageSharp
} from 'ionicons/icons';
import { v4 as uuidv4 } from 'uuid';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';

interface CardEditorV2Props {
    onSubmit: (noteContent: Note) => void;
    note?: Note;
    isOnline?: boolean;
}



const CardEditorV2: React.FC<CardEditorV2Props> = ({ onSubmit, note, isOnline = true }) => {
    const [content, setContent] = useState('');

    const HandleOnSubmit = () => {
        const newNote: Note = {
            id: note?.id || uuidv4(),
            createdAt: note?.createdAt || new Date(),
            updatedAt: new Date(),
            body: content,
            images: images,
            status: NOTE_STATUS.UNSYNCED
        }
        onSubmit(newNote);
        setContent('');
        setImages([]);
    }

    const handleImageButtonClick = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri
        });

        if (image.webPath) {
            const newImage: NoteImage = {
                NoteImageId: uuidv4(),
                url: image.webPath,
                NOTE_IMAGE_STATUS: NOTE_IMAGE_STATUS.UNSYNCED
            };
            setImages(prevImages => [...prevImages, newImage]);
        }
    };

    const [images, setImages] = useState<NoteImage[]>([]);

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
            <IonRow className='ion-justify-content-start'>
                {images.map((image, index) => (
                    <IonCol key={index}>
                        <IonImg alt={`Image ${index}`} src={image.url} />
                    </IonCol>
                ))}
            </IonRow>


            <IonRow>
                <IonCol size="1" className='' >
                    <IonButton
                        color="primary"
                        size="small"
                        fill="clear"
                        onClick={handleImageButtonClick}
                        className='circular-button'>
                        <IonIcon color="dark" className="m-0 p-0" size="small" slot="icon-only" icon={imageOutlineIcon} />
                    </IonButton>
                </IonCol>
                <IonCol size="10" className='' />
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
