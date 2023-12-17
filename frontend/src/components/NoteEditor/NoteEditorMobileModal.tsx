import { SubmitButton } from ".";
import { useAuth } from "../../contexts/AuthContext";
import { useNotes } from "../../contexts/NotesContext";
import {
  Note,
  NoteImage,
  NOTE_IMAGE_STATUS,
  NOTE_STATUS,
  NoteId,
} from "../../shared/types";
import {
  Bold,
  BulletList,
  Heading,
  Italic,
  Link,
  NumberedList,
  Quote,
} from "../Icons";
import EditorButton from "./EditorButton";
import { SparkMde } from "./Mde";
import "./NoteEditorMobileModal.css";
import { Camera, CameraResultType } from "@capacitor/camera";
import {
  IonButton,
  IonIcon,
  IonModal,
  IonToolbar,
  IonFooter,
  IonCol,
  IonGrid,
  IonHeader,
  IonButtons,
  IonRow,
  IonContent,
} from "@ionic/react";
import {
  arrowForwardOutline as arrowForwardOutlineIcon,
  imageOutline as imageOutlineIcon,
  cameraOutline as cameraOutlineIcon,
  closeOutline as closeOutlineIcon,
  arrowUpOutline as arrowUpOutlineIcon,
} from "ionicons/icons";
import { useMemo, useEffect } from "react";
import React, { useState, useRef } from "react";
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

  /** Editor Buttons */
  const sparkMdeRef = useRef();
  const buttonData = [
    { name: "Bold", action: "toggleBold", icon: <Bold /> },
    { name: "Italic", action: "toggleItalic", icon: <Italic /> },
    { name: "BulletList", action: "toggleUnorderedList", icon: <BulletList /> },
    {
      name: "NumberedList",
      action: "toggleOrderedList",
      icon: <NumberedList />,
    },
    { name: "Link", action: "drawLink", icon: <Link /> },
    { name: "Heading", action: "toggleHeading1", icon: <Heading /> },
    { name: "Quote", action: "toggleBlockquote", icon: <Quote /> },
  ];

  const contentRef = useRef<HTMLIonContentElement>(null);

  return (
    <IonModal
      ref={modalRef}
      trigger={trigger}
      presentingElement={presentingElement}
      isOpen={isEditorOpen}
    >
      <IonHeader>
        <IonToolbar>
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
      <IonContent ref={contentRef}>
        <div className="noteEditorMobileModal">
          <SparkMde
            ref={sparkMdeRef}
            onChange={(e) => setContent(e)}
            value={content}
            minHeight="800px"
          />
        </div>
      </IonContent>
      <IonFooter ref={footerRef}>
        <IonToolbar>
          <div className="flex justify-between">
            <div className="flex gap-x-2">
              {buttonData.map((button, index) => (
                <div className="col-span-1" key={index}>
                  <EditorButton
                    onClick={() => {
                      (sparkMdeRef.current as any)[button.action]();
                    }}
                  >
                    {button.icon}
                  </EditorButton>
                </div>
              ))}
            </div>
            <SubmitButton
              disabled={!isOnline || content.length === 0}
              onClick={HandleOnSubmit}
            >
              <IonIcon
                color="light"
                className="m-0 p-0"
                size="small"
                slot="icon-only"
                icon={arrowUpOutlineIcon}
              />
            </SubmitButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default CardEditorMobileModal;
