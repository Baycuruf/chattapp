import { configureStore } from "@reduxjs/toolkit";
import playerReducer from './player'
import auth from "./auth"
import resultsReducer from "./results";

export default configureStore({
    reducer : {
        player : playerReducer,
       auth,
       results: resultsReducer,
    },

})