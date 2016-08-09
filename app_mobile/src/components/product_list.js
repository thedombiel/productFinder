import React, { Component } from 'react';
import {
  View,
  ListView
} from 'react-native';
import Relay from 'react-relay';
import Product from './product';

class ProductList extends Component {
  constructor(props){
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows(this.props.store.products)
    };

    this.loadMore = this.loadMore.bind(this);
  }

  componentWillReceiveProps(nextProps){
    // if(nextProps.store !== this.props.store){
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.props.store.products)
      });
    // }
  }

  loadMore(){
    const { count } = this.props.relay.variables;

    this.props.relay.setVariables({
      count: count + 3
    });
  }

  renderRow(product, sectionID, rowID){
    return <Product product={product} />;
  }

  render(){
    const products = this.props.store;
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
    );
  }
}

ProductList = Relay.createContainer(ProductList, {
  shouldComponentUpdate: ()=> true,
  initialVariables: {
    q: ''
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        products(q: $q){
          ${Product.getFragment('product')}
        }
      }
    `
  }
});


export default ProductList;
