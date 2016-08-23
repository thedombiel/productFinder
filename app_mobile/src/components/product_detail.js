import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Relay from 'react-relay';
import ActionButton from 'react-native-action-button';
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
        <Text
          style={{textAlign: 'center', marginTop: 20}}>
            Product was not added yet.
        </Text>
    );
  }

  render(){
    const { product } = this.props.store;
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image
            source={{uri: product.image}}
            style={styles.image}
            resizeMode='contain'
          />
          <Text><B>Barcode:</B> {product.barcode}</Text>
          {this.renderBody(product)}
        </ScrollView>
        <ActionButton
          icon={
            <Icon
              name={product.exist ? "mode-edit" : "add"}
              size={20}
              color="#fff" />
          }
          buttonColor={ product.exist ? "#2C83D2" : "rgba(231,76,60,1)"}
          onPress={() => this.onPress(product.barcode)}
        />
      </View>
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
    padding: 15
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
  },
  action: {
    position: 'absolute',
    bottom: 20
  }
};

export default ProductDetail;
