import Relay, { Mutation } from 'react-relay';


export default class ProductMutation extends Mutation {

  static fragments = {
    product: () => Relay.QL`
      fragment on Product {
        barcode
        exist
      }
    `,
  };

  getMutation(){
    return this.props.product.exist
      ? Relay.QL`mutation { editProduct }`
      : Relay.QL`mutation { createProduct }`
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
    return {
      name: this.props.name,
      description: this.props.description,
      barcode: this.props.product.barcode
    };
  }

  // getOptimisticResponse(){
    
  // }
}
