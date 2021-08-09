import React, {CSSProperties, useEffect, useState} from 'react'
import {Customer, CustomerInput, DELETE, POST, PUT} from "../types";
import {Button, ButtonGroup} from 'reactstrap'
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {AppDispath, RootState} from "../redux/store";
import {customersThunk} from "../redux/data";


const Editor = (props: { keyId: string, onClose: ()=>void} )=> {
    
    const { customer, loading, ferrors }  = useSelector((state:RootState)=> {
        return { customer: state.data.customers[props.keyId], loading: state.data.loading, ferrors: state.data.errors }
    })
    
    
    const dispatch = useDispatch<AppDispath>()
    const {
        register,
        formState: {
            
        },
        handleSubmit
    } = useForm<CustomerInput>({
        defaultValues: {
            Name: customer.customer.Name || '',
            ICO: customer.customer.ICO || ''
        }
    })
    let style = {
        
    } as CSSProperties
    if (customer.errors && customer.errors.global)
        style.borderTopWidth = 0
    
    return <>
        {customer.errors && customer.errors.global ? <tr><td colSpan={3} ><div className="alert alert-danger" role="alert" style={{ marginBottom: 0}}>{customer.errors.global}</div></td></tr>:<></>}
        <tr>
        <td style={style}>
            <input className={`form-control ${customer.errors && customer.errors.ICO ? 'is-invalid' : ''}`} {...register("ICO", { required: true})}/>
            {customer.errors && customer.errors.ICO ?<span className={'invalid-feedback'}>{customer.errors.ICO}</span>: false}
        </td>
        <td style={style}>
            <input className={`form-control ${customer.errors && customer.errors.Name ? 'is-invalid' : ''}`} {...register("Name", { required: true})}/>
            {customer.errors && customer.errors.Name ?<span className={'invalid-feedback'}>{customer.errors.Name}</span>: false}
        </td>
        <td style={style}>
            <ButtonGroup>
                <Button onClick={ev=>{
                    handleSubmit(data=>{
                        
                        let id = undefined;
                        if ('ID' in customer.customer) {
                            id = (customer.customer as Customer).ID
                        }
                        if (id) {
                            dispatch(customersThunk({
                                key: props.keyId,
                                type: PUT,
                                input: {ID: id as number, ...data}
                            }))
                        } else {
                            dispatch(customersThunk({
                                key: props.keyId,
                                type: POST,
                                input: { ...data}
                            }))
                        }
                    }, (errors)=>{
                        
                    })()
                }} color={"primary"} disabled={loading}>Uložit</Button>
                <Button color={"danger"} disabled={loading} onClick={ev=>{
                    let id = undefined;
                    if ('ID' in customer.customer) {
                        id = (customer.customer as Customer).ID
                    }
                    dispatch(customersThunk({
                        key: props.keyId,
                        id,
                        type: DELETE
                    }))
                }}>Smazat</Button>
                {'ID' in customer.customer ? <Button disabled={loading} onClick={ev=>{
                    props.onClose()
                }}>Zavrit</Button>: false}
            </ButtonGroup>
        </td>
        </tr>
    </>
    
}


export default (props: { keyId: string })=>{
    const item = useSelector((state:RootState)=>{
        
        return state.data.customers[props.keyId] 
    })
    
    
    const [edit, setEdit] = useState(()=> !(item.customer as Customer).ID)
    if (edit) {
        
        return <Editor keyId={props.keyId} onClose={()=>{
            setEdit(false)
        }}/>
    }
    return <tr>
        <td>{item.customer.ICO}</td>
        <td>{item.customer.Name}</td>
        <td><Button onClick={(e)=>{
            e.preventDefault();
            setEdit(true)
        }}>Editovat</Button></td>
    </tr>
}