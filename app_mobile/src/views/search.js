import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Relay, { Route, RootContainer} from 'react-relay';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ProductList, ProgressBar } from '../components';


class SearchRoute extends Route {
  static queries = {
    store: (Component, vars) => Relay.QL`
      query {
        store {${Component.getFragment('store', vars)}}
      }
    `
  }

  static routeName = 'SearchRoute'
}

export default class Search extends Component {

  static contextTypes = {
    navigator: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props);

    this.state = {
      q: ''
    };

    this.back = this.back.bind(this);
  }

  back(){
    this.context.navigator._hardwareBackPress();
  }

  render(){
    const { q } = this.state;
    return (
      <View style={styles.container}>
        {/* Toolbar for searching with text input  */}
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={this.back}>
            <Icon name='keyboard-backspace' color='#fff' size={20} style={styles.icon}/>
          </TouchableOpacity>
          <View style={{flexDirection: 'column', flex: 1}}>
          <TextInput
            autoFocus={true}
            value={q}
            onChangeText={text => this.setState({q: text})}
          />
          </View>
        </View>

        <RootContainer
          Component={ProductList}
          route={new SearchRoute({ q })}
          renderLoading={this.loading}
          renderFetched={(data, readyState) => {
              const isRefreshing = readyState.stale;
              if(!isRefreshing)
                return <ProductList {...data} />;

              return <ProgressBar position='high' />;
            }}
          forceFetch={true}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 56
  },
  icon: {
    marginLeft: 15,
    marginRight: 15
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#888888',
    position: 'absolute',
    elevation: 10,
    top: 0,
    right: 0,
    left: 0,
    height: 56
  }
};
