import { useContext } from 'react';
import { supabase } from '../supabaseClient'
import type {
    AuthTokenResponse
} from '@supabase/gotrue-js/src/lib/types'




const Signup = async (email: string, password: string) => {
    try {
        const { data: { user, session }, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        return { user, session }
    } catch (error) {
        console.error(error)
        throw error
    }
};

const Login = async (email: string, password: string) => {
    try {
        const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) {
            throw error
        } else {
            return { user, session }
        }
    } catch (error) {
        console.error(error)
        throw error
    }
};

export { Signup, Login };

