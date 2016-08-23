import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Relay from 'react-relay';
import Icon from 'react-native-vector-icons/MaterialIcons';


const B = (props) => {
  return <Text style={{fontWeight: '600'}}>{props.children}</Text>;
};


class ProductDetail extends Component {

  static contextTypes = {
    navigator: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress(barcode){
    this.context.navigator.to('manageProduct', '', { barcode });
  }

  renderBody(product){
    if(product.exist){
      return (
        <View>
          <Text><B>Name:</B> {product.name}</Text>
          <Text><B>Description:</B> {product.description}</Text>
          <Text><B>Views:</B> {product.views}</Text>
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={() => this.onPress(product.barcode)} style={styles.column}>
        <Icon
          name='add'
          color='#8D8D8D'
          size={40}
        />
        <Text
          style={{textAlign: 'center'}}>
            Product was not added yet.{'\n'}Tap do add product.
        </Text>
      </TouchableOpacity>
    );
  }

  render(){
    const { product } = this.props.store;
    return (
      <ScrollView style={styles.container}>
        <Image
          source={{uri: product.image}}
          style={styles.image}
          resizeMode='contain'
        />
        <Text><B>Barcode:</B> {product.barcode}</Text>
        {this.renderBody(product)}
      </ScrollView>
    );
  }
}

ProductDetail = Relay.createContainer(ProductDetail, {
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
          exist
        }
      }
    `
  }
});

const styles = {
  container: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 15
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 15,
    alignSelf: 'center'
  }
};

export default ProductDetail;
