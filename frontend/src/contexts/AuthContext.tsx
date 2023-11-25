import { createContext, useContext, useReducer, ReactNode } from "react"
import { User } from "../shared/interfaces/User.interfaces";


const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    login: (email: string, password: string): boolean => { return false; },
    logout: () => {},
});

const initialState = {
    user: null,
    isAuthenticated: false,
}

interface State {
    user: any;
}

interface Action {
    type: string;
    payload?: any;
}

function reducer(state: State, action: Action) {
    switch (action.type) {
        case "login":
            return { ...state, user: action.payload, isAuthenticated: true }
        case "logout":
            console.log("reducer : logout")
            return { ...state, user: null, isAuthenticated: false };
        case "signup":
            console.log("reducer : signup")
            return { ...state, user: action.payload, isAuthenticated: true };
        default:
            throw new Error("Unknown action type");
    }
}


const TEST_USER = {
    userId: "123",
    displayName: "Crazy John",
    password: "password",
    email: "demo@linklabs.app",
    createdDate: new Date(),
};

interface AuthProviderProps {
    children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [{ user, isAuthenticated }, dispatch] = useReducer(
        reducer,
        initialState);

    function login(email: string, password: string): boolean {
        console.log("login function called " + email + " + " + password)
        if (email === TEST_USER.email && password === TEST_USER.password) {
            dispatch({ type: "login", payload: TEST_USER });
            return true;
        } else {
            return false;
        }
    }
    function logout() {
        console.log("AuthenContext - logout")
        dispatch({ type: "logout" });
    }

    function signup(email: string, password: string, displayName: string) {
        console.log("AuthenContext - signup")


        
        dispatch({ type: "signup", payload: { email, password, displayName }})
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