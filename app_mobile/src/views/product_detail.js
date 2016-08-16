import React from 'react';
import Relay, { RootContainer, Route } from 'react-relay';

import Base from './base';
import { ProductDetail } from '../components';

class ProductDetailRoute extends Route {

  static paramDefinitions = {
    barcode: { required: true}
  }

  static queries = {
    store: (Component, vars) => Relay.QL`
      query {
        store{
          ${Component.getFragment('store', vars)}
        }
      }
    `
  }

  static routeName = 'ProductDetailRoute'
}

export default class ProductDetailView extends Base {

  constructor(props){
    super(props);
  }

  render(){
    const { barcode } = this.props.route.props;
    return (
      <RootContainer
        Component={ProductDetail}
        route={new ProductDetailRoute({ barcode })}
        renderLoading={this.loading}
        renderFailure={this.errorSnack}
        forceFetch={true}
      />
    );
  }
}
