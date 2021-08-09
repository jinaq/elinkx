import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    Customer,
    CustomerInput,
    CustomerRow,
    CustomerRows,
    Customers,
    DELETE,
    GET,
    Operation,
    POST,
    PUT
} from "../types";

export const customersThunk = createAsyncThunk('/customers',
    async (content: Operation) => {

        const inits = {
            headers: {
                'content-type': 'application/json',
            },
            method: content.type
        }

        switch (content.type) {
            case GET: {
                const response = await fetch('/customers')
                return (response.json());
            }
            case POST: {
                const response = await fetch('/customers', {...inits, body: JSON.stringify(content.input)})
                if (response.status == 200)
                    return (response.json())
                return {
                    errors: (await response.json()).errors
                }
            }
            case PUT: {
                const response = await fetch('/customers', {...inits, body: JSON.stringify(content.input)})
                if (response.status == 200)
                    return (response.json())
                return {
                    errors: (await response.json()).errors
                }
            }
            case DELETE: {
                if (content.id) {
                    const response = await fetch('/customers/' + content.id, {...inits})
                    if (response.status == 200)
                        return (response.json())
                    return {
                        errors: response.json()
                    }
                }
                return null
            }
            default:
                return null
        }
    });

let key = 1;
const dataSlice = createSlice({
    name: "data",
    initialState: {
        customers: {} as CustomerRows,
        customersPosition: [] as string[],
        errors: false as string | false,
        loading: false
    },
    reducers: {
        add: (state) => {
            const k = 'p'+(key++)
            const newState= {} as CustomerRows
            
            newState[k] = {
                key: k, 
                customer: {
                    ICO: '',
                    Name: ""
                }, errors: false
            } as CustomerRow
            for (const [k,v] of Object.entries(state.customers)) {
                newState[k] =v;
            }
            state.customersPosition =[k].concat(state.customersPosition)
            state.customers = newState
        }
    },
    extraReducers: (builder) => {
        builder.addCase(customersThunk.pending, (state, actions) => {
            state.loading = true
        }).addCase(customersThunk.rejected, (state, reject) => {
            state.loading = false
            state.errors = "ERRORS!"
            return {...state}
        }).addCase(customersThunk.fulfilled, (state, data) => {
            
            state.loading = false;
            const op = data.meta.arg
            switch (op.type) {
                case GET: {
                    const newData = {} as CustomerRows

                    (data.payload as Customers).forEach((i) => {
                        const ka = 'p'+(key++) + '';
                        state.customersPosition = state.customersPosition.concat([ka])
                        newData[ka] = {
                            key: ka,
                            customer: i,
                            errors: false
                        } as CustomerRow
                    })
                    
                    state.customers = newData
                    break;
                }
                case POST:
                case PUT: {
                    if (data.payload.errors) {
                        state.customers[op.key].errors = data.payload.errors
                    } else {
                        const newData = {...state.customers}
                        const customer =  data.payload as Customer
                        newData[op.key] = {
                            key: op.key,
                            customer: data.payload,
                            errors: false
                        }
                        state.customers = newData
                    }
                    
                    break;
                }
                case DELETE:
                    const newData = JSON.parse(JSON.stringify(state.customers)) as CustomerRows
                    delete newData[op.key]
                    state.customersPosition = state.customersPosition.filter(i => i != op.key)
                    state.customers = newData
                    break;
            }

            state.errors = false;
        })
    }
})

export const reducerData = dataSlice.reducer
export const add = dataSlice.actions.add

