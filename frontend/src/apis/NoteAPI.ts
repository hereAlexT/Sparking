import { supabase } from '../supabaseClient'
import {
    Note,
    NoteId,
    NoteImageId,
    NOTE_IMAGE_STATUS,
    NOTE_STATUS
} from '../shared/types'
import { Database } from '../shared/db.types'
import { UserId } from '../shared/types'

// Function to insert a new note in the "notes" table
export async function createNote(_note: Note) {
    const note: Database['public']['Tables']['notes']['Insert'] = {
        id: _note.id,
        body: _note.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
    const { data, error } = (await supabase.from('notes').insert(note));
    if (error) throw error;

    //create a list of note_images
    const noteImages = _note.images?.map((image) => {
        return {
            id: image.id,
            note_id: _note.id,
            user_id: _note.userId,
            created_at: new Date().toISOString(),
        }
    })

    const { data: noteImagesData, error: noteImagesError } = await supabase.from('note_images').insert(noteImages);
    if (noteImagesError) throw noteImagesError;

    return data;
}

// Function to update a note in the "notes" table
export async function updateNote(unsyncedNote: Note) {

    const note: Database['public']['Tables']['notes']['Update'] = {

        body: unsyncedNote.body,
        updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('notes').update(note).eq('id', unsyncedNote.id)
    if (error) throw error;
    return data;

}


// Function to delete a note from the "notes" table
export async function deleteNote(noteId: NoteId) {
    const { data, error } = await supabase.from('notes').delete().eq('id', noteId)
    if (error) throw error;
    return data;
}


export const getNotes = async (): Promise<Note[]> => {

    const { data, error } = await supabase.from('notes').select(`
        body,
        created_at,
        id,
        updated_at,
        user_id,
        note_images (
            id,
            created_at,
            note_id,
            user_id
        )
        `
    );
    if (error) throw error;
    // console.log(data)

    const mappedData = data.map(note => ({
        id: note.id,
        body: note.body,
        createdAt: note.created_at,
        updatedAt: note.updated_at,
        userId: note.user_id,
        images: note.note_images.map(image => ({
            id: image.id,
            createdAt: new Date(image.created_at),
            noteId: image.note_id,
            userId: image.user_id,
            status: NOTE_IMAGE_STATUS.UNSYNCED, // or whatever default status you want
            url: "" // You need to provide a URL here
        })),
        status: NOTE_STATUS.UNSYNCED, // or whatever default status you want
    }));

    return mappedData as Note[];

}

export const uploadImageToStorage = async (image: File, userId: UserId, noteImageID: NoteImageId) => {

    const { data, error } =
        await supabase
            .storage
            .from('note_images')
            .upload(
                `${userId}/${noteImageID}`,
                image,
                {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: 'image/jpeg',
                });
    if (error) throw error;
    return data;
}

 
export interface ImageTransformOptions {
    width: number;
    height: number;
    quality: number;
}



export const fetchImage = async (noteImageId: NoteImageId, userId: UserId, transform?: ImageTransformOptions): Promise<string> => {
    console.log("ImageId to fetch", noteImageId)

    const { data, error } = await supabase.storage.from('note_images').download(`${userId}/${noteImageId}`, {transform});

    if (error) throw error;
    const blob = data;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
