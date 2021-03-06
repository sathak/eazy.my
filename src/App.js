﻿import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import viewItem from './components/viewItem';


export default () => (
  <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/viewItem/:id' component={viewItem} />
  </Layout>
);
