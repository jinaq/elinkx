import React, {Component} from 'react';
import {Route} from 'react-router';
import {Layout} from './components/Layout';
import Customers from './components/Customers'
import './custom.css'



export default () => {



    return (
        
            <Layout>
                <Route exact path='/' component={Customers}/>
            </Layout>
        
    );

}
