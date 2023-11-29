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
        if (error) {
            throw error
        } else {
            return ({ user, session })
        }
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

const getSession = async () => {
    try {
        const { data: { session }, error} = await supabase.auth.getSession()
        if (error) {
            throw error
        } else {
            return {session}
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}


const Logout = async() => {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}



export { Signup, Login, Logout, getSession };

