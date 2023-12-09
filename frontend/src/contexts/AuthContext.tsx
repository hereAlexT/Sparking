import {
    createContext,
    useContext,
    useReducer,
    ReactNode,
    useEffect
} from "react"

import {
    Login as ApiLogin,
    loginWithGoogle as ApiLoginWithGoogle,
    Signup as ApiSignup,
    Logout as ApiLogout,
    getSession as ApiGetSession
} from '../apis/AuthenticationAPI';

import type {
    User,
    Session
} from '@supabase/gotrue-js/src/lib/types'


interface State {
    user?: User;
    session?: Session;
    isAuthenticated: boolean;
}

interface Action {
    type: string;
    payload?: any;
}

function reducer(state: State, action: Action) {
    switch (action.type) {
        case "login":
            return { ...state, user: action.payload.user, session: action.payload.session, isAuthenticated: true }
        case "logout":
            console.debug("reducer : logout")
            return { ...state, user: null, session: null, isAuthenticated: false };
        case "signup":
            console.debug("reducer : signup")
            return { ...state, user: null, isAuthenticated: false, session: null };
        case "getSession":
            console.debug("reducer : getSession")
            // console.debug("reducer : getSession session ", action.payload.session.session)
            // console.debug("reducer : getSession user", action.payload.session.session.user)
            return {
                ...state,
                user: action.payload.session.session.user,
                session: action.payload.session.session,
                isAuthenticated: true
            };
        default:
            throw new Error("Unknown action type");
    }
}

type AuthContextType = {
    user: User | null,
    session: Session | null,
    isAuthenticated: boolean,
    login: (email: string, password: string, captchaToken?: string) => void,
    logout: () => void,
    signup: (email: string, password: string, captchaToken?: string) => any,
    getSession: () => void,
    loginWithGoogle: () => any,
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isAuthenticated: false,
    login: (email: string, password: string, captchaToken?: string) => { },
    logout: () => { },
    signup: (email: string, password: string, captchaToken?: string) => { },
    getSession: () => { },
    loginWithGoogle: () => { },
});

const initialState = {
    user: null,
    session: null,
    isAuthenticated: false,
}


interface AuthProviderProps {
    children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [{ user, session, isAuthenticated }, dispatch] = useReducer(
        reducer,
        initialState);

    const login = async (email: string, password: string, captchaToken?: string) => {
        console.log("AuthContext - Signin")
        try {
            const { user, session } = await ApiLogin(email, password, captchaToken);
            dispatch({ type: "login", payload: { user, session } })
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    const loginWithGoogle = async () => {
        console.log("AuthContext - loginWithGoogle")
        try {
            const { data } = await ApiLoginWithGoogle();
            console.log("AuthContext - loginWithGoogle data", data)
            // dispatch({ type: "login", payload: { user, session } })
        } catch (error) {
            console.error(error)
            throw error;
        }

    }

    const signup = async (email: string, password: string, captchaToken?: string): Promise<any> => {
        console.log("AuthenContext - signup")
        try {
            const { user, session } = await ApiSignup(email, password, captchaToken)
            // dispatch({ type: "signup", payload: {} })
            return { user, session }
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
    const getSession = async () => {
        console.debug("AuthenContext - getSession")
        try {
            const session = await ApiGetSession();
            if (session.session) {
                dispatch({ type: "getSession", payload: { session } })
            }
        } catch (error) {
            console.error(error)
            throw error;

        }
    }


    const logout = async () => {
        console.log("AuthenContext - logout")
        try {
            await ApiLogout();
            dispatch({ type: "logout" });
        } catch (error) {
            console.error(error)
            throw error;
        }
    }



    useEffect(() => {
        const fetchSession = async () => {
            await getSession();
        };
        fetchSession();
    }, []);


    return (
        <AuthContext.Provider value={{ user, session, isAuthenticated, login, logout, signup, getSession, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    )

}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}
export { AuthProvider, useAuth }