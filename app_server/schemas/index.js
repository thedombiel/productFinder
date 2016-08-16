import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} from 'graphql';

import {
  nodeDefinitions,
  globalIdField,
  fromGlobalId,
  mutationWithClientMutationId,
  connectionArgs,
  connectionDefinitions,
  connectionFromArray
} from 'graphql-relay';

import { connectionFromMongooseQuery } from 'relay-mongodb-connection';

import { Product } from '../models';
import { searchImage } from '../utils';

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if(type === 'Product')
      return Product.findOne({_id: id});

    return {};
  },
  (obj) => {
    if(obj instanceof Product){
      return ProductType;
    }
    return StoreType;
  }
);

const ProductType = new GraphQLObjectType({
  name: 'Product',
  description: 'Product',
  fields(){
    return {
      id: globalIdField('Product', product => product._id),
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
  },
  interfaces: [nodeInterface]
});

const { connectionType: ProductsConnection, edgeType: ProductsEdge} =
  connectionDefinitions({ name: 'Product', nodeType: ProductType });

const StoreType = new GraphQLObjectType({
  name: 'Store',
  description: 'Store of products',
  fields(){
    return {
      id: globalIdField('Store'),
      products: {
        type: ProductsConnection,
        args: {
          q: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (_, { q, ...args }) => {
          const search = q ? { '$text': {$search: q } } : {};
          return connectionFromMongooseQuery(Product.find(search), args);
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
          return Product.findOneAndUpdate(
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
  },
  interfaces: [nodeInterface]
});

const productMutation = mutationWithClientMutationId({
  name: 'Productmutations',
  description: 'Inserting new products, and changing existing.',
  inputFields: {
    barcode: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
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
    return searchImage(barcode).then(image => {
      return new Product({
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
      store: {
        type: StoreType,
        resolve: () => ({})
      },
      node: nodeField
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
