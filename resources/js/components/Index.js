import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NEWS from './news';

function App() {
    return (
        <main>
            <Switch>
                <Route path="/" component={NEWS} exact />
            </Switch>
        </main>
    )
}

if (document.getElementById('mainView')) {
    ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('mainView'));
}
