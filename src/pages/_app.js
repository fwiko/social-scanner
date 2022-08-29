import '../styles/globals.scss'

import Head from 'next/head'
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import getConfig from 'next/config';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Social Scanner</title>
                <meta name="og:title" content="Social Scanner 📡" />
                <meta name="description"
                    content="Check the availability of your favourite username on a variety of online platforms." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
                <Component {...pageProps} />
            </GoogleReCaptchaProvider>
        </>
    )
}

export default MyApp
