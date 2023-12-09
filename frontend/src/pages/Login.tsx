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
    IonRouterLink
} from '@ionic/react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router';
import { useMeta } from '../contexts/MetaContext';
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { HCAPTCHA_SITE_KEY } from '../config';
import { resetPasswordForEmail } from '../apis/AuthenticationAPI';



const Login: React.FC = () => {

    const history = useHistory();
    const { login, isAuthenticated, session, user, loginWithGoogle } = useAuth();
    const { isOnline } = useMeta();


    const [email, setEmail] = useState("demo@linklabs.app");
    const [password, setPassword] = useState("Password1@");
    const [isLoginFailed, setLoginFailed] = useState(false);


    /** Captcha */
    const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined);
    const captcha = useRef<HCaptcha | null>(null);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Login handleSubmit: isAuthenticated = ", isAuthenticated)
        if (email && password) {
            try {
                if (!captchaToken || !captcha.current) {
                    alert("Please complete the captcha")
                    return;
                }
                await login(email, password, captchaToken);
                captcha.current.resetCaptcha()
                history.push('/timeline/pri', { direction: 'none' });
            } catch (error) {
                alert("Login failed: \n " + error)
                console.error(error);
            }
        }
    }

    /** Handle Forget password */
    const handleForgetPassword = async () => {
        if (!email) {
            alert("Please enter your email")
            return;
        }

        try {
            const { data } = await resetPasswordForEmail(email);
            console.debug(data)
        } catch (error) {
            alert("Failed to reset password: \n" + error)
            console.error(error);
        }
    }


    return (
        <IonPage id="main">
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        {/* <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons> */}
                    </IonToolbar>
                </IonHeader>
                <div className='grid grid-cols-1 p-4'>
                    <div className='mb-4'>
                        <h1 className='text-3xl font-semibold'>Welcome to Sparking.</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input
                                type="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Your email here.." required />
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                        </div>
                        <HCaptcha
                            ref={captcha}
                            sitekey={HCAPTCHA_SITE_KEY}
                            onVerify={(token) => { setCaptchaToken(token) }} />
                        <button type="submit" className="mt-4 w-full text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                    </form>
                    <button
                        onClick={() => loginWithGoogle()}
                        className="mt-4 w-full text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Continue with Google</button>
               
                    <span
                        onClick={handleForgetPassword}
                        className='mt-4 w-full text-blue-500 hover:underline cursor-pointer '>
                        Forgot password?
                    </span>
                    <div className='mt-2'>
                        <IonRouterLink routerLink='/signup' >Don't have an account? Signup</IonRouterLink>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;