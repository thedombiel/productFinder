import React, { Component } from 'react';
import {
  Navigator
} from 'react-native';

import Navigate from '../utils/navigate';
import { Toolbar } from '../components';

class App extends Component {
  static childContextTypes = {
    navigator: React.PropTypes.object
  }

  constructor(props){
    super(props);

    this.state = {
      navigator: null
    };

    this.setNavigator = this.setNavigator.bind(this);
    this.getChildContext = this.getChildContext.bind(this);
    this.renderScene = this.renderScene.bind(this);
  }

  setNavigator(navigator){
    this.setState({navigator: new Navigate(navigator)});
  }

  getChildContext(){
    return {
      navigator: this.state.navigator
    };
  }

  renderScene(route, navigator){
    if(!route)
      return null;
    let Component = route.component;

    if(this.state.navigator && route.component){
      if(route.path === 'search')
        return <Component route={route} {...route.props}/>;
      return <Toolbar><Component route={route} {...route.props}/></Toolbar>;
    }

    return null;
  }

  render(){
    return (
      <Navigator
        ref={navigator => { !this.state.navigator ? this.setNavigator(navigator) : null}}
        style={styles.navigator}
        renderScene={this.renderScene}
        configureScene={() => (Navigator.SceneConfigs.FadeAndroid)}
        initialRoute={ Navigate.getInitialRoute() }
      />
    );
  }
};

const styles = {
  navigator: {
    flex: 1
  }
};

export default App;
