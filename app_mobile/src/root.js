import React from 'react';
import Relay, { DefaultNetworkLayer } from 'react-relay';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducers from './reducers';
import { App } from './views';

let store = createStore(reducers);
Relay.injectNetworkLayer( new DefaultNetworkLayer('http://192.168.1.14:3000/graphql'));

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);


