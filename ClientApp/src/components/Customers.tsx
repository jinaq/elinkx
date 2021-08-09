import React, {useEffect, useState} from 'react';

import {Customers, GET} from "../types";
import Customer from "./Customer";
import {AppDispath, createStore, RootState} from '../redux/store';
import {add, customersThunk} from "../redux/data";
import {Provider, useDispatch, useSelector} from "react-redux";
import {Button} from "reactstrap";


const CustomerComponent = () => {

    
    const data = useSelector((state: RootState) => state.data)
    debugger
    const dispatch = useDispatch<AppDispath>()
    const output = [] as JSX.Element[]

    for (const key of data.customersPosition) {
        output.push(<Customer key={key} keyId={key}/>)
    }


    return <>
        {data.loading ? <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div> : false}
        {data.errors ? <div className="alert alert-danger" role="alert">
            {data.errors}
        </div> : false}
        <table className={'table'}>
            <thead>
            <tr>
                <th>ICO</th>
                <th>Jmeno</th>
                <th><Button onClick={(ev)=>{
                    dispatch(add())
                }}>Novy</Button> </th>
            </tr>
            </thead>
            <tbody>
            {output}
            </tbody>
        </table>
    </>
}
export default () => {
    const [store] = useState(() => {
        const store = createStore()
        store.dispatch(customersThunk({
            type: GET
        }))
        return store
    })

    return <Provider store={store}>
        <CustomerComponent/>
    </Provider>
}