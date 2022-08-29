import styles from '../styles/Home.module.scss'

import axios from 'axios'
import { useCallback, useState, useEffect } from 'react'
import { isValidUsername } from '@utils/validation'
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// components

import Card from '@components/Card/Card'
import ResultCard from '@components/Card/ResultCard'
import Form from '@components/Form/Form'
import Loader from '@components/Loader/Loader'
import Grid from '@components/Grid/Grid'
import Button from '@components/Button/Button'

export default function Home() {
    const [results, setResults] = useState(null);
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [checks, setChecks] = useState(0);

    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleSubmit = useCallback(
        (e) => {
            setLoading(true);
            e.preventDefault();

            const submittedUsername = e.target.elements.username;
            if (!submittedUsername || !isValidUsername(submittedUsername.value)) {
                setError('Invalid username input. Please try again.');
                setLoading(false);
                return;
            }

            if (!executeRecaptcha) {
                setError('ReCAPTCHA verification failed. Please try again.');
                setLoading(false);
                return;
            }

            executeRecaptcha("enquiryFormSubmit").then((gReCaptchaToken) => {
                checkUsername(submittedUsername.value, gReCaptchaToken);
            });
        }, [executeRecaptcha]
    )

    const checkUsername = async (submittedUsername, gReCaptchaToken) => {
        let response;

        const requestOptions = {
            method: 'POST',
            url: '/api/check',
            headers: { 'Content-Type': 'application/json' },
            data: { submittedUsername, gReCaptchaToken }
        };

        try {
            response = await axios.request(requestOptions);
        } catch (err) {
            setError(err.response.data ? err.response.data : 'Something went wrong');
            setLoading(false);
            return;
        }

        setUsername(submittedUsername);
        setResults(response.data);
        setLoading(false);
    }

    const getStatistics = () => {
        axios.get('/api/stats', { headers: { 'Content-Type': 'application/json' } })
            .then(res => setChecks(res.data.uniqueChecks))
            .catch(err => console.error(err));
    }

    const clearResults = () => {
        setResults(null);
        setUsername(null);
        setError(null);
        getStatistics();
    }

    useEffect(() => getStatistics(), []);

    const headingText = (
        <>
            <h1 className="t-clr-light f-size-md">Social Scanner 📡 </h1>
            <hr />
            <p className={`${styles.description} t-clr-light-secondary f-size-sm`}>
                Check the availability of your favourite username on a variety of online platforms. Including: {' '}
                <span className="t-clr-highlight f-weight-bold">Twitter</span>,{' '}
                <span className="t-clr-highlight f-weight-bold">Steam</span>,{' '}
                and <span className="t-clr-highlight f-weight-bold">Minecraft</span>.
            </p>
        </>
    )

    let orderedResults;
    if (results) {
        orderedResults = results.filter(result => result.status === 'available')
            .concat(results.filter(result => result.status === 'unavailable'))
            .concat(results.filter(result => result.status === 'errored'));
    }

    return (
        <main className={styles.main}>
            {
                loading ? (<Loader />) : (
                    results ? (
                        <>
                            <div className={styles.heading}>
                                <h1 className="t-clr-light f-size-md">Results for username{' '}
                                    <span className="t-clr-highlight">{username}</span></h1>
                            </div>
                            <Grid columns={3}>
                                {orderedResults.map(result => {
                                    return (
                                        <ResultCard
                                            key={result.name}
                                            title={result.name}
                                            mode={result.status}
                                            link={result.url}
                                        />
                                    )
                                })}
                            </Grid>
                            <Button onClick={clearResults}>Back</Button>
                        </>
                    ) : (
                        <>
                            <div className={styles.heading}>
                                {headingText}
                            </div>
                            <Card>
                                <Form onSubmit={handleSubmit}>
                                    <input type='text' placeholder='Username' name='username' minLength={1}></input>
                                </Form>
                            </Card>
                            <p className={`t-clr-light ${styles.description}`}>Usernames Checked: <span className='t-clr-highlight f-weight-bold'>{checks}</span></p>
                            {error ? (<div className={`f-size-sm ${styles.error}`}>{error}</div>) : ''}
                        </>
                    )
                )
            }
        </main>
    )
}
