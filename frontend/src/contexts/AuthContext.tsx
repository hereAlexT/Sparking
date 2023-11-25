import { createContext, useContext, useReducer, ReactNode } from "react"
import { Login as ApiLogin, Signup as ApiSignup } from '../apis/AuthenticationAPI';
import type {
    User,
    Session
} from '@supabase/gotrue-js/src/lib/types'



type AuthContextType = {
    user: User | null,
    session: Session | null,
    isAuthenticated: boolean,
    login: (email: string, password: string) => void,
    logout: () => void,
};

interface State {
    user?: User;
}

interface Action {
    type: string;
    payload?: any;
}


const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isAuthenticated: false,
    login: (email: string, password: string) => { },
    logout: () => { },
});

const initialState = {
    user: null,
    isAuthenticated: false,
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
            return { ...state, user: action.payload, isAuthenticated: true };
        default:
            throw new Error("Unknown action type");
    }
}



interface AuthProviderProps {
    children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [{ user, isAuthenticated }, dispatch] = useReducer(
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


    function logout() {
        console.log("AuthenContext - logout")
        dispatch({ type: "logout" });
    }

    function signup(email: string, password: string, displayName: string) {
        console.log("AuthenContext - signup")



        dispatch({ type: "signup", payload: { email, password, displayName } })
    }


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup }}>
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