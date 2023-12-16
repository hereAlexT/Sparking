import { useAuth } from "../../contexts/AuthContext";
import { useNotes } from "../../contexts/NotesContext";
import { Note, NOTE_STATUS } from "../../shared/types";
import { NoteImage } from "../../shared/types";
import {
  IonButton,
  IonCol,
  IonRow,
  IonGrid,
  IonTextarea,
  IonIcon,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonModal,
  IonFooter,
} from "@ionic/react";
import { arrowForwardOutline as arrowForwardOutlineIcon } from "ionicons/icons";
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface CardEditorMobileProps {
  onSubmit: (noteContent: Note) => void;
  /**
   * If note is passed, enter note updating mode, otherwise enter not creating mode.
   */
  note?: Note;
  isOnline?: boolean;
  trigger?: string;
  pageRef: React.RefObject<undefined>;
  isEditorOpen?: boolean;
  setIsEditorOpen?: (isOpen: boolean) => void;
}

/** On Mobie, the foot bar should always on top of the keyboard. */
declare global {
  interface WindowEventMap {
    ionKeyboardDidShow: CustomEvent;
    ionKeyboardDidHide: CustomEvent;
  }
}

/** Modal Setup */
const CardEditorMobileModal: React.FC<CardEditorMobileProps> = ({
  isEditorOpen,
  setIsEditorOpen,
  pageRef,
  trigger,
  onSubmit,
  note,
  isOnline = true,
}) => {
  const [presentingElement, setPresentingElement] = useState<
    HTMLElement | undefined
  >(undefined);

  useEffect(() => {
    setPresentingElement(pageRef.current!);
  }, []);

  useEffect(() => {
    setContent(note?.body || "");
  }, [note]);

  function dismiss() {
    modalRef.current?.dismiss();
    setIsEditorOpen?.(false);
  }

  const footerRef = useRef<HTMLIonFooterElement>(null);
  const modalRef = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    const handleKeyboardShow = (ev: CustomEvent) => {
      const { keyboardHeight } = ev.detail;
      if (footerRef.current) {
        footerRef.current.style.setProperty(
          "transform",
          `translate3d(0, -${keyboardHeight}px, 0)`,
        );
      }
    };

    const handleKeyboardHide = () => {
      if (footerRef.current) {
        footerRef.current.style.removeProperty("transform");
      }
    };

    window.addEventListener("ionKeyboardDidShow", handleKeyboardShow);
    window.addEventListener("ionKeyboardDidHide", handleKeyboardHide);

    return () => {
      window.removeEventListener("ionKeyboardDidShow", handleKeyboardShow);
      window.removeEventListener("ionKeyboardDidHide", handleKeyboardHide);
    };
  }, []);

  /** Create / update note */

  const { user } = useAuth();
  const { createNote, updateNote } = useNotes();
  const _noteid = note?.id || uuidv4();
  const [content, setContent] = useState(note?.body || "");
  const mode = note ? "UPDATE" : "CREATE";
  const [images, setImages] = useState<NoteImage[]>([]);

  const HandleOnSubmit = () => {
    if (!user) throw new Error("User is null, you need to login.");
    const newNote: Note = {
      id: _noteid,
      body: content,
      createdAt: note?.createdAt || new Date(),
      updatedAt: new Date(),
      images: images,
      status: NOTE_STATUS.UNSYNCED,
      userId: user.id,
    };
    if (mode === "CREATE") {
      createNote(newNote);
    } else {
      updateNote(newNote);
    }
    setContent("");
    dismiss();
  };

  return (
    <IonModal
      ref={modalRef}
      trigger={trigger}
      presentingElement={presentingElement}
      isOpen={isEditorOpen}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Modal</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                dismiss();
              }}
            >
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonGrid class="ion-no-padding" className="m-0 p-0">
        <IonRow className="h-full">
          <IonCol>
            <IonTextarea
              className="native-textarea-p0-m0 h-full border-slate-400 px-1 pt-1 font-poppins font-light text-black"
              disabled={!isOnline}
              value={isOnline ? content : "We are working on offline editing!"}
              onIonInput={(event: CustomEvent) =>
                setContent(event.detail.value)
              }
              rows={0}
              autoGrow={true}
              color="primary"
              placeholder="You got a good idea💡, what's that?"
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonFooter ref={footerRef}>
        <IonToolbar>
          <IonGrid class="ion-no-padding">
            <IonRow>
              <IonCol size="11" className="" />
              <IonCol size="1" className="">
                <IonButton
                  disabled={!isOnline || content.length === 0}
                  color="primary"
                  size="small"
                  fill="solid"
                  onClick={HandleOnSubmit}
                  className="circular-button"
                >
                  <IonIcon
                    color="light"
                    className="m-0 p-0"
                    size="small"
                    slot="icon-only"
                    icon={arrowForwardOutlineIcon}
                  ></IonIcon>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default CardEditorMobileModal;
