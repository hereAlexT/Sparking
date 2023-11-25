import { supabase } from '../supabaseClient'

// Function to insert a new note in the "notes" table
async function insertNote(body: string) {
    try {
        const { data, error } = await supabase.from('notes').insert({ body })
        if (error) {
            throw new Error(error.message)
        }
        return data
    } catch (error) {
        console.error('Error inserting note:', error)
        throw error
    }
}

// Function to update a note in the "notes" table
async function updateNote(id: number, body: string) {
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
async function deleteNote(id: number) {
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



