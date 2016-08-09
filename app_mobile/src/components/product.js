import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import Relay from 'react-relay';


class Product extends Component {

  static contextTypes = {
    navigator: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props);
  }

  onPress(barcode){
    this.context.navigator.to('productDetail', '', { barcode });
  }

  render(){
    const { product } = this.props;
    return (
      <TouchableOpacity onPress={() => this.onPress(product.barcode)} style={styles.container}>
        <View>
          <Image
            source={{uri: product.image}}
            style={styles.image}
            resizeMode='contain'
          />
        </View>
        <View style={styles.column}>
          <Text>{product.name}</Text>
          <Text>Views: {product.views}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

Product = Relay.createContainer(Product, {
  fragments:  {
    product: () => Relay.QL`
      fragment on Product {
        id
        name
        views
        image
        barcode
      }
    `
  }
});

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10
  },
  column: {
    flexDirection: 'column'
  },
  image: {width: 70, height: 70}
};

export default Product;
