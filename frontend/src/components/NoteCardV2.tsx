import {
    IonIcon,
    IonContent,
    IonPopover,
    IonList,
    IonItem,
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

        const transform = {
            width:500,
            quality:80
        }

        return fetchImage(noteImageId, user.id, transform);
    };


    useEffect(() => {

        const fetchImages = async () => {
            if (note.images) {

                const urls = await Promise.all(note.images.map(image => {
                    console.log("note image here", image)
                    console.log("iamgeid", image.id)
                    return _fetchImage(image.id); // add return here
                }));
                console.log(urls)
                setImageUrls(urls);
            }
        };

        fetchImages();
    }, [note.images]);

    function getClassesForImage(index: number, total: number) {
        if (total === 1) {
            return 'w-3/4';
        } else if (total === 3 && index === 0) {
            return 'w-1/2';
        } else if (total === 3 && index > 0) {
            return 'w-1/2 h-1/2';
        } else if (total >= 4 && total <= 6) {
            return 'w-1/2 h-1/2';
        } else {
            return 'w-1/3 h-1/3';
        }
    }



    return (
        <div className='m-0 p-0 rounded-none w-full border-b border-slate-300  shadow-none'>
            <div className='m-0 p-0'>
                <div className="flex flex-wrap" >
                    <div className='pt-3 flex w-full'>
                        <div className="w-full" id="dt-col" >
                            <p className='font-light font-popins text-sm'>{formatDate(note.createdAt)}</p>
                        </div>

                        <div className="w-1/25" id='sync-col' >
                        </div>
                    </div>
                    <div className='pt-3 flex w-full'>
                        <div className="w-full" id='body-col'>
                            <Markdown className='font-poppins font-light' children={note.body} />
                        </div>
                        <div className="w-1/25 flex items-center justify-end" id='link-col'>
                        </div>
                    </div>
                    <div className="flex flex-wrap" id="image_container">
                        {imageUrls.slice(0, 9).map((imageUrl, index) => (
                            <div key={index} className={`${getClassesForImage(index, imageUrls.length)} p-1 rounded-2xl`}>
                                <img src={imageUrl} alt={`Note ${note.id} Image ${index}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <div className="flex w-full">
                        <div className="w-full" />
                        <div className="w-1/25" id='menu-col'>
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
            </div>
        </div>
    );
};

export default NoteCardV2;
