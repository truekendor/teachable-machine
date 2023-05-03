import React, { createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import storeC from "./store/Store";

const store = storeC;

export const Context = createContext({ store });

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <Context.Provider value={{ store }}>
        <App />
    </Context.Provider>
);
