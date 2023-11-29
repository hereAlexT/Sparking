import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonSplitPane,
  isPlatform,
} from '@ionic/react';
import { useState } from 'react'
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/global.css'
import './App.css'

/* Import Components */
import MainTabs from './pages/MainTabs';
import Signup from './pages/Signup';
import Login from './pages/Login';
import TimeLine from './pages/Timeline';
import ComponentLab from './pages/ComponentLab'
import Settings from './pages/Settings';
import Menu from './components/Menu';
import Logout from './components/Logout';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { MetaProvider } from './contexts/MetaContext';

setupIonicReact();

const App: React.FC = () => {
  const [isSplitPaneOn, setIsSplitPaneOn] = useState<boolean>(false);
  console.log("isSplitPaneOn", isSplitPaneOn)

  return (
    <MetaProvider>
      < AuthProvider >
        <NotesProvider>
          <IonApp className='max-w-3xl mx-auto w-full app-background'>
            <IonReactRouter>
              <IonSplitPane onIonSplitPaneVisible={(event) => setIsSplitPaneOn(event.detail.visible)} contentId="main">
                <Menu />
                <Routes isSplitPaneOn={isSplitPaneOn} />
              </IonSplitPane>
            </IonReactRouter>
          </IonApp>
        </NotesProvider>
      </AuthProvider >
    </MetaProvider>)
};

interface RoutesProps {
  isSplitPaneOn: boolean;
}
const Routes: React.FC<RoutesProps> = ({isSplitPaneOn}) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <IonRouterOutlet id="main" animated={!isSplitPaneOn}>

      <Redirect exact path="/" to="/login" />
      <Route path="/signup" component={Signup} />
      <Route
        path="/login"
        component={isAuthenticated ? TimeLine : Login} />
      <Route
        path="/settings"
        component={isAuthenticated ? Settings : Login} />
      <Route
        path="/timeline"
        component={isAuthenticated ? TimeLine : Login}
      />
      <Route exact path="/logout" component={Logout} />
      <Route path="/comlab" component={ComponentLab} />
      <Route path="/tabs" render={() => <MainTabs />} />
    </IonRouterOutlet>
  );
};

export default App;
