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
    userId: UserId;
    status: NOTE_IMAGE_STATUS;
    url: string; // add this line
}

export interface Note {
    id: NoteId;
    body: string;
    // createdAt should be assigned locally.
    createdAt: Date;
    // updatedAt should be assigned locally.
    updatedAt: Date;
    userId: UserId;
    images?: NoteImage[];
    status: NOTE_STATUS;
}



export enum AUTH_ACTION {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    SIGNUP = "REGISTER"
}

export enum THEME_TYPE {
    DARK = "DARK",
    LIGHT = "LIGHT",
    SYSTEM = "SYSTEM"
}