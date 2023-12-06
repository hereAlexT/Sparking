import {
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonIcon,
    IonContent,
    IonButton,
    IonPopover,
    IonList,
    IonItem,
    IonImg
} from '@ionic/react';
import {
    navigateOutline as navigateOutlineIcon,
    cloudOutline as cloudOutlineIcon,
    cloudOfflineOutline as cloudOfflineOutlineIcon,
    ellipsisHorizontalSharp as ellipsisHorizontalSharpeIcon,
    chevronForwardOutline as chevronForwardOutlineIcon,
    createOutline as CreateOutlineIcon,
    trashOutline as TrashOutlineIcon
} from 'ionicons/icons';
import { Note, NoteId, NoteImageId } from '../shared/types';
import './NoteCardV2.css';
import { createRoot } from 'react-dom/client'
import { useAuth } from '../contexts/AuthContext';
import Markdown from 'react-markdown'
import { supabase } from '../supabaseClient'; // adjust the import path to your actual file
import { useEffect, useState } from 'react';



const formatDate = (date: Date): string => {
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
interface NoteCardV2Props {
    note: Note;
    cardSetId: string;
    isOnline: boolean;
    onDeleteNote: (noteId: NoteId) => void;
    onEditNote: (noteId: NoteId) => void;
}



const NoteCardV2: React.FC<NoteCardV2Props> = ({ note, cardSetId, isOnline, onDeleteNote, onEditNote }) => {

    const { user } = useAuth();


    const fetchImage = async (noteImageId: NoteImageId): Promise<string> => {
        console.log("ImageId to fetch", noteImageId)

        const { data, error } = await supabase.storage.from('note_images').download(`${user?.id}/${noteImageId}`);

        if (error) throw error;
        const blob = data;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {

        const fetchImages = async () => {
            if (note.images) {

                const urls = await Promise.all(note.images.map(image => {
                    console.log("note image here", image)
                    console.log("iamgeid", image.noteImageId)
                    return fetchImage(image.noteImageId); // add return here
                }));
                console.log(urls)
                setImageUrls(urls);
            }
        };

        fetchImages();
    }, [note.images]);





    return (
        <IonCard className='m-0 p-0 rounded-none w-full border-b border-slate-300  shadow-none'>
            <IonCardContent className='m-0 p-0'>
                <IonGrid class="ion-no-padding" style={{ "--ion-grid-columns": "25" }}>
                    <IonRow className='pt-3'>
                        <IonCol size="24" className='' id="dt-col" >
                            <IonText className='font-light font-roboto-condensed text-sm'>{formatDate(note.createdAt)}</IonText>
                            {/* <IonIcon icon={navigateOutlineIcon} />
                            <IonText className='font-roboto-condensed font-light'>Summer Hill, Sydney</IonText> */}
                        </IonCol>

                        <IonCol size="1" className='' id='sync-col' >
                            {/* <IonIcon className="float-right" icon={cloudOutlineIcon} /> */}
                            {/* <IonIcon className="float-right" icon={cloudOfflineOutlineIcon} /> */}
                        </IonCol>
                    </IonRow>
                    <IonRow className='pt-3'>
                        <IonCol size="24" id='body-col' className=''>
                            {/* {note.body.split('\n').map((line, index) => (
                                <IonText key={index} className='font-poppins font-light' color="dark">
                                    {line}
                                    <br />
                                </IonText>))} */}

                            <Markdown className='font-poppins font-light' children={note.body} />
                        </IonCol>
                        <IonCol size="1" id='link-col' className="flex items-center justify-end ">
                            {/* <IonIcon className='' icon={chevronForwardOutlineIcon} /> */}
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        {/** Pic here */}
                        <IonCol>
                            {imageUrls.map((imageUrl, index) => (
                                <IonImg key={index} src={imageUrl} alt={`Note ${note.id} Image ${index}`} />
                            ))}
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="24" />
                        <IonCol size="1" id='menu-col' className=''>
                            <span id={`${cardSetId}-${note.id}`}>
                                <IonIcon size="small" color="medium" icon={ellipsisHorizontalSharpeIcon} />
                            </span>
                            {/* IonButton or button here will cause text cannot be selected bug.
                            <IonButton
                                id={`${cardSetId}-${note.id}`}
                                size="small"
                                fill="clear"
                                className='float-right note-menu-button'>
                                <IonIcon size="small" color="medium" icon={ellipsisHorizontalSharpeIcon} />
                            </IonButton> */}
                            <IonPopover
                                trigger={`${cardSetId}-${note.id}`}
                                dismissOnSelect={true}
                                keyboardClose={true}
                                side="left"
                                alignment='end'
                                showBackdrop={true}
                                arrow={false}
                            >
                                <IonContent>
                                    <IonList className="" lines='none'>
                                        <IonItem button={true} detail={false} onClick={((e) => onEditNote(note.id))}>
                                            <IonIcon slot="start" size="small" icon={CreateOutlineIcon}></IonIcon>
                                            Edit
                                        </IonItem>
                                        <IonItem disabled={!isOnline} button={true} detail={false} onClick={(e) => onDeleteNote(note.id)}>
                                            <IonIcon slot="start" size="small" icon={TrashOutlineIcon}></IonIcon>
                                            Delete
                                        </IonItem>
                                    </IonList>
                                </IonContent>
                            </IonPopover>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCardContent>
        </IonCard >
    );
};

export default NoteCardV2;
