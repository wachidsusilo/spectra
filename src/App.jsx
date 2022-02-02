import React, { useRef } from 'react'
import './App.scss'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/home/Home'
import Spectrometer from './pages/spectrometer/Spectrometer';
import Analyzer from './pages/analyzer/Analyzer';
import NotFound from './pages/notfound/NotFound';
import LoginAccount from './pages/login/account/LoginAccount';

function App() {
    const stateRef = useRef(false);
    const analyzingRef = useRef(false);
    const analyzingProgressRef = useRef();
    const rotatingRef = useRef(false);
    const rotatingProgressRef = useRef();
    const scanRef = useRef();
    const rotateRef = useRef();
    const anChartPosRef = useRef();
    const fillRef = useRef(false);
    const spFillRef = useRef(false);
    const spChartPosRef = useRef(false);
    const convertingRef = useRef(false);
    const rgbRef = useRef({red: true, green: true, blue: true, total: true});
    const vidRef = useRef({
        active: false,
        loaded: false,
        selected: []
    });
    const vidPosRef = useRef({
        left: 0,
        right: 0,
        start: 0,
        end: 1,
        total: 1,
        length: 1,
        frame: 30,
        frameRate: 30,
        startFrame: 0,
        endFrame: 30
    });

    if(localStorage.getItem('fill')) {
        fillRef.current = localStorage.getItem('fill') === 'true';
    }

    return (
        <Router>
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/realtime-spectrometer' exact render={() => (<Spectrometer spFillRef={spFillRef} spChartPosRef={spChartPosRef} />)} />
                <Route path='/image-analyzer' exact render={() => (<Analyzer vidPosRef={vidPosRef} vidRef={vidRef} convertingRef={convertingRef} rgbRef={rgbRef} fillRef={fillRef} anChartPosRef={anChartPosRef} stateRef={stateRef} analyzingRef={analyzingRef} analyzingProgressRef={analyzingProgressRef} rotatingRef={rotatingRef} rotatingProgressRef={rotatingProgressRef} rotateRef={rotateRef} scanRef={scanRef} />)} />
                {/*<Route path='/signup' exact render={() => localStorage.getItem('auth') ? <Redirect to='/' /> : <Signup />} />
                <Route path='/login' exact render={() => localStorage.getItem('auth') ? <Redirect to='/' /> : <LoginEmail />} />*/}
                <Route path='/login-account' exact render={() => localStorage.getItem('auth') ? <Redirect to='/' /> : <LoginAccount />} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    )
}

export default App
