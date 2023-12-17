import { SubmitButton } from ".";
import { useAuth } from "../../contexts/AuthContext";
import {
  Note,
  NoteImage,
  NOTE_IMAGE_STATUS,
  NOTE_STATUS,
  NoteId,
} from "../../shared/types";
import { SparkMde } from "./Mde";
import { Camera, CameraResultType, Photo } from "@capacitor/camera";
import { IonButton, IonTextarea, IonIcon } from "@ionic/react";
import SimpleMDE, { Options } from "easymde";
import {
  arrowForwardOutline as arrowForwardOutlineIcon,
  imageOutline as imageOutlineIcon,
  cameraOutline as cameraOutlineIcon,
  closeOutline as closeOutlineIcon,
} from "ionicons/icons";
import { useMemo } from "react";
import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

interface CardEditorV2Props {
  onSubmit: (noteContent: Note) => void;
  note?: Note;
  isOnline?: boolean;
}

const CardEditorV2: React.FC<CardEditorV2Props> = ({
  onSubmit,
  note,
  isOnline = true,
}) => {
  const _noteid = note?.id || uuidv4();
  const [content, setContent] = useState("");
  const { user, isMember } = useAuth();

  const HandleOnSubmit = () => {
    if (content === "") return;
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
    onSubmit(newNote);
    setContent("");
    setImages([]);
  };

  const handleImageButtonClick = async () => {
    const _images = await Camera.pickImages({
      quality: 90,
    });

    _images.photos.forEach((image) => {
      if (image.webPath) {
        if (!user) throw new Error("User is null");
        const newImage: NoteImage = {
          createdAt: new Date(),
          id: uuidv4(),
          url: image.webPath,
          noteId: _noteid,
          userId: user.id,
          status: NOTE_IMAGE_STATUS.UNSYNCED,
        };
        setImages((prevImages) => [...prevImages, newImage]);
      }
    });
  };

  const handleCameraButtonClick = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    if (image.webPath) {
      if (!user) throw new Error("User is null");
      const newImage: NoteImage = {
        createdAt: new Date(),
        id: uuidv4(),
        url: image.webPath,
        noteId: _noteid,
        userId: user?.id,
        status: NOTE_IMAGE_STATUS.UNSYNCED,
      };
      setImages((prevImages) => [...prevImages, newImage]);
    }
  };

  const [images, setImages] = useState<NoteImage[]>([]);

  function handleDeleteImage(index: number) {
    setImages((images) => images.filter((_, i) => i !== index));
  }

  /** Markdown Editor */
  const MdeOptions = useMemo(() => {
    return {
      minHeight: "50px",
      spellChecker: false,
      lineNumbers: false,
    } as SimpleMDE.Options;
  }, []);

  const sparkMdeRef = useRef();

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 col-start-1 ">
        {/* <IonTextarea
          className="native-textarea-p0-m0 border-b border-slate-400 px-1 pt-1 font-poppins text-black dark:text-white"
          disabled={!isOnline}
          value={isOnline ? content : "We are working on offline editing!"}
          onIonInput={(event: CustomEvent) => setContent(event.detail.value)}
          rows={0}
          autoGrow={true}
          color="primary"
          placeholder="You got a good idea💡, what's that?"
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              HandleOnSubmit();
            }
          }}
        /> */}
        <SparkMde ref={sparkMdeRef} />
      </div>
      <button
        onClick={() => {
          sparkMdeRef.current.toggleBold();
        }}
      >
        Bold
      </button>
      <button
        onClick={() => {
          sparkMdeRef.current.toggleBold();
        }}
      >
        Italic
      </button>

      <div className="col-span-12 col-start-1">
        <div className="grid w-full grid-cols-3 gap-1">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                alt={`Image ${index}`}
                src={image.url}
                className="h-32 w-full object-cover"
              />
              {/* <button
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 circular-button"
                            onClick={() => handleDeleteImage(index)}
                        >
                            <IonIcon color="dark" className="m-0 p-0" size="small" slot="icon-only" icon={closeOutlineIcon} />
                        </button> */}

              <IonButton
                color="light"
                size="small"
                fill="outline"
                onClick={() => handleDeleteImage(index)}
                className="circular-button absolute right-0  top-0 rounded-full p-1 text-white"
              >
                <IonIcon
                  color="light"
                  className="m-0 p-0"
                  size="small"
                  slot="icon-only"
                  icon={closeOutlineIcon}
                />
              </IonButton>
            </div>
          ))}
        </div>
      </div>

      {isMember && (
        <>
          <div className="col-span-1">
            <IonButton
              color="primary"
              size="small"
              fill="clear"
              onClick={handleCameraButtonClick}
              className="circular-button"
            >
              <IonIcon
                className="dark:white m-0 p-0 text-black"
                size="small"
                slot="icon-only"
                icon={cameraOutlineIcon}
              />
            </IonButton>
          </div>
          <div className="col-span-1">
            <IonButton
              color="primary"
              size="small"
              fill="clear"
              onClick={handleImageButtonClick}
              className="circular-button"
            >
              <IonIcon
                color="dark"
                className="m-0 p-0"
                size="small"
                slot="icon-only"
                icon={imageOutlineIcon}
              />
            </IonButton>
          </div>
        </>
      )}

      <div className="col-span-1 col-start-12 my-1 flex justify-end">
        <SubmitButton
          disabled={!isOnline || content.length === 0}
          onClick={HandleOnSubmit}
        >
          <IonIcon
            className="m-0 p-0 text-white dark:text-black"
            size="small"
            slot="icon-only"
            icon={arrowForwardOutlineIcon}
          />
        </SubmitButton>
      </div>
    </div>
  );
};

export default CardEditorV2;
