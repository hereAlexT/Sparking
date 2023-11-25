import { useContext } from 'react';
import { supabase } from '../supabaseClient' 


const Signup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        // options: {
        //     emailRedirectTo: 'http://localhost:3000/confirm'
        // }
    });

    return { data, error };
};

const Login = async (email: string, password: string) => {
    console.log("login called")

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    return { data, error };
};

export {Signup, Login};

