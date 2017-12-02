import React from "react";
import { render } from "react-dom";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { syncHistoryWithStore } from "react-router-redux";
import thunk from "redux-thunk";
import RootReducer from "./redux/reducers/RootReducer";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import routes from "./routes.js";

const store = createStore(
  RootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

import css from "./assets/font/font.css";
import styles from "./assets/app.css";

render(
  <Provider store={store}>
    <BrowserRouter children={routes} />
  </Provider>,
  document.getElementById("app")
);
