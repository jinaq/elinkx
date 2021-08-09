import {configureStore} from "@reduxjs/toolkit";
import {reducerData} from "./data";

const store =configureStore({
    reducer: {
        data: reducerData
    }
})

export const createStore = () => {
   
    return store
    
}


export type RootState = ReturnType<typeof store.getState>
export type AppDispath = typeof store.dispatch
