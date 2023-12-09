import {
    IonContent,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonItem,
    IonLabel,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonModal,
    IonButton,
    IonButtons,
    IonInput
} from "@ionic/react"

import {
    addOutline as addIcon,
    logInOutline as logInIcon,
    prismOutline as prismOutlineIcon,
    cogOutline as cogOutlineIcon,
    flaskOutline as flaskOutlineIcon,
    searchOutline as searchOutlineIcon,
} from 'ionicons/icons';
import { useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMeta } from "../contexts/MetaContext";



const routes = {
    appPages: [
        { title: 'Login', path: '/login', icon: logInIcon },
        { title: 'Signup', path: '/signup', icon: addIcon },
        { title: 'ComLab', path: '/comlab', icon: flaskOutlineIcon },

    ],
    loggedInPages: [
        // { title: 'Timeline', path: '/timeline/pri', icon: prismOutlineIcon },
        // { title: 'Logout', path: '/logout', icon: logInIcon },
        { title: 'Settings', path: '/settings', icon: cogOutlineIcon },
        { title: 'ComLab', path: '/comlab', icon: flaskOutlineIcon },
    ],
    loggedOutPages: [
        { title: 'Login', path: '/login', icon: logInIcon },
        { title: 'Signup', path: '/signup', icon: addIcon },
        { title: 'ComLab', path: '/comlab', icon: flaskOutlineIcon },
    ]
}

const doNotRenderInProduction = ['comlab']

interface Pages {
    title: string;
    path: string;
    icon: string;
    routerDirection?: string;
}

interface MenuProps {
}

const Menu: React.FC<MenuProps> = ({ }) => {
    const { isAuthenticated } = useAuth();
    const { isSplitPaneOn } = useMeta();
    const searchModal = useRef<HTMLIonModalElement>(null);

    function renderlistItems(list: Pages[]) {
        // Ensure only pages with a path are rendered
        return list
            .filter((route) => !!route.path && !(process.env.NODE_ENV === 'production' && doNotRenderInProduction.includes(route.title.toLowerCase())))
            .map((p) => (
                <IonMenuToggle key={p.title} autoHide={false}>
                    <IonItem routerLink={p.path} routerDirection="forward">
                        <IonIcon slot="start" icon={p.icon} />
                        <IonLabel>{p.title}</IonLabel>
                    </IonItem>
                </IonMenuToggle>
            ))
    }


    return (
        <IonMenu contentId="main">
            <IonHeader className="pt-14">
            </IonHeader>
            <IonContent>
                <IonList>
                </IonList>
                {isSplitPaneOn &&
                    <IonList>
                        <IonListHeader>Timeline</IonListHeader>
                        <IonMenuToggle key="timeline" autoHide={false}>
                            <IonItem routerLink="/timeline/pri" routerDirection="none">
                                <IonIcon slot="start" icon={prismOutlineIcon} />
                                <IonLabel>Timeline</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                    </IonList>}
                <IonList>
                    <IonListHeader>Account</IonListHeader>
                    {isAuthenticated ? renderlistItems(routes.loggedInPages) : renderlistItems(routes.appPages)}
                </IonList>
            </IonContent>


        </IonMenu>

    )
}


export default Menu;