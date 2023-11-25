import {
    IonContent,
    IonHeader,
    IonInput,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar,
    IonButton,
    IonGrid,
    IonCol,
    IonRow,
    IonPopover,
    IonList,
    IonItem,
    IonAlert,
    IonButtons,
    IonMenuButton
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router';
import { GetServerHealthData } from '../apis/ConnectivityAPI';
import HealthData from "../apis/ConnectivityAPI";


const Login: React.FC = () => {
    const history = useHistory();
    const [email, setEmail] = useState("demo@linklabs.app");
    const [password, setPassword] = useState("Password1@");
    const [isLoginFailed, setLoginFailed] = useState(false);

    const { login, isAuthenticated } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (email && password) {
            try {
                await login(email, password);
            } catch (error) {
                console.error(error);
                setLoginFailed(true);
            }
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            history.push("/timeline");
        }
    }, [isAuthenticated]);


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

    const validate = (ev: Event) => {
        const value = (ev.target as HTMLInputElement).value;
        setIsValid(undefined);
        if (value === '') return;
        validateEmail(value) !== null ? setIsValid(true) : setIsValid(false);
    };

    const markTouched = () => {
        setIsTouched(true);
    };
    /* Email Validation Done */






    return (
        <IonPage id="main">
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Login</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonGrid className='ion-padding'>
                    <form onSubmit={handleSubmit}>
                        <IonCol>
                            <IonInput
                                className={`${isValid && 'ion-valid'} ${isValid === false && 'ion-invalid'} ${isTouched && 'ion-touched'}`}
                                type="email"
                                fill="solid"
                                label="Email"
                                labelPlacement="floating"
                                errorText="Invalid email"
                                onIonInput={(event) => validate(event)}
                                onIonBlur={() => markTouched()}
                                value={email}
                                onIonChange={(e) => setEmail(e.detail.value!)}
                            ></IonInput>
                        </IonCol>
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
                                onIonChange={(e) => setPassword(e.detail.value!)}
                            ></IonInput>
                        </IonCol>
                        <IonCol>
                            <IonText color="medium">
                                <p>Just click "login" </p>
                            </IonText>
                        </IonCol>
                        <IonCol>
                            <IonButton color="secondary" type="submit" expand="block">Login</IonButton>
                            {/* <Button type="primary">Login</Button> */}
                        </IonCol>

                    </form>

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