import React, { Component } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Image
} from 'react-native';
import Relay, { Mutation } from 'react-relay';
import Snackbar from 'react-native-android-snackbar';

import { Button } from '../components';

class ProductMutation extends Mutation {

  static fragments = {
    product: () => Relay.QL`
      fragment on Product {
        barcode
      }
    `,
  };

  getMutation(){
    return Relay.QL`
      mutation{ createProduct }
    `
  }

  getConfigs(){
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          product: this.props.product.id
        }
      }
    ]
  }

  getFatQuery(){
    return Relay.QL`
      fragment on ProductmutationsPayload {
        product {
          id
          views
        }
      }
    `
  }

  getVariables(){
    const { product } = this.props;
    return {
      name: this.props.name,
      description: this.props.description,
      barcode: this.props.product.barcode
    };
  }
}

class ManageProduct extends Component {

  static contextTypes = {
    navigator: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props);

    this.state = {
      product: this.props.store.product
    };

    this.changeValues = this.changeValues.bind(this);
    this._onSuccess = this._onSuccess.bind(this);
    this.save = this.save.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps !== this.props){
      this.setState({product: nextProps.product});
    }
  }

  changeValues(objectValue){
    this.setState({
      product: Object.assign({}, this.state.product, objectValue)
    });
  }

  _onSuccess(){
    const { barcode } = this.state.product;

    Snackbar.show('Product added corectly.', {duration: Snackbar.LONG});
    this.context.navigator.to('productDetail', '', { barcode });
  }

  save(){
    const { name, description } = this.state.product;
    const { product } = this.props.store;

    const mutation = new ProductMutation({
        name,
        description,
        product
    });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this._onSuccess
    });
  }

  render(){
    const { product } = this.props.store;
    return (
      <ScrollView style={styles.container}>
        <Image
          source={{uri: product.image}}
          style={styles.image}
        />
        <TextInput
          placeholder={'Barcode'}
          value={product.barcode}
          editable={false}
          placeholderTextColor={'#BCBDBE'}
          style={styles.input}
        />
        <TextInput
          placeholder={'Name'}
          value={product.name}
          onChangeText={(value) => this.changeValues({name: value})}
          placeholderTextColor={'#BCBDBE'}
          style={styles.input}
        />
        <TextInput
          placeholder={'Description...'}
          value={product.description}
          multiline={true}
          numberOfLine={4}
          onChangeText={(value) => this.changeValues({description: value})}
          placeholderTextColor={'#BCBDBE'}
          style={[styles.input, {height: 138, paddingTop: -80}]}
        />
        <View style={styles.row}>
          <Button
            text='Save'
            color='green'
            onPress={this.save}
          />
        </View>
      </ScrollView>
    );
  }
}

ManageProduct = Relay.createContainer(ManageProduct, {
  initialVariables: {
    barcode: ''
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        product(barcode: $barcode){
          id
          barcode
          name
          description
          image
          views
          ${ProductMutation.getFragment('product')}    
        }
      }
    `
  }
});

let styles = {
	container: {
		flex: 1,
		flexDirection: 'column',
		padding: 10,
		paddingTop: 0,
		backgroundColor: '#E6E7E8'
	},
  row: {
    flexDirection: 'row'
  },
	input: {
		marginTop: 15,
		padding: 10,
		borderRadius: 1,
		backgroundColor: '#F2F4F5',
		height: 46
	},
	image: {
    marginTop: 15,
    width: 100,
    height: 100,
    alignSelf: 'center'

  }
};

export default ManageProduct;
