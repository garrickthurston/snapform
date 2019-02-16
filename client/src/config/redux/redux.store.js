import { createStore } from "redux";
import { reducer } from "./root-reducer";

export const store = createStore(reducer);