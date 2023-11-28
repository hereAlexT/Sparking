import { supabase } from '../supabaseClient'
import { SyncedNote, UnSyncedNote, Note, NoteId } from '../shared/types'
import { Database } from '../shared/db.types'

// Function to insert a new note in the "notes" table
export async function createNote(unSyncedNote: UnSyncedNote) {
    const note: Database['public']['Tables']['notes']['Insert'] = {
        id: unSyncedNote.id,
        body: unSyncedNote.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
    const { data, error } = (await supabase.from('notes').insert(note));
    if (error) throw error;
    return data;
}

// Function to update a note in the "notes" table
export async function updateNote(unsyncedNote: UnSyncedNote) {

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




export const getNotes = async (): Promise<SyncedNote[]> => {

    const { data, error } = await supabase.from('notes').select();
    if (error) throw error;
    return data as SyncedNote[];

}
