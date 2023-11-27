import {
    IonContent,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonItem,
    IonLabel,
    IonIcon
} from "@ionic/react"

import {
    personOutline as personIcon,
    flaskOutline as flaskIcon,
    addOutline as addIcon,
    logInOutline as logInIcon,
    logOutOutline as logOutIcon,
    prismOutline as prismOutlineIcon,
} from 'ionicons/icons';
import { useAuth } from "../contexts/AuthContext";


const routes = {
    appPages: [
        { title: 'Login', path: '/login', icon: logInIcon },
        { title: 'Signup', path: '/signup', icon: addIcon },
    ],
    loggedInPages: [
        { title: 'Timeline', path: '/timeline', icon: prismOutlineIcon },
        { title: 'Logout', path: '/logout', icon: logInIcon },
    ],
    loggedOutPages: [
        { title: 'Login', path: '/login', icon: logInIcon },
        { title: 'Signup', path: '/signup', icon: logInIcon },
    ]
}

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

    function renderlistItems(list: Pages[]) {
        // Ensure only pages with a path are rendered
        return list
            .filter((route) => !!route.path)
            .map((p) => (
                <IonMenuToggle key={p.title} autoHide={false}>
                    <IonItem routerLink={p.path} routerDirection="none">
                        <IonIcon slot="start" icon={p.icon} />
                        <IonLabel>{p.title}</IonLabel>
                    </IonItem>
                </IonMenuToggle>
            ))

    }
    return (
        <IonMenu contentId="main">
            <IonContent>
                <IonList>
                    <IonListHeader>Account</IonListHeader>
                    {isAuthenticated ? renderlistItems(routes.loggedInPages) :renderlistItems(routes.appPages)}
                </IonList>
                {/* <IonList>
                    <IonListHeader>Account</IonListHeader>
                    {renderlistItems(routes.loggedInPages)}
                </IonList> */}
                {/* <IonList>
                    <IonListHeader>Account</IonListHeader>
                    {renderlistItems(routes.loggedOutPages)}
                </IonList> */}
            </IonContent>


        </IonMenu>

    )
}


export default Menu;