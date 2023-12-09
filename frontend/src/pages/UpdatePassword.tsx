import React, { useState, useRef } from 'react';
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
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { HCAPTCHA_SITE_KEY } from '../config';
import { UpdateUserPassword } from '../apis/AuthenticationAPI';

const UpdatePassword: React.FC = () => {
    const [password, setPassword] = useState("");
    const [comfirmPassword, setComfirmPassword] = useState("");

    /** Captcha */
    const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined);
    const captcha = useRef<HCaptcha | null>(null);



    /** Update Password Logic */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.debug("Update Password handleSubmit")
        if (password !== comfirmPassword) {
            alert("Password and comfirm password are not matched");
            return;
        }
        // if (!captchaToken || !captcha.current) {
        //     alert("Please complete the captcha")
        //     return;
        // }

        try {
            await UpdateUserPassword(password);
            alert("Password updated successfully");
        } catch (error) {
            alert("Update password failed: \n " + error)
            console.error(error);
        }

        // try {
        //     const { user } = await signup(email, password, captchaToken);
        //     if (user.confirmation_sent_at) {
        //         alert("Verification email sent, please check your inbox. If you register your account by other method, please login by that method.");
        //     }
        //     (user.email_confirmed_at) && alert("Email Exist, please login!");
        //     captcha.current.resetCaptcha()
        // } catch (error) {
        //     alert("Signup failed: \n " + error)
        //     console.error(error);
        // }

    };

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

    return (
        <IonPage>
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className='grid grid-cols-1 p-4'>
                    <div className='mb-4'>
                        <h1 className='text-3xl font-semibold'>Update Password</h1>
                    </div>
                    <form className="" onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                            <input
                                type="password"
                                id="password"
                                onChange={handlePasswordChange}
                                autoComplete="new-password"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                            {!isPasswordValid && <p className="mt-2 text-sm text-red-600">Password should include lowercase, uppercase letters, digits and symbols.</p>}
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="repeat-password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Comfirm new password</label>
                            <input
                                type="password"
                                id="repeat-password"
                                autoComplete="new-password"
                                onChange={(e) => setComfirmPassword(e.target.value)}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                        </div>
                        <HCaptcha
                            ref={captcha}
                            sitekey={HCAPTCHA_SITE_KEY}
                            onVerify={(token) => { setCaptchaToken(token) }} />
                        <button type="submit" className="mt-4 w-full text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Comfirm New Password</button>
                    </form>


                </div>
            </IonContent>
        </IonPage>
    );
};

export default UpdatePassword;
