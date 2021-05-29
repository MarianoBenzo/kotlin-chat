import React, {Suspense, lazy} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from "react-router-dom";

const Chat = lazy(() => import("components/chat/ChatWrapper"));

const App = () => (
    <div>
        <BrowserRouter>
            <Suspense fallback={"Loading..."}>
                <Switch>
                    <Route exact path="/chat" component={Chat}/>
                </Switch>
            </Suspense>
        </BrowserRouter>
    </div>
);

ReactDOM.render(<App/>, document.getElementById("app"));
