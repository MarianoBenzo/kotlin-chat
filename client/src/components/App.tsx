import React, {Suspense, lazy} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from "react-router-dom";

const Chat = lazy(() => import("components/chat/ChatWrapper"));

const App = () => (
        <BrowserRouter>
            <Suspense fallback={null}>
                <Switch>
                    <Route exact path="/" component={Chat}/>
                </Switch>
            </Suspense>
        </BrowserRouter>
);

ReactDOM.render(<App/>, document.getElementById("app"));
