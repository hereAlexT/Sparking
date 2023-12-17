import { SubmitButton } from ".";
import { useAuth } from "../../contexts/AuthContext";
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
import { Camera, CameraResultType } from "@capacitor/camera";
import { IonButton, IonIcon } from "@ionic/react";
import {
  arrowForwardOutline as arrowForwardOutlineIcon,
  imageOutline as imageOutlineIcon,
  cameraOutline as cameraOutlineIcon,
  closeOutline as closeOutlineIcon,
} from "ionicons/icons";
import { useMemo, useEffect } from "react";
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
    console.log("handle on submit");
    console.log("content", content);
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
    } as EasyMDE.Options;
  }, []);

  /** When press shift + enter, it should submit the message */
  const HandleOnSubmitRef = useRef<() => void>();
  HandleOnSubmitRef.current = HandleOnSubmit;
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && event.shiftKey) {
        console.log("Yes shift + enter");
        HandleOnSubmitRef.current && HandleOnSubmitRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array so the effect only runs once when the component mounts

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
    { name: "Heading", action: "toggleHeadingSmaller", icon: <Heading /> },
    { name: "Quote", action: "toggleBlockquote", icon: <Quote /> },
  ];

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 col-start-1 ">
        <SparkMde
          ref={sparkMdeRef}
          onChange={(e) => setContent(e)}
          value={content}
        />
      </div>

      <div className="col-span-12 col-start-1">
        <div className="grid w-full grid-cols-3 gap-1">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                alt={`Image ${index}`}
                src={image.url}
                className="h-32 w-full object-cover"
              />
              <button
                className="circular-button absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white"
                onClick={() => handleDeleteImage(index)}
              >
                <IonIcon
                  color="dark"
                  className="m-0 p-0"
                  size="small"
                  slot="icon-only"
                  icon={closeOutlineIcon}
                />
              </button>

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
