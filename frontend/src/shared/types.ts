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
    id: NoteImageId;
    createdAt: Date;
    noteId: NoteId;
    userId?: UserId;
    status: NOTE_IMAGE_STATUS;
    url: string; // add this line
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


export enum AUTH_ACTION {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    SIGNUP = "REGISTER"
}

export enum NOTE_ACTION {
    CREATE_NOTE = "CREATE_NOTE",
    DELETE_NOTE = "DELETE_NOTE",
    UPDATE_NOTE = "UPDATE_NOTE",
    GET_NOTES = "GET_NOTES",
    GET_NOTE = "GET_NOTE",
    SEARCH_NOTES = "SEARCH_NOTES"
}


export interface Action<T> {
    type: NOTE_ACTION,
    payload: T
}
