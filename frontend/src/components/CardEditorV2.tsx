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
    cameraOutline as cameraOutlineIcon,
    closeOutline as closeOutlineIcon,
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
        if (!user) throw new Error("User is null");
        const newNote: Note = {
            id: _noteid,
            createdAt: note?.createdAt || new Date(),
            updatedAt: new Date(),
            body: content,
            images: images,
            status: NOTE_STATUS.UNSYNCED,
            userId: user.id
        }
        onSubmit(newNote);
        setContent('');
        setImages([]);
    }

    const handleImageButtonClick = async () => {
        const _images = await Camera.pickImages({
            quality: 90,
        });


        _images.photos.forEach((image) => {
            if (image.webPath) {
                if (!user) throw new Error("User is null");
                const newImage: NoteImage = {
                    createdAt: new Date(),
                    id: uuidv4(),
                    url: image.webPath,
                    noteId: _noteid,
                    userId: user.id,
                    status: NOTE_IMAGE_STATUS.UNSYNCED
                };
                setImages(prevImages => [...prevImages, newImage]);
            };

        })
    };



    const handleCameraButtonClick = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri
        });

        if (image.webPath) {
            if (!user) throw new Error("User is null");
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
        <div className="grid grid-cols-12">
            <div className="col-span-12 col-start-1">
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

            <div className='col-span-12 col-start-1'>
                <div className='grid grid-cols-3 gap-1 w-full'>
                    {images.map((image, index) => (
                        <div key={index} className="relative">
                            <img alt={`Image ${index}`} src={image.url} className="w-full h-32 object-cover" />
                            {/* <button
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 circular-button"
                            onClick={() => handleDeleteImage(index)}
                        >
                            <IonIcon color="dark" className="m-0 p-0" size="small" slot="icon-only" icon={closeOutlineIcon} />
                        </button> */}

                            <IonButton
                                color="light"
                                size="small"
                                fill="outline"
                                onClick={() => handleDeleteImage(index)}
                                className='absolute top-0 right-0  text-white rounded-full p-1 circular-button'>
                                <IonIcon color="light" className="m-0 p-0" size="small" slot="icon-only" icon={closeOutlineIcon} />
                            </IonButton>
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-span-1 col-start-1">
                <IonButton
                    color="primary"
                    size="small"
                    fill="clear"
                    onClick={handleCameraButtonClick}
                    className='circular-button'>
                    <IonIcon color="dark" className="m-0 p-0" size="small" slot="icon-only" icon={cameraOutlineIcon} />
                </IonButton>
            </div>
            <div className="col-span-1 col-start-2">
                <IonButton
                    color="primary"
                    size="small"
                    fill="clear"
                    onClick={handleImageButtonClick}
                    className='circular-button'>
                    <IonIcon color="dark" className="m-0 p-0" size="small" slot="icon-only" icon={imageOutlineIcon} />
                </IonButton>
            </div>
            <div className='col-span-1 col-start-12'>
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
