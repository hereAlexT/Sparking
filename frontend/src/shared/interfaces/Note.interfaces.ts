export type NoteId = string;

export interface Note {
    noteId: NoteId;
    createdDate: Date;
    body: string;
}