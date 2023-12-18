import NoteCardV2 from "../components/Note/NoteCardV2";
import CardEditorMobileModalV2 from "../components/NoteEditor/NoteEditorMobileModalV2";
import CardEditorV3 from "../components/NoteEditor/NoteEditorV3";
import { useAuth } from "../contexts/AuthContext";
import { useMeta } from "../contexts/MetaContext";
import { useNotes } from "../contexts/NotesContext";
import { Note, NoteId, NOTE_STATUS } from "../shared/types";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonSearchbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
} from "@ionic/react";
import { getPlatforms } from "@ionic/react";
import clsx from "clsx";
import {
  arrowUpOutline as arrowUpOutlineIcon,
  searchOutline as searchOutlineIcon,
} from "ionicons/icons";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const TimeLine: React.FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { notes, createNote, deleteNote, updateNote, getNotes } = useNotes();
  const { isOnline, isSplitPaneOn } = useMeta();
  const { isAuthenticated, user } = useAuth();
  const [filteredNotes, setFilteredNotes] = useState(notes);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter((note: Note) =>
        note.body.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  useEffect(() => {
    console.debug(getPlatforms());
    setIsLoading(true);
    getNotes().then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleOnCreateNote = async (note: Note) => {
    if (!user) throw new Error("User is null");
    try {
      await createNote({
        id: note.id || uuidv4(),
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        body: note.body,
        userId: user.id,
        images: note.images,
        status: NOTE_STATUS.UNSYNCED,
      });
    } catch (error) {
      console.log("error");
      console.log(error);
      alert((error as Error).message);
    }
  };

  const handleOnUpdateNote = async (note: Note) => {
    if (!user) throw new Error("User is null");

    try {
      await updateNote({
        id: note.id,
        body: note.body,
        createdAt: note.createdAt,
        updatedAt: new Date(),
        userId: user.id,
        status: NOTE_STATUS.UNSYNCED,
      });
    } catch (error) {
      console.log("error");
      console.log(error);
      alert((error as Error).message);
    }
  };

  const handleOnDeleteNote = async (noteId: NoteId) => {
    try {
      await deleteNote(noteId);
    } catch (error) {
      console.log("error");
      console.log(error);
      alert((error as Error).message);
    }
  };

  const handleOnEditNote = (noteId: NoteId) => {
    const foundNote = notes.find((n: Note) => n.id === noteId);
    setSelectedNote(foundNote || undefined);
    setIsEditorOpen(true);
  };

  const pageRef = useRef(undefined);

  //** Visibility of searchbar */

  const [isSearchBarVisible, setSearchBarVisible] = useState(false);

  return (
    <IonPage id="main" ref={pageRef}>
      {/** Small Screen */}
      {!isSplitPaneOn && (
        <>
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton id="open-mobile-editor-modal-timeline">
              <IonIcon icon={arrowUpOutlineIcon} className="text-white" />
            </IonFabButton>
            <CardEditorMobileModalV2
              trigger="open-mobile-editor-modal-timeline"
              onSubmit={handleOnCreateNote}
              pageRef={pageRef}
            />
          </IonFab>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>Sparking</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() => setSearchBarVisible(!isSearchBarVisible)}
                >
                  <IonIcon icon={searchOutlineIcon} />
                </IonButton>
              </IonButtons>
            </IonToolbar>

            {isSearchBarVisible && (
              <IonToolbar>
                <IonSearchbar
                  placeholder="Search"
                  showCancelButton="always"
                  onIonInput={(e) => setSearchQuery(e.detail.value!)}
                  onIonBlur={() => setSearchBarVisible(false)}
                  onIonCancel={() => setSearchBarVisible(false)}
                />
              </IonToolbar>
            )}
          </IonHeader>
        </>
      )}

      {/** Wide Screen */}
      {isSplitPaneOn && (
        <>
          <IonSearchbar
            className="mb-1 pb-1"
            placeholder="Search"
            onIonInput={(e) => setSearchQuery(e.detail.value!)}
          ></IonSearchbar>
          <IonCard
            className={clsx(
              "shadow-1xl my-1 rounded-xl border",
              "px-5 pb-1 pt-2 shadow-none  transition-colors duration-75 ease-in-out ",
              "border-neutral-200 bg-white hover:border-sky-600",
              " dark:border-indigo-600 dark:border-opacity-20 dark:bg-blue-950 dark:hover:border-indigo-400",
            )}
          >
            <CardEditorV3 onSubmit={handleOnCreateNote} isOnline={true} />
          </IonCard>
        </>
      )}

      {/** Shared */}
      <IonContent className="m5">
        <ul className="mt-2 list-none space-y-3">
          {isLoading ? (
            <li>Loading...</li>
          ) : (
            filteredNotes.map((note: Note) => (
              <li key={note.id} className="flex justify-center">
                <NoteCardV2
                  isOnline={isOnline}
                  note={note}
                  cardSetId="TimeLine"
                  onDeleteNote={handleOnDeleteNote}
                  onEditNote={handleOnEditNote}
                  className="mx-4"
                ></NoteCardV2>
              </li>
            ))
          )}
        </ul>
      </IonContent>
      <CardEditorMobileModalV2
        onSubmit={handleOnUpdateNote}
        pageRef={pageRef}
        setIsEditorOpen={setIsEditorOpen}
        isEditorOpen={isEditorOpen}
        note={selectedNote}
      />
    </IonPage>
  );
};

export default TimeLine;
