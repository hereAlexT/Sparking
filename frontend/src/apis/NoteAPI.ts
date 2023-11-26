import { supabase } from '../supabaseClient'
import { SyncedNote, UnSyncedNote, Note } from '../shared/types'
import { Database } from '../shared/db.types'

// Function to insert a new note in the "notes" table
export async function createNote(unSyncedNote: UnSyncedNote) {
    try {
        const note: Database['public']['Tables']['notes']['Insert'] = {
            body: unSyncedNote.body,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        const { data } = await supabase.from('notes').insert(note);
        console.log(data)
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function to update a note in the "notes" table
export async function updateNote(id: number, body: string) {
    try {
        const { data, error } = await supabase.from('notes').update({ body }).eq('id', id)
        if (error) {
            throw new Error(error.message)
        }
        return data
    } catch (error) {
        console.error('Error updating note:', error)
        throw error
    }
}

// Function to delete a note from the "notes" table
export async function deleteNote(id: number) {
    try {
        const { data, error } = await supabase.from('notes').delete().eq('id', id)
        if (error) {
            throw new Error(error.message)
        }
        return data
    } catch (error) {
        console.error('Error deleting note:', error)
        throw error
    }
}




export const getNotes = async (): Promise<SyncedNote[]> => {
    try {
        const { data } = await supabase.from('notes').select();
        return data as SyncedNote[];
    } catch (error) {
        console.error(error);
        throw error;
    }
}
