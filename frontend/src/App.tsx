import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonSplitPane,
  isPlatform,
} from '@ionic/react';
import { useState, useEffect } from 'react'
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useLocation } from 'react-router-dom';

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
import { MetaProvider, useMeta } from './contexts/MetaContext';

setupIonicReact();

const App: React.FC = () => {
  return (
    <MetaProvider>
      < AuthProvider >
        <NotesProvider>
          <IonApp className=' app-background'>
            <IonReactRouter>
              <AppContent />
            </IonReactRouter>
          </IonApp>
        </NotesProvider>
      </AuthProvider >
    </MetaProvider>)
};

const AppContent: React.FC = () => {
  const { isSplitPaneOn, setIsSplitPaneOn } = useMeta();
  const location = useLocation();
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    setKey(Date.now());
  }, [location.pathname]);

  console.log("isSplitPaneOn", isSplitPaneOn)

  const isLoginOrSignup = location.pathname === '/login' || location.pathname === '/signup';


  return (
    <IonSplitPane key={key} className={`${isLoginOrSignup ? 'max-w-md' : 'max-w-3xl'} mx-auto`} onIonSplitPaneVisible={(event) => setIsSplitPaneOn(event.detail.visible)} contentId="main">
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Menu />}
      <Routes />
    </IonSplitPane>
  );
};




/**
 * /timeline/pri -> private timeline
 * /timeline/pub -> public timeline
 * /timeline/wor -> workspace timeline
 */
const Routes: React.FC = ({ }) => {
  const { isAuthenticated, logout } = useAuth();
  const { isSplitPaneOn } = useMeta();

  return (
    <IonRouterOutlet id="main" animated={!isSplitPaneOn}>

      <Redirect exact path="/" to="/login" />
      <Redirect exact path="/timeline" to="/timeline/pri" />
      <Route
        exact
        path="/signup"
        component={Signup}
      />
      <Route
        exact
        path="/login"
        component={isAuthenticated ? TimeLine : Login} />
      <Route
        exact
        path="/settings"
        component={isAuthenticated ? Settings : Login} />
      <Route
        exact
        path="/timeline/pri"
        component={isAuthenticated ? TimeLine : Login}
      />
      <Route exact path="/logout" component={Logout} />
      <Route path="/comlab" component={ComponentLab} />
      <Route path="/tabs" render={() => <MainTabs />} />
    </IonRouterOutlet>
  );
};

export default App;
