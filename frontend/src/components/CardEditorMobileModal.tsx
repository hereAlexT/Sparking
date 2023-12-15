import { useAuth } from "../contexts/AuthContext";
import { Note, NOTE_STATUS } from "../shared/types";
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
  IonContent,
} from "@ionic/react";
import { arrowForwardOutline as arrowForwardOutlineIcon } from "ionicons/icons";
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface CardEditorMobileProps {
  onSubmit: (noteContent: Note) => void;
  note?: Note;
  isOnline?: boolean;
  trigger?: string;
  pageRef: React.RefObject<undefined>;
  isEditorOpen?: boolean;
  setIsEditorOpen?: (isOpen: boolean) => void;
}

declare global {
  interface WindowEventMap {
    ionKeyboardDidShow: CustomEvent;
    ionKeyboardDidHide: CustomEvent;
  }
}

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
  const { user } = useAuth();

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

  const [content, setContent] = useState(note?.body || "");

  const HandleOnSubmit = () => {
    if (!user) throw new Error("User is null");
    const newNote: Note = {
      id: note?.id || uuidv4(),
      body: content,
      createdAt: note?.createdAt || new Date(),
      updatedAt: new Date(),
      status: NOTE_STATUS.UNSYNCED,
      userId: user.id,
    };
    onSubmit(newNote);
    setContent("");
  };

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
