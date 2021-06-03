import React, {Suspense, lazy} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import styles from "./styles/app.scss";

const Chat = lazy(() => import("components/chat/ChatWrapper"));

const App = () => (
        <div className={styles.container}>
            <BrowserRouter>
                <Suspense fallback={null}>
                    <Switch>
                        <Route exact path="/chat" component={Chat}/>
                    </Switch>
                </Suspense>
            </BrowserRouter>
        </div>
);

ReactDOM.render(<App/>, document.getElementById("app"));
