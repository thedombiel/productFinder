import React, { Component } from 'react';
import Relay, {
  Route,
  RootContainer,
  DefaultNetworkLayer
} from 'react-relay';
import { App } from './views';

Relay.injectNetworkLayer( new DefaultNetworkLayer('http://192.168.1.14:3000/graphql'));

export default class Root extends Component {

  render(){
    return (
      <App />
    );
  }

}
