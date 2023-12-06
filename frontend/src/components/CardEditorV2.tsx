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
import { Note, NoteImage, NOTE_IMAGE_STATUS, NOTE_STATUS, NoteId } from '../shared/types';
import {
    arrowForwardOutline as arrowForwardOutlineIcon,
    imageOutline as imageOutlineIcon,
    imageSharp
} from 'ionicons/icons';
import { v4 as uuidv4 } from 'uuid';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { useAuth } from '../contexts/AuthContext';

interface CardEditorV2Props {
    onSubmit: (noteContent: Note) => void;
    note?: Note;
    isOnline?: boolean;
}



const CardEditorV2: React.FC<CardEditorV2Props> = ({ onSubmit, note, isOnline = true }) => {
    const _noteid = note?.id || uuidv4();
    const [content, setContent] = useState('');
    const { user } = useAuth();

    const HandleOnSubmit = () => {
        const newNote: Note = {
            id: _noteid,
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
                createdAt: new Date(),
                id: uuidv4(),
                url: image.webPath,
                noteId: _noteid,
                userId: user?.id,
                status: NOTE_IMAGE_STATUS.UNSYNCED
            };
            setImages(prevImages => [...prevImages, newImage]);
        }
    };

    const [images, setImages] = useState<NoteImage[]>([]);

    function handleDeleteImage(index: number) {
        setImages(images => images.filter((_, i) => i !== index));
    }

    return (
        <div className="flex flex-wrap">
            <div className="w-full">
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
            </div>
            <div className='flex justify-start'>
                {images.map((image, index) => (
                    <div key={index} className="relative">
                        <img alt={`Image ${index}`} src={image.url} />
                        <button
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            onClick={() => handleDeleteImage(index)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>

            <div className="w-1/12">
                <IonButton
                    color="primary"
                    size="small"
                    fill="clear"
                    onClick={handleImageButtonClick}
                    className='circular-button'>
                    <IonIcon color="dark" className="m-0 p-0" size="small" slot="icon-only" icon={imageOutlineIcon} />
                </IonButton>
            </div>
            <div className="w-10/12" />
            <div className='w-1/12 flex items-center justify-end'>
                <IonButton
                    disabled={!isOnline || content.length === 0}
                    color="primary"
                    size="small"
                    fill="solid"
                    onClick={HandleOnSubmit}
                    className='circular-button'>
                    <IonIcon color="light" className="m-0 p-0" size="small" slot="icon-only" icon={arrowForwardOutlineIcon}></IonIcon>
                </IonButton>
            </div>
        </div>
    )
};

export default CardEditorV2;
