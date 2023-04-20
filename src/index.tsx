import React, { createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Store from "./store/Store";

const store = new Store();

export const Context = createContext({ store });

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <Context.Provider value={{ store }}>
        <App />
    </Context.Provider>
);
