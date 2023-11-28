import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonSplitPane
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';



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
import './App.css'

/* Import Components */
import MainTabs from './pages/MainTabs';
import Signup from './pages/Signup';
import Login from './pages/Login';
import TimeLine from './pages/Timeline';
import ComponentLab from './pages/ComponentLab'
import Menu from './components/Menu';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { MetaProvider } from './contexts/MetaContext';

setupIonicReact();

const App: React.FC = () => {
  const { logout } = useAuth();
  return (
    <MetaProvider>
      < AuthProvider >
        <NotesProvider>
          <IonApp className='max-w-3xl mx-auto w-full app-background'>
            {/* <IonApp className=''> */}
            <IonReactRouter>
              <IonSplitPane contentId="main">
                <Menu />
                <Routes />
              </IonSplitPane>
            </IonReactRouter>
          </IonApp>
        </NotesProvider>
      </AuthProvider >
    </MetaProvider>)
};

const Routes: React.FC = () => {
  const { logout } = useAuth();

  return (
    <IonRouterOutlet id="main">
      <Route path="/" component={Login} exact={true} />
      <Route path="/tabs" render={() => <MainTabs />} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/timeline" component={TimeLine} />
      <Route path="/comlab" component={ComponentLab} />
      <Route exact path="/logout" render={() => {
        console.log('Logout route hit');
        console.log('Logout function:', logout);
        logout();
        return <Redirect to="/login" />
      }} />
    </IonRouterOutlet>
  );
};

export default App;
