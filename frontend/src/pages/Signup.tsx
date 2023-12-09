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
    IonButtons,
    IonMenuButton,
    IonRouterLink
} from '@ionic/react';
import { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { useMeta } from '../contexts/MetaContext';
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { HCAPTCHA_SITE_KEY } from '../config';

const Signup: React.FC = () => {

    const history = useHistory();
    const { signup, isAuthenticated } = useAuth();
    const { isOnline } = useMeta();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [comfirmPassword, setComfirmPassword] = useState("");
    const [isTermsAgreed, setIsTermsAgreed] = useState(false);


    /** Password Validation */
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        const isMatched = pattern.test(password);
        console.log(isMatched)
        setPassword(password);
        setIsPasswordValid(isMatched);
    };

    /** Captcha */
    const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined);
    const captcha = useRef<HCaptcha | null>(null);



    /** Redirect to timeline, if is authenticated. */
    useEffect(() => {
        if (isAuthenticated) {
            history.push("/timeline/pri", { direction: 'none' });
        }
    }, [isAuthenticated]);



    /** Signup Logic */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== comfirmPassword) {
            alert("Password and comfirm password are not matched");
            return;
        }
        if (!captchaToken || !captcha.current) {
            alert("Please complete the captcha")
            return;
        }
        try {
            const { user } = await signup(email, password, captchaToken);
            (user.confirmation_sent_at) && alert("Please confirm your email");
            (user.email_confirmed_at) && alert("Email Exist, please login!");
            captcha.current.resetCaptcha()
        } catch (error) {
            alert("Signup failed: \n " + error)
            console.error(error);
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
                <div className='grid grid-cols-1 p-4'>
                    <div className='mb-4'>
                        <h1 className='text-3xl font-semibold'>Signup</h1>
                    </div>
                    <form className="" onSubmit={handleSubmit}>
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
                                onChange={handlePasswordChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                            {!isPasswordValid && <p className="mt-2 text-sm text-red-600">Password should include lowercase, uppercase letters, digits and symbols.</p>}
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="repeat-password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Comfirm password</label>
                            <input
                                type="password"
                                id="repeat-password"
                                onChange={(e) => setComfirmPassword(e.target.value)}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                        </div>
                        <div className=" flex items-start mb-5">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={isTermsAgreed}
                                onChange={(e) => setIsTermsAgreed(e.target.checked)}
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                required
                            />
                            <label
                                htmlFor="terms"
                                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
                        </div>
                        <HCaptcha
                            ref={captcha}
                            sitekey={HCAPTCHA_SITE_KEY}
                            onVerify={(token) => { setCaptchaToken(token) }} />
                        <button type="submit" className="mt-4 w-full text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register new account</button>
                    </form>
                    <div className="mt-4">
                        <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Already have an account? 👉 <IonRouterLink routerLink='/login' >Login</IonRouterLink></label>
                    </div>
                </div>
            </IonContent>
        </IonPage >
    );
};

export default Signup;