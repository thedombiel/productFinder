import React from 'react';
import Relay, { RootContainer, Route } from 'react-relay';

import Base from './base';
import { ManageProduct } from '../components';

class ManageProductRoute extends Route {
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

  static routeName = 'ManageProductRoute'
}

export default class ManageProductView extends Base {

  constructor(props){
    super(props);
  }

  render(){
    const { barcode } = this.props.route.props;
    return (
      <RootContainer
        Component={ManageProduct}
        route={new ManageProductRoute({ barcode })}
        renderFailure={this.errorSnack}
        renderLoading={this.loading}
      />
    );
  }
}
