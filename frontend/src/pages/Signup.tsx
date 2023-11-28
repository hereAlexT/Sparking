import { IonContent, IonHeader, IonInput, IonPage, IonText, IonTitle, IonToolbar, IonButton, IonGrid, IonCol, IonRow, IonButtons, IonMenuButton } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {


    /* Email Validation */
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
    /* Email Validation */

    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [comfirmPassword, setComfirmPassword] = useState("");

    const { signup, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            history.push("/timeline");
        }
    }, [isAuthenticated]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== comfirmPassword) {
            alert("Password and comfirm password are not matched");
            return;
        }


        try {
            await signup(email, password);
        } catch (error) {
            alert(error)
            console.log(error);
        }

    };



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
                    <IonRow>
                        <IonCol>
                            <IonText>
                                <h1 className='text-3xl font-semibold'>Signup</h1>
                            </IonText>
                        </IonCol>
                    </IonRow>
                    <form onSubmit={handleSubmit}>
                        <IonRow>
                            <IonInput
                                className={`${isValid && 'ion-valid'} ${isValid === false && 'ion-invalid'} ${isTouched && 'ion-touched'}`}
                                type="email"
                                fill="solid"
                                label="Email"
                                labelPlacement="floating"
                                helperText="Enter a valid email"
                                errorText="Invalid email"
                                onIonInput={(event) => validate(event)}
                                onIonBlur={() => markTouched()}
                                onIonChange={(e) => setEmail(e.detail.value!)}
                                disabled={false}
                            />

                        </IonRow>
                        <IonRow>
                            <IonInput
                                type="password"
                                label="Password"
                                helperText="Type your password"
                                labelPlacement="floating"
                                counter={true}
                                maxlength={32}
                                minlength={8}
                                onIonChange={(e) => setPassword(e.detail.value!)}
                                disabled={false}
                            />
                        </IonRow>

                        <IonRow>
                            <IonInput
                                type="password"
                                label="Comfirm Password"
                                helperText="Type your password"
                                labelPlacement="floating"
                                counter={true}
                                maxlength={32}
                                minlength={8}
                                onIonChange={(e) => setComfirmPassword(e.detail.value!)}
                                disabled={false}
                            />
                        </IonRow>

                        <IonRow>
                            <IonCol className="ion-padding-top">
                                <IonButton type="submit" expand="block">Signup</IonButton>
                            </IonCol>
                        </IonRow>

                    </form>
                </IonGrid>








            </IonContent>
        </IonPage >
    );
};

export default Signup;