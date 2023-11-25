import { supabase } from '../supabaseClient' 


async function insertDisplayName(displayName: string) {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert({ display: displayName });
        if (error) {
            throw new Error(error.message);
        }
        console.log('Display name inserted successfully:', data);
    } catch (error) {
        console.error('Error inserting display name:', error);
    }
}



