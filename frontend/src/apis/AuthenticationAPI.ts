import { useContext } from 'react';
import { supabase } from '../supabaseClient'
import type {
    AuthTokenResponse
} from '@supabase/gotrue-js/src/lib/types'
import { PassThrough } from 'stream';
import { DOMAIN_NAME } from '../config';




export const Signup = async (email: string, password: string, captchaToken?: string) => {
    try {
        const { data: { user, session }, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: { captchaToken }
        });
        console.log(user, session)
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

export const Login = async (email: string, password: string, captchaToken?: string) => {
    try {
        const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
            options: { captchaToken }
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

export const loginWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        })
        if (error) {
            throw error
        } else {
            return { data }
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getSession = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
            throw error
        } else {
            return { session }
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}


export const Logout = async () => {
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

export const UpdateUserPassword = async (password: string) => {
    try {
        const { data, error } = await supabase.auth.updateUser({ password: password })
        if (error) {
            throw error
        } else {
            return { data }
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const resetPasswordForEmail = async (email: string) => {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
            email, {
            redirectTo: DOMAIN_NAME + '/account/update-password',
        })
        if (error) {
            throw error
        } else {
            return { data }
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}