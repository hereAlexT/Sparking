import {
  getNotes as getNotesApi,
  createNote as createNoteApi,
  updateNote as updateNoteApi,
  deleteNote as deleteNoteApi,
  uploadImageToStorage,
} from "../apis/NoteAPI";
import { Note, NoteId } from "../shared/types";
import camelcaseKeys from "camelcase-keys";
import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useState,
} from "react";

interface NotesProviderProps {
  children: ReactNode;
}

enum NOTE_ACTION {
  CREATE_NOTE = "CREATE_NOTE",
  DELETE_NOTE = "DELETE_NOTE",
  UPDATE_NOTE = "UPDATE_NOTE",
  GET_NOTES = "GET_NOTES",
  GET_NOTE = "GET_NOTE",
  SEARCH_NOTES = "SEARCH_NOTES",
}

type NoteAction =
  | Action<Note> // used for CREATE_NOTE, UPDATE_NOTE
  | Action<NoteId> // used for DELETE_NOTE, GET_NOTE
  | Action<Note[]>; // used for GET_NOTES, SEARCH_NOTES

interface Action<T> {
  type: NOTE_ACTION;
  payload: T;
}

const reducer = (state: Note[], action: NoteAction): Note[] => {
  console.debug("reducer called");
  switch (action.type) {
    case NOTE_ACTION.CREATE_NOTE:
      return [action.payload as Note, ...state];
    case NOTE_ACTION.DELETE_NOTE:
      return state.filter((note) => note.id !== (action.payload as NoteId));
    case NOTE_ACTION.UPDATE_NOTE:
      return state.map((note) =>
        note.id === ((action.payload as Note)?.id || null)
          ? (action.payload as Note)
          : note,
      );
    case NOTE_ACTION.GET_NOTES:
    case NOTE_ACTION.SEARCH_NOTES:
      console.debug("searchNotes called");
      return action.payload as Note[]; // return the filtered notes
    default:
      return state;
  }
};

type NotesContextType = {
  notes: Note[];
  createNote: (note: Note) => void;
  deleteNote: (id: NoteId) => void;
  updateNote: (note: Note) => void;
  getNotes: () => Promise<Note[]>;
  searchNotes: (query: string) => void;
};

const NotesContext = createContext<NotesContextType>({
  notes: [],
  createNote: (note: Note) => {},
  deleteNote: (id: NoteId) => {},
  updateNote: (note: Note) => {},
  getNotes: () => Promise.resolve([]),
  searchNotes: (query: string) => {},
});

const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, dispatch] = useReducer(reducer, []);
  const [searchResults, setSearchResults] = useState(notes);

  async function blobUrlToFile(
    blobUrl: string,
    filename: string,
  ): Promise<File> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });
    return file;
  }

  const createNote = async (unSyncedNote: Note) => {
    try {
      console.debug("unSyncedNote", unSyncedNote);
      if (unSyncedNote.images) {
        console.log("does the note image exist?");
        // create file object from blob url
        const filePromises = unSyncedNote.images!.map((image, index) =>
          blobUrlToFile(image.url, `filename${index}`),
        );
        // upload pics
        const uploadedImagesPromises = unSyncedNote.images!.map((image) =>
          blobUrlToFile(image.url, image.id).then((file) =>
            uploadImageToStorage(file, unSyncedNote.userId!, image.id),
          ),
        );
      }

      let response = await createNoteApi(unSyncedNote);
      dispatch({ type: NOTE_ACTION.CREATE_NOTE, payload: unSyncedNote });
    } catch (err) {
      throw err;
    }
  };

  const deleteNote = async (noteId: NoteId) => {
    try {
      let response = await deleteNoteApi(noteId);
      dispatch({ type: NOTE_ACTION.DELETE_NOTE, payload: noteId });
    } catch (err) {
      throw err;
    }
  };

  const updateNote = async (unSyncedNote: Note) => {
    try {
      let response = await updateNoteApi(unSyncedNote);
      dispatch({ type: NOTE_ACTION.UPDATE_NOTE, payload: unSyncedNote });
    } catch (err) {
      throw err;
    }
  };

  /**
   * Fetches notes from the API and updates the state.
   * @param notes - The array of synced notes.
   */
  const getNotes = async (): Promise<Note[]> => {
    //Connect to API and fetch all notes
    let _notes: Note[] = await getNotesApi();
    // conert snakecase to camelcase by using camelcaseKeys
    _notes = camelcaseKeys(_notes, { deep: true });
    _notes = _notes.map((note) => ({
      ...note,
      updatedAt: new Date(note.updatedAt),
      createdAt: new Date(note.createdAt),
    }));
    console.debug("getNotes called");
    _notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    dispatch({ type: NOTE_ACTION.GET_NOTES, payload: _notes });
    return _notes;
  };

  // Modify the searchNotes function
  const searchNotes = (query: string) => {
    console.debug("triggered searchNotes");

    if (query) {
      const _notes = notes.filter((note) => note.body.includes(query));
      setSearchResults(_notes);
    } else {
      // When the search query is cleared, set searchResults back to notes
      setSearchResults(notes);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        createNote,
        deleteNote,
        updateNote,
        getNotes,
        searchNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

export { NotesProvider, useNotes };
