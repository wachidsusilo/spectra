import React, { useCallback, useEffect, useState } from 'react'
import ButtonAccount from '../../../button/account/ButtonAccount'
import './CardMdAccount.scss'
import { Link, Redirect } from 'react-router-dom';
import firebase, { auth, facebookProvider, githubProvider, googleProvider, twitterProvider } from './../../../../firebase/firebase';
import { setProfile } from './../../../../variables/profile';

function CardMdAccount() {
    const [state, setState] = useState({
        error: false,
        exist: false,
        providers: [],
        message: '',
        credential: undefined,
        redirect: false,
        linking: false,
        loading: false,
        onlyPassword: false,
        afterRedirect: false,
        microsoftLogin: false
    });

    if (sessionStorage.getItem('redirect')) {
        if (sessionStorage.getItem('credential')) {
            setState({ ...state, loading: true, afterRedirect: true, credential: JSON.parse(sessionStorage.getItem('credential')) });
            console.log(sessionStorage.getItem('credential'));
            sessionStorage.removeItem('credential');
        } else {
            setState({ ...state, loading: true, afterRedirect: true });
        }
        sessionStorage.removeItem('redirect');
    }

    const googleSignIn = useCallback(() => {
        sessionStorage.setItem('redirect', 'true');
        auth.signInWithRedirect(googleProvider);
    }, []);

    const facebookSignIn = useCallback(() => {
        sessionStorage.setItem('redirect', 'true');
        auth.signInWithRedirect(facebookProvider);
    }, []);

    const twitterSignIn = useCallback(() => {
        sessionStorage.setItem('redirect', 'true');
        auth.signInWithRedirect(twitterProvider);
    }, []);

    const microsoftSignIn = useCallback(() => {
        setState({...state, microsoftLogin: true})
        //sessionStorage.setItem('redirect', 'true');
        //auth.signInWithRedirect(microsoftProvider);
    }, [state]);

    const githubSignIn = useCallback(() => {
        sessionStorage.setItem('redirect', 'true');
        auth.signInWithRedirect(githubProvider);
    }, []);

    useEffect(() => {
        if (state.afterRedirect) {
            auth.getRedirectResult().then((result) => {
                if (result.user) {
                    setProfile(result.user.displayName, result.user.photoURL, result.user.uid);
                    if (state.credential) {
                        let credential;
                        switch (state.credential.providerId) {
                            case 'google.com':
                                credential = new firebase.auth.GoogleAuthProvider.credential(state.credential.oauthAccessToken);
                                break;
                            case 'facebook.com':
                                credential = new firebase.auth.FacebookAuthProvider.credential(state.credential.oauthAccessToken);
                                break;
                            case 'twitter.com':
                                credential = new firebase.auth.TwitterAuthProvider.credential(state.credential.oauthAccessToken, state.credential.oauthTokenSecret);
                                break;
                            case 'microsoft.com':
                                credential = new firebase.auth.OAuthProvider('microsoft.com').credential(state.credential.idToken, state.credential.oauthAccessToken);
                                break;
                            default:
                                credential = new firebase.auth.GithubAuthProvider.credential(state.credential.oauthAccessToken);
                                break;
                        }
                        auth.currentUser.linkWithCredential(credential).then((result) => {
                            setState({ ...state, redirect: true });
                        }).catch((error) => {
                            setState({
                                ...state,
                                error: true,
                                message: error.message,
                                loading: false
                            })
                        })
                    } else {
                        setState({ ...state, redirect: true });
                    }
                }
            }).catch((error) => {
                console.log(error);
                if (error.code === 'auth/account-exists-with-different-credential') {
                    auth.fetchSignInMethodsForEmail(error.email).then((providers) => {
                        console.log(providers);
                        if (providers.length === 1 && providers[0] === 'password') {
                            setState({
                                ...state,
                                error: true,
                                exist: true,
                                onlyPassword: true,
                                loading: false
                            })
                        } else {
                            setState({
                                ...state,
                                error: true,
                                exist: true,
                                providers: providers,
                                message: error.message,
                                credential: error.credential,
                                loading: false
                            })
                        }
                    }).catch((err) => {
                        console.log(err);
                        setState({ ...state, loading: false });
                    })
                } else {
                    setState({
                        ...state,
                        error: true,
                        exist: false,
                        message: error.message,
                        loading: false
                    })
                }
            })
        }
    }, [state]);

    const onLinking = () => {
        if (state.providers.length === 0) return;
        sessionStorage.setItem('credential', JSON.stringify(state.credential));
        switch (state.providers[0]) {
            case 'google.com':
                googleSignIn();
                break;
            case 'facebook.com':
                facebookSignIn();
                break;
            case 'twitter.com':
                twitterSignIn();
                break;
            case 'microsoft.com':
                microsoftSignIn();
                break;
            default:
                githubSignIn();
                break;
        }
    }

    if (state.redirect) {
        return (
            <Redirect to='/' />
        )
    } else {
        return (
            <div className='card-md-account'>
                <div className='card-md-account-header'>Login</div>
                <div className='card-md-account-section'>
                    <>
                        {(state.error && !state.exist && !state.onlyPassword) &&
                            <div className='card-md-account-error'>
                                <div className='card-md-account-error-description'>
                                    {state.message}
                                </div>
                            </div>
                        }
                    </>
                    <>
                        {state.microsoftLogin &&
                            <div className='card-md-account-error'>
                                <div className='card-md-account-error-description'>
                                    Logging in using microsoft account is currently unavailable.
                                </div>
                            </div>
                        }
                    </>
                    <>
                        {(state.error && state.exist && state.onlyPassword) &&
                            <>
                                <div className='card-md-account-error'>
                                    <div className='card-md-account-error-description'>
                                        An account already exist with the same email address. Linking your account with previous login method (email and password) is currently unavailable.
                                    </div>
                                    <Link to='/login' style={{ textDecoration: 'none' }}>
                                        <div className='card-md-account-error-linking'>Sign-in using email and password</div>
                                    </Link>
                                </div>
                                <ButtonAccount type='google' onClick={googleSignIn} />
                                <ButtonAccount type='facebook' onClick={facebookSignIn} />
                                <ButtonAccount type='twitter' onClick={twitterSignIn} />
                                {/*<ButtonAccount type='microsoft' onClick={microsoftSignIn} />*/}
                                <ButtonAccount type='github' onClick={githubSignIn} />
                            </>
                        }
                    </>
                    <>
                        {!state.error ?
                            <>
                                {state.loading ?
                                    <div className='card-md-account-loading'></div>
                                    :
                                    <>
                                        <ButtonAccount type='google' onClick={googleSignIn} />
                                        <ButtonAccount type='facebook' onClick={facebookSignIn} />
                                        <ButtonAccount type='twitter' onClick={twitterSignIn} />
                                        {/*<ButtonAccount type='microsoft' onClick={microsoftSignIn} />*/}
                                        <ButtonAccount type='github' onClick={githubSignIn} />
                                    </>
                                }
                            </>
                            :
                            <>
                                {!state.onlyPassword &&
                                    <>
                                        <div className='card-md-account-error'>
                                            <div className='card-md-account-error-description'>
                                                An account already exist with the same email address. You can login using another method below or link your account to the existing one.
                                            </div>
                                            <div className='card-md-account-error-linking' onClick={onLinking}>
                                                Link to my existing account
                                            </div>
                                        </div>
                                        <>{state.providers.includes('google.com') && <ButtonAccount type='google' onClick={googleSignIn} />}</>
                                        <>{state.providers.includes('facebook.com') && <ButtonAccount type='facebook' onClick={facebookSignIn} />}</>
                                        <>{state.providers.includes('twitter.com') && <ButtonAccount type='twitter' onClick={twitterSignIn} />}</>
                                        <>{/*state.providers.includes('microsoft.com') && <ButtonAccount type='microsoft' onClick={microsoftSignIn} />*/}</>
                                        <>{state.providers.includes('github.com') && <ButtonAccount type='github' onClick={githubSignIn} />}</>
                                    </>
                                }
                            </>
                        }
                    </>
                </div>
                {/*<div className='card-md-account-footer'>
                    !state.loading &&
                        <Link to='/login' style={{ textDecoration: 'none' }}>
                            <div className='card-md-account-footer-content'>Login with Email</div>
                        </Link>
                    
                </div>*/}
            </div>
        )
    }
}

export default CardMdAccount
