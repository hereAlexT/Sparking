import "./App.css";
import Logout from "./components/Logout";
import Menu from "./components/Menu";
import { GA_MEASUREMENT_ID } from "./config";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { MetaProvider, useMeta } from "./contexts/MetaContext";
import { NotesProvider } from "./contexts/NotesContext";
import ComponentLab from "./pages/ComponentLab";
import Login from "./pages/Login";

/* Import Components */
import MainTabs from "./pages/MainTabs";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import TimeLine from "./pages/Timeline";
import UpdatePassword from "./pages/UpdatePassword";
import "./theme/global.css";

/* Theme variables */
import "./theme/variables.css";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonSplitPane,
  isPlatform,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import { useState, useEffect } from "react";
import ReactGA from "react-ga4";
import { Redirect, Route, useLocation, useHistory } from "react-router-dom";

/** Ionic Init */
setupIonicReact();

const App: React.FC = () => {
  return (
    <MetaProvider>
      <AuthProvider>
        <NotesProvider>
          <IonApp className=" app-background">
            <IonReactRouter>
              <AppContent />
            </IonReactRouter>
          </IonApp>
        </NotesProvider>
      </AuthProvider>
    </MetaProvider>
  );
};

/** Google Analytics Init */
ReactGA.initialize(GA_MEASUREMENT_ID);

const AppContent: React.FC = () => {
  const { isSplitPaneOn, setIsSplitPaneOn } = useMeta();
  const location = useLocation();
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    setKey(Date.now());
  }, [location.pathname]);

  const isLoginOrSignup =
    location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
    // console.log("GA: ", location.pathname + location.search)
  }, [location]);

  return (
    <IonSplitPane
      key={key}
      className={`${isLoginOrSignup ? "max-w-md" : "max-w-3xl"} mx-auto`}
      onIonSplitPaneVisible={(event) => setIsSplitPaneOn(event.detail.visible)}
      contentId="main"
    >
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Menu />
      )}
      <Routes />
    </IonSplitPane>
  );
};

/**
 * /timeline/pri -> private timeline
 * /timeline/pub -> public timeline
 * /timeline/wor -> workspace timeline
 */
const Routes: React.FC = ({}) => {
  const { isAuthenticated, logout } = useAuth();
  const { isSplitPaneOn } = useMeta();
  const history = useHistory();
  useEffect(() => {
    const pathname = history.location.pathname;
    if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
      history.push("/timeline/pri");
    }

    if (
      !isAuthenticated &&
      (pathname === "/login" ||
        pathname === "/settings" ||
        pathname === "/comlab" ||
        pathname === "/timeline" ||
        pathname === "/timeline/pri")
    ) {
      history.push("/login");
    }
  }, [isAuthenticated, history]);

  return (
    <IonRouterOutlet id="main" animated={!isSplitPaneOn}>
      <Redirect exact path="/" to="/login" />
      <Redirect exact path="/timeline" to="/timeline/pri" />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/timeline/pri" component={TimeLine} />
      <Route exact path="/logout" component={Logout} />
      <Route path="/comlab" component={ComponentLab} />
      <Route path="/tabs" render={() => <MainTabs />} />
      <Route path="/account/update-password" component={UpdatePassword} />
    </IonRouterOutlet>
  );
};

export default App;
