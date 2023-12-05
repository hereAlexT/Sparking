export type NoteId = string;
export type UserId = string;
export type NoteImageId = string;


export enum NOTE_STATUS {
    SYNCED = "SYNCED",
    UNSYNCED = "UNSYNCED",
    SYNCING = "SYNCING"
}

export enum NOTE_IMAGE_STATUS {
    SYNCED = "SYNCED",
    UNSYNCED = "UNSYNCED",
    SYNCING = "SYNCING"
}

export interface NoteImage {
    NoteImageId: NoteImageId;
    url: string;
    NOTE_IMAGE_STATUS: NOTE_IMAGE_STATUS;
}

//todo: change name to synced note
export interface Note {
    id: NoteId;
    body: string;
    // createdAt should be assigned locally.
    createdAt: Date;
    // updatedAt should be assigned locally.
    updatedAt: Date;
    images?: NoteImage[];
    status?: NOTE_STATUS; // this should be compulsary in the next version
    userId?: UserId; // this should be compulsary in the next version
}

export interface SyncedNote extends Note {
    // This is a synced id with the backend
}


/** In unsynced id, this id should be a temporal id,
 * the true uuid should be assigned by the backend
 */
export interface UnSyncedNote extends Note {
}


export enum NOTE_ACTION {
    CREATE_NOTE = "CREATE_NOTE",
    DELETE_NOTE = "DELETE_NOTE",
    UPDATE_NOTE = "UPDATE_NOTE",
    GET_NOTES = "GET_NOTES",
    GET_NOTE = "GET_NOTE",
    SEARCH_NOTES = "SEARCH_NOTES"
}

export enum AUTH_ACTION {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    SIGNUP = "REGISTER"
}
export interface CreateNoteRequest {
    body: string;
}

export interface UpdateNoteBodyRequest {
    id: NoteId;
    body: string;
}

export interface CreateNoteAction {
    type: NOTE_ACTION.CREATE_NOTE,
    payload: Note
}

export interface DeleteNoteAction {
    type: NOTE_ACTION.DELETE_NOTE,
    payload: NoteId
}

export interface UpdateNoteAction {
    type: NOTE_ACTION.UPDATE_NOTE,
    payload: Note
}

export interface SearchNotesAction {
    type: NOTE_ACTION.SEARCH_NOTES,
    payload: Note[]
}

export interface GetNotesAction {
    type: NOTE_ACTION.GET_NOTES
    payload: Note[]
}

export interface GetNoteAction {
    type: NOTE_ACTION.GET_NOTE,
    payload: NoteId
}



