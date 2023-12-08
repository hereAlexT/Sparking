import {
    IonIcon,
    IonContent,
    IonPopover,
    IonList,
    IonItem,
    IonButton,
    IonText
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
import { fetchImage } from '../apis/NoteAPI';
import ImagePreviewModal from './ImagePreviewModal';



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
    const [imageUrls, setImageUrls] = useState<string[]>([]);


    const _fetchImage = async (noteImageId: NoteImageId): Promise<string> => {
        if (!user || !user.id) {
            throw new Error("User is not defined");
        }

        //transformation only works for supabase pro users
        const transform = {
            // width: 500,
            // quality: 80
        }

        return fetchImage(noteImageId, user.id, transform);
    };





    useEffect(() => {

        const fetchImages = async () => {
            if (note.images) {

                const urls = await Promise.all(note.images.map(image => {
                    return _fetchImage(image.id); // add return here
                }));
                setImageUrls(urls);
            }
        };

        fetchImages();
    }, [note.images]);


    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

    return (
        <div className='m-0 p-0 w-full border-b border-slate-300'>
            <div className="grid grid-cols-12" >
                {/** First Row */}
                {/** Date Time */}
                <div className='pt-3 col-strat-1 col-span-4'>
                    <p className='font-light font-popins text-sm'>{formatDate(note.createdAt)}</p>
                </div>
                {/** Second Row */}
                {/** Note body */}
                <div className='pt-3 col-start-1 col-span-11'>
                    <Markdown className='font-poppins font-light' children={note.body} />
                </div>
                <div className='col-start-12 col-span-1' />
                {/** MutipleMedia Row */}
                <div className="col-start-1 col-span-11">
                    <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden" id="image_container">
                        {imageUrls.slice(0, 9).map((imageUrl, index) => (
                            <div key={index} >
                                <img
                                    src={imageUrl}
                                    alt={`Note ${note.id} Image ${index}`}
                                    className="h-32 w-full object-cover"
                                    onClick={() => { setSelectedImage(imageUrl); setIsOpen(true); }}
                                />
                            </div>
                        ))}
                    </div>
                    <ImagePreviewModal isOpen={isOpen} url={selectedImage} setIsOpen={setIsOpen} />
                </div>
                <div className='col-start-12 col-span-1' />

                {/** Third Row */}
                {/** Popover Menu */}
                <div className="col-start-12 col-span-1">
                    {/**Don't use button here, it makes the text un */}
                    <span id={`${cardSetId}-${note.id}`}>
                        <IonIcon size="small" color="medium" icon={ellipsisHorizontalSharpeIcon} />
                    </span>
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
                </div>
            </div>
        </div>

    );
};

export default NoteCardV2;
