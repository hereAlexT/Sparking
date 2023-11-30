import React from "react";
import { Redirect, Route } from 'react-router-dom';
import {
    IonTabs,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,

} from '@ionic/react'

import { ellipse, square, triangle, cafe } from 'ionicons/icons';

import Signup from './Signup';
import Login from './Login';
import TimeLine from './Timeline';
import ComponentLab from './ComponentLab'

interface MainTabsProps { }

const MainTabs: React.FC<MainTabsProps> = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/tabs">
                    <Redirect to="/tabs/signup" />
                </Route>
                <Route
                    path="/tabs/signup"
                    render={() => <Signup />}
                    exact={true}/>
                <Route
                    path="/tabs/timeline/pri"
                    render={() => <TimeLine />}
                    exact={true}/>
                <Route 
                    path="/tabs/login"
                    render={() => <Login />}
                    exact={true}/>
                <Route
                    path="/tabs/comlab"
                    render={() => <ComponentLab />}
                    exact={true}/>

            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="signup" href="/tabs/signup">
                    <IonIcon aria-hidden="true" icon={triangle} />
                    <IonLabel>Signup</IonLabel>
                </IonTabButton>
                <IonTabButton tab="login" href="/tabs/login">
                    <IonIcon aria-hidden="true" icon={ellipse} />
                    <IonLabel>Login</IonLabel>
                </IonTabButton>
                <IonTabButton tab="timeline" href="/tabs/timeline/pri">
                    <IonIcon aria-hidden="true" icon={square} />
                    <IonLabel>Tab 3</IonLabel>
                </IonTabButton>
                <IonTabButton tab="ComLab" href="/tabs/comlab">
                    <IonIcon aria-hidden="true" icon={cafe} />
                    <IonLabel>ComLab</IonLabel>
                </IonTabButton>
            </IonTabBar>

        </IonTabs>
    )
}
export default MainTabs;