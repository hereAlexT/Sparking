import { useAuth } from "../../contexts/AuthContext";
import { useMeta } from "../../contexts/MetaContext";
import TagTreeView from "../TagTreeView";
import MenuItem from "./MenuItem";
import {
  IonContent,
  IonMenu,
  IonMenuToggle,
  IonItem,
  IonLabel,
  IonIcon,
  IonHeader,
} from "@ionic/react";
import {
  addOutline as addIcon,
  logInOutline as logInIcon,
  logOutOutline as logOutIcon,
  prismOutline as prismOutlineIcon,
  cogOutline as cogOutlineIcon,
  flaskOutline as flaskOutlineIcon,
  searchOutline as searchOutlineIcon,
} from "ionicons/icons";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const routes = {
  appPages: [
    { title: "Login", path: "/login", icon: logInIcon },
    { title: "Signup", path: "/signup", icon: addIcon },
    { title: "ComLab", path: "/comlab", icon: flaskOutlineIcon },
  ],
  loggedInPages: [
    // { title: 'Timeline', path: '/timeline/pri', icon: prismOutlineIcon },
    // { title: 'Logout', path: '/logout', icon: logInIcon },
    { title: "Settings", path: "/settings", icon: cogOutlineIcon },
    { title: "ComLab", path: "/comlab", icon: flaskOutlineIcon },
  ],
  loggedOutPages: [
    { title: "Login", path: "/login", icon: logInIcon },
    { title: "Signup", path: "/signup", icon: addIcon },
    { title: "ComLab", path: "/comlab", icon: flaskOutlineIcon },
  ],
};

const doNotRenderInProduction = ["comlab"];

interface Pages {
  title: string;
  path: string;
  icon: string;
  routerDirection?: string;
}

interface MenuProps {}

const Menu: React.FC<MenuProps> = ({}) => {
  const { isAuthenticated, user } = useAuth();
  const { isSplitPaneOn } = useMeta();
  const searchModal = useRef<HTMLIonModalElement>(null);
  const location = useLocation();
  const currentPath = location.pathname;

  function renderlistItems(list: Pages[]) {
    // Ensure only pages with a path are rendered
    return list
      .filter(
        (route) =>
          !!route.path &&
          !(
            process.env.NODE_ENV === "production" &&
            doNotRenderInProduction.includes(route.title.toLowerCase())
          ),
      )
      .map((p) => (
        <IonMenuToggle key={p.title} autoHide={false}>
          <IonItem routerLink={p.path} routerDirection="forward">
            <IonIcon slot="start" icon={p.icon} />
            <IonLabel>{p.title}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  return (
    <IonMenu contentId="main" className="border-r-2">
      <IonHeader className="pt-14"></IonHeader>
      <IonContent>
        <ul className="text list-none space-y-1 px-4 py-2">
          <li>
            <MenuItem
              active={currentPath.includes("/timeline")}
              to="/timeline/pri"
              label="Timeline"
              icon={prismOutlineIcon}
            />
          </li>
          {/* <li>
              <MenuItem
                active={currentPath.includes("/comlab")}
                to="/comlab"
                label="Developer Tool"
                icon={flaskOutlineIcon}
              />
            </li>
            <li>
              <MenuItem
                to="/logout"
                label="Logout"
                icon={logOutIcon}
                active={false}
              />
            </li> */}
        </ul>
        <TagTreeView />
      </IonContent>
      <div className="mb-5 border-t px-4 py-2">
        <MenuItem
          to="/settings"
          label="Alex Teng"
          icon={cogOutlineIcon}
          active={false}
        ></MenuItem>
      </div>
    </IonMenu>
  );
};

export default Menu;
