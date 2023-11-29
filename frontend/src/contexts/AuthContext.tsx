import {
    createContext,
    useContext,
    useReducer,
    ReactNode,
    useEffect
} from "react"

import {
    Login as ApiLogin,
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
            console.log("reducer : logout")
            return { ...state, user: null, session: null, isAuthenticated: false };
        case "signup":
            console.log("reducer : signup")
            return { ...state, user: null, isAuthenticated: false, session: null };
        case "getSession":
            console.log("reducer : getSession")
            console.log("reducer : getSession session ", action.payload.session.session)
            console.log("reducer : getSession user", action.payload.session.session.user)
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
    login: (email: string, password: string) => void,
    logout: () => void,
    signup: (email: string, password: string) => void,
    getSession: () => void,
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isAuthenticated: false,
    login: (email: string, password: string) => { },
    logout: () => { },
    signup: (email: string, password: string) => { },
    getSession: () => { },
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

    const login = async (email: string, password: string) => {
        console.log("AuthContext " + email + " + " + password)
        try {
            const { user, session } = await ApiLogin(email, password);
            dispatch({ type: "login", payload: { user, session } })
        } catch (error) {
            console.error(error)
            throw error;
        }

    }
    const getSession = async () => {
        console.log("AuthenContext - getSession")
        try {
            const session = await ApiGetSession();
            dispatch({ type: "getSession", payload: { session } })
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

    const signup = async (email: string, password: string) => {
        console.log("AuthenContext - signup")
        try {
            console.log("hehh")
            const { user, session } = await ApiSignup(email, password)
                .catch(error => {
                    console.error('Error during signup:', error);
                    throw error;
                });;
            console.log(user)
            console.log(session)
            dispatch({ type: "signup", payload: { email, password } })
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
        <AuthContext.Provider value={{ user, session, isAuthenticated, login, logout, signup, getSession }}>
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