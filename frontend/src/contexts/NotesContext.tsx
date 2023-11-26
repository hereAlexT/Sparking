import { createContext, useContext, useReducer, ReactNode } from "react"
import {
    NOTE_ACTION,
    Note,
    CreateNoteAction,
    DeleteNoteAction,
    UpdateNoteAction,
    GetNoteAction,
    GetNotesAction,
    NoteId,
    UnSyncedNote,
} from '../shared/types';


interface NotesProviderProps {
    children: ReactNode;
}


type NoteAction = GetNoteAction | GetNotesAction | CreateNoteAction | DeleteNoteAction | UpdateNoteAction;


const reducer = (state: Note[], action: NoteAction): Note[] => {
    console.log("state")
    console.log(state)
    switch (action.type) {
        case NOTE_ACTION.CREATE_NOTE:
            console.log("reducer : CREATE_NOTE")
            return [...state, action.payload];
        case NOTE_ACTION.DELETE_NOTE:
            console.log("reducer : DELETE_NOTE")
            return state.filter(note => note.id !== action.payload);
        case NOTE_ACTION.UPDATE_NOTE:
            console.log("reducer : UPDATE_NOTE")
            return state.map(note => note.id === (action.payload ? action.payload.id : null) ? action.payload : note);
        case NOTE_ACTION.GET_NOTES:
            //get notes online
            console.log("reducer : GET_NOTES")
        default:
            return state;
    }
}

type NotesContextType = {
    notes: Note[];
    createNote: (note: Note) => void;
    deleteNote: (id: NoteId) => void;
    updateNote: (note: Note) => void;
    getNotes: (notes: Note[]) => void;
};

const NotesContext = createContext<NotesContextType>({
    notes: [],
    createNote: (note: Note) => { },
    deleteNote: (id: NoteId) => { },
    updateNote: (note: Note) => { },
    getNotes: (notes: Note[]) => { },
});




const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
    const [notes, dispatch] = useReducer(reducer, [])
    const createNote = async (unSyncedNote: UnSyncedNote) => {
        dispatch({ type: NOTE_ACTION.CREATE_NOTE, payload: unSyncedNote })
    }

    const deleteNote = async (id: NoteId) => {
        dispatch({ type: NOTE_ACTION.DELETE_NOTE, payload: id })
    }

    const updateNote = async (note: UnSyncedNote) => {
        dispatch({ type: NOTE_ACTION.UPDATE_NOTE, payload: note })
    }

    const getNotes = async (notes: Note[]) => {
        dispatch({ type: NOTE_ACTION.GET_NOTES })
    }

    return (
        <NotesContext.Provider value={{ notes, createNote, deleteNote, updateNote, getNotes }}>
            {children}
        </NotesContext.Provider>
    )
}

const useNotes = () => {
    const context = useContext(NotesContext)
    if (context === undefined) {
        throw new Error("useNotes must be used within a NotesProvider")
    }
    return context;
}

export { NotesProvider, useNotes }