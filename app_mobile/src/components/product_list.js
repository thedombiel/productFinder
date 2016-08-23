import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  ActivityIndicator
} from 'react-native';
import Relay from 'react-relay';

import Product from './product';
import ProgressBar from './progress_bar';


class ProductList extends Component {
  constructor(props){
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows(this.props.store.products.edges),
      isLoading: false
    };

    // this.props.relay.onReadyStateChange = () => console.warn('Yeah');

    this.loadMore = this.loadMore.bind(this);
    this.renderActivityIndicator = this.renderActivityIndicator.bind(this);
  }

  componentWillMount(){
    setTimeout(this.loadMore);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.store !== this.props.store){
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.props.store.products.edges)
      });
     }
  }

  loadMore(){
    const { first } = this.props.relay.variables;

    this.props.relay.setVariables({
      first: first + 5
    }, ({ready, done, error, aborted}) => {
      this.setState({isLoading: !ready && !(done || error || aborted)});
    });
  }

  renderRow(product, sectionID, rowID){
    return <Product product={product.node} />;
  }

  renderActivityIndicator(){
    const { isLoading } = this.state;

    if(isLoading)
      return <ActivityIndicator
               style={{ margin: 30}}
               size='small'
               color='rgba(192, 192, 192, 0.5)'
             />;

    return null;
  }

  render(){
    const  { hasNextPage } = this.props.store.products.pageInfo;
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          onEndReached={() => hasNextPage ? this.loadMore() : null}
        />
        {this.renderActivityIndicator()}
      </View>
    );
  }
}

ProductList = Relay.createContainer(ProductList, {
  shouldComponentUpdate: ()=> true,
  initialVariables: {
    q: '',
    first: 5
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        products(q: $q, first: $first){
          edges {
            node {
              ${Product.getFragment('product')}
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `
  }
});


export default ProductList;
