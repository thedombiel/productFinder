import React, { Component } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Image
} from 'react-native';
import Relay from 'react-relay';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import Snackbar from 'react-native-android-snackbar';

import { ProductMutation } from '../mutation';
import { Button } from '../components';
import { load } from '../actions';


class ManageProduct extends Component {

  static contextTypes = {
    navigator: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props);

    this.props.load(this.props.product.product); // load from relay to reduxForm

    this._onSuccess = this._onSuccess.bind(this);
    this.save = this.save.bind(this);
  }

  _onSuccess(){
    const { barcode, exist } = this.props.product.product;
    const text = `Product ${exist ? 'changed' : 'added'} corectly.`;

    Snackbar.show(text, {duration: Snackbar.LONG});
    this.context.navigator.to('productDetail', '', { barcode });
  }

  save(props){
    const { product } = this.props.product;

    const mutation = new ProductMutation({
      ...props,
      product
    });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this._onSuccess
    });
  }

  render(){
    const { fields: { name, description }, handleSubmit } = this.props;
    const { product } = this.props.product;
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
          placeholderTextColor={'#BCBDBE'}
          {...name}
          style={styles.input}
        />
        <TextInput
          {...description}
          placeholder={'Description...'}
          multiline={true}
          numberOfLine={4}
          placeholderTextColor={'#BCBDBE'}
          style={[styles.input, {height: 138, paddingTop: -80}]}
        />
        <View style={styles.row}>
          <Button
            text='Save'
            color='green'
            onPress={handleSubmit(this.save)}
          />
        </View>
      </ScrollView>
    );
  }
}

const validate = (values) => {
  let errors = {};

  if(!values.name){
    errors.name = 'Enter a name';
  }
  if(!values.description){
    errors.description = 'Enter a description';
  }
  return errors;
};


ManageProduct = reduxForm({
  form: 'ManageProduct',
  fields: ['name', 'description'],
  validate
})(ManageProduct);

const mapStateToProps = ({ product }) => ({ initialValues: product });

ManageProduct = connect(mapStateToProps, { load })(ManageProduct);

ManageProduct = Relay.createContainer(ManageProduct, {
  initialVariables: {
    barcode: ''
  },
  fragments: {
    // conflict props with redux store
    product: () => Relay.QL`
      fragment on Store {
        product(barcode: $barcode){
          id
          barcode
          name
          description
          image
          views
          exist
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
