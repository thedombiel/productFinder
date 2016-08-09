export default {
  home: {
    initialRoute: true,
    title: 'Home',
    component: require('./views/home').default
  },
  barcodeScanner: {
    title: 'Scann',
    component: require('./views/barcode_scanner').default
  },
  productDetail: {
    title: '',
    component: require('./views/product_detail').default
  },
  manageProduct: {
    title: '',
    component: require('./views/product_manage').default
  },
  search: {
    title: '',
    component: require('./views/search').default
  }
};
