import { useAuth } from "../contexts/AuthContext";
import { useMeta } from "../contexts/MetaContext";
import { useNotes } from "../contexts/NotesContext";
import { THEME_TYPE } from "../shared/types";
import { buildIndex } from "../shared/utils/tagUtil";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonToggle,
  IonToolbar,
  IonTitle,
  IonPage,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import {
  mailOutline as mailOutLineIcon,
  logOutOutline as logOutOutlineIcon,
  hammerOutline as hammerOutlineIcon,
  moonOutline as moonOutlineIcon,
  pulseOutline as pulseOutlineIcon,
} from "ionicons/icons";
import React, { ReactNode } from "react";

interface StyledIonListProps {
  inset?: boolean;
  customClass?: string;
  children?: ReactNode;
}

const StyledIonList: React.FC<StyledIonListProps> = ({
  children,
  inset,
  customClass,
}) => (
  <IonList inset={inset} className={`rounded-none border-b ${customClass}`}>
    {children}
  </IonList>
);

const Settings: React.FC = () => {
  console.log("Settings.tsx: Settings");
  const { user } = useAuth();
  const { notes } = useNotes();
  const { isSplitPaneOn, theme, setTheme } = useMeta();
  const { tagTree, setTagTree } = useNotes();

  return (
    <IonPage id="main">
      <IonHeader>
        {!isSplitPaneOn ? (
          <IonToolbar>
            <IonTitle>Settings</IonTitle>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/timeline/pri"></IonBackButton>
            </IonButtons>
          </IonToolbar>
        ) : (
          <div className="mt-5" />
        )}
      </IonHeader>

      <IonContent>
        <StyledIonList inset={true}>
          <IonItem>
            <IonIcon aria-hidden="true" icon={mailOutLineIcon} slot="start" />
            <IonLabel>Email</IonLabel>
            <IonLabel>{user?.email}</IonLabel>
          </IonItem>
        </StyledIonList>

        <StyledIonList inset={true}>
          <IonItem>
            <IonToggle disabled={true}>
              <IonLabel>Location Service (Developing)</IonLabel>
              <IonNote color="medium">
                Add your location data to every note.
              </IonNote>
            </IonToggle>
          </IonItem>
          <IonItem
            button={true}
            onClick={() => {
              setTagTree(buildIndex(notes));
            }}
          >
            <IonIcon aria-hidden="true" icon={pulseOutlineIcon} slot="start" />
            <IonLabel> Re-index </IonLabel>
          </IonItem>
        </StyledIonList>

        <StyledIonList inset={true}>
          <IonItem>
            <IonIcon aria-hidden="true" icon={moonOutlineIcon} slot="start" />
            <IonSelect
              label="Color Scheme"
              placeholder={
                theme.charAt(0).toUpperCase() + theme.slice(1).toLowerCase()
              }
              interface="popover"
              onIonChange={(e) => setTheme(e.detail.value)}
            >
              {Object.values(THEME_TYPE).map((type) => (
                <IonSelectOption value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </StyledIonList>

        <StyledIonList inset={true}>
          <IonItem routerLink="/logout" routerDirection="none">
            <IonIcon
              color="danger"
              areia-hidden={true}
              icon={logOutOutlineIcon}
              slot="start"
            ></IonIcon>
            <IonLabel color="danger">Logout</IonLabel>
          </IonItem>
        </StyledIonList>

        <StyledIonList inset={true}>
          <IonItem routerLink="/comlab" routerDirection="none">
            <IonIcon
              color=""
              areia-hidden={true}
              icon={hammerOutlineIcon}
              slot="start"
            ></IonIcon>
            <IonLabel color="">Developer Tool</IonLabel>
          </IonItem>
        </StyledIonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
