import {
    IonContent,
    IonHeader,
    IonInput,
    IonPage,
    IonText,
    IonToolbar,
    IonButton,
    IonGrid,
    IonCol,
    IonRow,
    IonAlert,
    IonButtons,
    IonMenuButton
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router';
import { useMeta } from '../contexts/MetaContext';

const Login: React.FC = () => {
    const history = useHistory();
    const [email, setEmail] = useState("demo@linklabs.app");
    const [password, setPassword] = useState("Password1@");
    const [isLoginFailed, setLoginFailed] = useState(false);

    const { login, isAuthenticated, session, user } = useAuth();
    const { isOnline } = useMeta();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Login handleSubmit: isAuthenticated = ", isAuthenticated)
        if (email && password) {
            try {
                await login(email, password);
                console.log("try to history.push")
                history.push('/timeline', { direction: 'none' });
                console.log("push done")
            } catch (error) {
                alert("Login failed: \n " + error)
                console.error(error);
            }
        }
    }

    // useEffect(() => {
    //     console.log("Login useEffect: isAuthenticated = ", isAuthenticated)
    //     if (isAuthenticated) {
    //         history.push("/timeline", {direction: 'none'});
    //     }
    // }, [isAuthenticated, history]);


    /* Email Address Validation 
    * You don't want to show validation while the user is typing.
    * Validation should only occur when the user finishes typing.
    */
    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState<boolean>();
    const validateEmail = (email: string) => {
        return email.match(
            /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        );
    };

    const validate = (ev: CustomEvent) => {
        console.log("hhh")
        const v = ev.detail.value ?? '';
        if (v === '') {
            setIsValid(true);
        } else {
            const value = (ev.target as HTMLInputElement).value;
            setIsValid(undefined);
            if (value === '') return;
            validateEmail(value) !== null ? setIsValid(true) : setIsValid(false);
        }
    };

    const markTouched = () => {
        setIsTouched(true);
    };
    /* Email Validation Done */

    return (
        <IonPage id="main">
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonGrid className='ion-padding'>
                    <form onSubmit={handleSubmit}>
                        <IonRow>
                            <IonCol>
                                <IonText>
                                    <h1 className='text-3xl font-semibold'>Welcome to Snow Yeti.</h1>
                                </IonText>
                            </IonCol>
                        </IonRow>
                        <IonRow className='mt-8'>
                            <IonCol>
                                <IonInput
                                    className={`${isValid && 'ion-valid'} ${isValid === false && 'ion-invalid'} ${isTouched && 'ion-touched'}`}
                                    type="email"
                                    fill="solid"
                                    label="Email"
                                    labelPlacement="floating"
                                    errorText="Invalid email"
                                    // onIonInput={(event) => validate(event)}
                                    onIonBlur={() => markTouched()}
                                    value={email}
                                    onIonChange={(e) => setEmail(e.detail.value ?? '')}
                                ></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonInput
                                    type="password"
                                    fill="solid"
                                    label="Password"
                                    labelPlacement="floating"
                                    errorText='Invalid password'
                                    counter={true}
                                    maxlength={32}
                                    minlength={8}
                                    value={password}
                                    onIonChange={(e) => setPassword(e.detail.value ?? '')}
                                ></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonButton
                                    disabled={!isOnline}
                                    color="primary"
                                    type="submit"
                                    expand="block"
                                    className='rounded-full'
                                >
                                    {isOnline ? "Login" : "Cannot login: You are Offline"}
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </form>

                    <IonRow>
                        <IonCol>
                            <IonButton
                                disabled={true}
                                color="primary"
                                fill="outline"
                                expand="block"
                            >
                                {isOnline ? "Login with Google (developing)" : "Cannot login: You are Offline"}
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonRow>
                            <IonCol>
                                <IonText color="medium">
                                    <a>Forgot password?</a>
                                </IonText>
                            </IonCol>
                        </IonRow>
                    </IonRow>
                </IonGrid>
                <IonAlert
                    isOpen={isLoginFailed}
                    header="Login Failed"
                    // subHeader="Wrong Username or password"
                    message="We don't recognize you, try again or create a new account?"
                    buttons={['Action']}
                    onDidDismiss={() => setLoginFailed(false)}
                ></IonAlert>
            </IonContent>
        </IonPage>
    );
};

export default Login;