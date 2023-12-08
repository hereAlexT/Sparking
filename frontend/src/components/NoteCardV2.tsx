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
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'



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
        <div className='m-0 py-3 w-full border-b border-slate-300'>
            <div className="grid grid-cols-12" >
                {/** First Row */}
                {/** Date Time */}
                <div className='pt-3 col-strat-1 col-span-4'>
                    <p className='font-light font-popins text-sm'>{formatDate(note.createdAt)}</p>
                </div>
                {/** Second Row */}
                {/** Note body */}
                <div className='mt-2 col-start-1 col-span-10'>
                    <Markdown
                        rehypePlugins={[rehypeKatex]}
                        remarkPlugins={[remarkMath]}
                        className='font-poppins font-normal text-zinc-800'
                        children={note.body}
                        components={{
                            h1: ({ node, ...props }) => <h1 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '1em', marginTop: '0.5em' }} {...props} />,
                            h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.3em', fontWeight: 'bold', marginBottom: '1em', marginTop: '0.5em' }} {...props} />,
                            h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '1em', marginTop: '0.5em' }} {...props} />,
                            h4: ({ node, ...props }) => <h4 style={{ fontSize: '1em', fontWeight: 'bold', marginBottom: '0.5em', marginTop: '0.5em' }} {...props} />,
                            h5: ({ node, ...props }) => <h5 style={{ fontSize: '1em', fontWeight: 'bold', marginBottom: '0.5em', marginTop: '0em' }} {...props} />,
                            h6: ({ node, ...props }) => <h6 style={{ fontSize: '1em', fontWeight: 'bold', marginBottom: '0.5em', marginTop: '0em' }} {...props} />,
                            ul: ({ node, ...props }) => <ul style={{ listStyleType: 'disc', paddingLeft: '1em' }} {...props} />,
                            ol: ({ node, ...props }) => <ol style={{ listStyleType: 'decimal', paddingLeft: '1em' }} {...props} />,
                            li: ({ node, ...props }) => <li style={{ margin: '0.5em 0' }} {...props} />,
                            p: ({ node, ...props }) => <p style={{ margin: '0 0', lineHeight: '1.5em' }} {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote style={{ margin: '1em 0', paddingLeft: '1em', borderLeft: '4px solid #ddd' }} {...props} />,
                            code: ({ node, ...props }) => <code style={{ fontFamily: 'monospace', backgroundColor: '#f9f9f9', padding: '2px 4px', borderRadius: '3px' }} {...props} />,
                            pre: ({ node, ...props }) => <pre style={{ fontFamily: 'monospace', backgroundColor: '#f9f9f9', padding: '1em', borderRadius: '3px', overflowX: 'auto' }} {...props} />,
                            em: ({ node, ...props }) => <em style={{ fontStyle: 'italic' }} {...props} />,
                            strong: ({ node, ...props }) => <strong style={{ fontWeight: 'bold' }} {...props} />,
                            del: ({ node, ...props }) => <del style={{ textDecoration: 'line-through' }} {...props} />,
                            hr: ({ node, ...props }) => <hr style={{ border: 'none', borderTop: '1px solid #ddd' }} {...props} />,
                            a: ({ node, ...props }) => <a style={{ color: '#0366d6', textDecoration: 'none' }} {...props} />,
                            img: ({ node, ...props }) => <img style={{ maxWidth: '100%' }} {...props} />,
                        }}

                    />
                </div>
                <div className='col-start-12 col-span-1' />

                {/** MutipleMedia Row */}
                <div className="col-start-1 col-span-10">
                    <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg overflow-hidden" id="image_container">
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
                <div className="mt-2 col-start-12 col-span-1 bg-black-600" >
                    {/**Don't use button here, it makes the text un */}
                    <span className='flex justify-end'>
                        <IonIcon id={`${cardSetId}-${note.id}`} size="small" color="medium" icon={ellipsisHorizontalSharpeIcon} />
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
