import React from "react";
import ReactDOM from "react-dom";
import { addLocale } from "primereact/api";

import { store, persistor } from "./app/store";
import { history } from "./app/history";

import "./index.scss";
import localeRu from "./assets/locales/ru.json";
import localeEn from "./assets/locales/en.json";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ConnectedRouter } from "connected-react-router";
import { AppWrapper } from "./features/app/AppWrapper";

// import * as serviceWorkerRegistration from "./assets/scripts/serviceWorkerRegistration";
// import reportWebVitals from "./assets/scripts/reportWebVitals";

addLocale("ru", localeRu);
addLocale("en", localeEn);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <ConnectedRouter history={history}>
                    <AppWrapper />
                </ConnectedRouter>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
