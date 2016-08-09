import React, { Component } from 'react';

import { ProductList } from '../components';
import Relay, { RootContainer, Route } from 'react-relay';

import Base from './base';

class ProductsRoute extends Route {
  static queries = {
    store: (Component) => Relay.QL`
      query {
        store {${Component.getFragment('store')}}
      }
    `
  }

  static routeName = 'ProductsRoute'
}

export default class Home extends Base {

  constructor(props){
    super(props);
  }

  render(){
    return (
      <RootContainer
        Component={ProductList}
        route={new ProductsRoute()}
        renderLoading={this.loading}
      />
    );
  }
}
