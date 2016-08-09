import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';

export default class BarcodeScannerApp extends Component {

  static contextTypes = {
    navigator: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props);

    this.barcodeReceived = this.barcodeReceived.bind(this);
  }

  barcodeReceived(e){
    this.context.navigator.to('productDetail', '', {barcode: e.data});
  }

  render(){
    return (
      <BarcodeScanner
        onBarCodeRead={this.barcodeReceived}
        viewFinderBorderWidth={Dimensions.get('window').width}
        viewFinderBorderLength={Dimensions.get('window').height}
        viewFinderBorderColor={'transparent'}
        style={{flex: 1}}
        torchMode='off'
        cameraType='back'
      />
    );
  }
}
