import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} from 'graphql';

import {
  // nodeDefinitions,
  // globalIdField,
  // fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay';

import ProductModel from './models.js';
import { searchImage } from './search_image';

// const { nodeInterface, nodeField } = nodeDefinitions(
//   globalId => {
//     const { type, id } = fromGlobalId(globalId);

//     if(type === 'Product')
//       return ProductModel.findOne({_id: id});

//     return null;
//   },
//   obj => {
//     return Product;
//   }
// );

const ProductType = new GraphQLObjectType({
  name: 'Product',
  description: 'Product',
  fields(){
    return {
      id: {
        type: GraphQLString,
        description: 'The product unique id.',
        resolve: (product) => {
          return product._id;
        }
      },
      barcode: {
        type: GraphQLString,
        description: 'Product barcode'
      },
      name: {
        type: GraphQLString,
        description: 'Name of product'
      },
      description: {
        type: GraphQLString,
        description: 'Description of product'
      },
      image: {
        type: GraphQLString,
        description: 'Image of product',
        resolve: (product) => {
          if(product.image){
            return product.image;
          }
          return searchImage(product.barcode);
        }
      },
      views: {
        type: GraphQLInt,
        description: 'Amount of product views'
      }
    };
  }
  // interfaces: [nodeInterface]
});

const StoreType = new GraphQLObjectType({
  name: 'Store',
  description: 'Store of products',
  fields(){
    return {
      products: {
        type: new GraphQLList(ProductType),
        args: {
          count: {
            type: GraphQLInt
          },
          q: {
            type: GraphQLString
          }
        },
        resolve: (_, { count, q }) => {
          if(q){
            return ProductModel.find({ '$text': {$search: q } }).skip(0).limit(10)
              .then(data => {
                console.log(data);
                return data;
              });
          }
          return ProductModel.find({}).skip(0).limit(10)
            .then(data => {
              console.log(data);
              return data;
            });
        }
      },
      product: {
        type: ProductType,
        args: {
          barcode: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (_, { barcode }) => {
          return ProductModel.findOneAndUpdate(
            { barcode },
            { $inc: {views: 1}},
            { new: true}
          )
            .then(product => {
              if(!product){
                return searchImage(barcode).then(image => ({
                  image, barcode
                }))
                // if no image
                  .catch(() => ({ barcode }));
              }
              return product;
            });
        }
      }
    };
  }
});

const productMutation = mutationWithClientMutationId({
  name: 'Productmutations',
  description: 'Inserting new products, and changing existing.',
  inputFields: {
    barcode: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    }
  },
  outputFields: {
    product: {
      type: ProductType,
      resolve: (product) => {
        return product;
      }
    }
  },
  mutateAndGetPayload({barcode, name, description}){
    console.log(barcode, ' ', name, ' ', description);
    return searchImage(barcode).then(image => {
      return new ProductModel({
        barcode, name, description, image
      }).save();
    });
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query',
  fields(){
    return {
      // node: nodeField,
      store: {
        type: StoreType,
        resolve: () => ({})
      }
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'GrapQLMutationForProduct',
  description: 'Product mutation',
  fields(){
    return {
      createProduct: productMutation
    };
  }
});


export default new GraphQLSchema({query: Query, mutation: Mutation});
