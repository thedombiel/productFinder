import React, { Component } from 'react';
import {
  ToolbarAndroid,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default class Toolbar extends Component {

  static contextTypes = {
    navigator: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props);

    this.state = {
      back: null,
      barcode: null
    };

    this.onActionSelected = this.onActionSelected.bind(this);
    this.back = this.back.bind(this);
    this.actions = this.actions.bind(this);
    this.getIcon = this.getIcon.bind(this);
  }

  componentWillMount(){
    Icon.getImageSource('keyboard-backspace', 20, '#fff').then(
      source => this.setState({back: source}));

    Icon.getImageSource('scanner', 20, '#fff').then(
      source => this.setState({ barcode:
                                {title: 'Barcode Scanner', show: 'always', icon: source} }));

    Icon.getImageSource('search', 20, '#fff').then(
      source => this.setState({ search:
                                {title: 'Barcode Scanner', show: 'always', icon: source} }));
  }

  onActionSelected(position){
    const options = ['search', 'barcodeScanner'];

    this.context.navigator.to(options[position]);
  }

  back(){
    this.context.navigator._hardwareBackPress();
  }

  actions(path){
    let actions = [];
    if(path === 'barcodeScanner' || !this.state.barcode){
      return [];
    }
    this.state.search && actions.push(this.state.search);
    this.state.barcode && actions.push(this.state.barcode);
    return actions;
  }

  getIcon(path){
    if(path !== '' && path !== 'home' && path !== null){
      return this.state.back;
    }
    return null;
  }

  render(){
    const {navigator} = this.context;
    if(!navigator){
      return <ToolbarAndroid />;
    }
    const path = navigator.currentRoute ? navigator.currentRoute.path : null;
    const actions = this.actions(path);
    const icon = this.getIcon(path);
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          navIcon={icon}
          onIconClicked={this.back}
          actions={actions}
          onActionSelected={this.onActionSelected}
          titleColor='#FFF'
          title="Home"
        />
        {this.props.children}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 56
  },
  toolbar: {
    backgroundColor: '#888888',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    elevation: 5
  }
};
