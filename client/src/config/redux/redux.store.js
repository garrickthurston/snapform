import { createStore } from "redux";
import reducer from "./root-reducer";

const store = createStore(reducer);

export default store;