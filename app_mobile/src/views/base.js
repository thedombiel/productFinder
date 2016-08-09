import React, { Component } from 'react';

import { ProgressBar } from '../components';
import Snackbar from 'react-native-android-snackbar';
export default class Base extends Component {

  constructor(props){
    super(props);
  }

  errorSnack(error, retry){
    Snackbar.show(error.message, {
      actionLabel: 'Retry',
      actionCallback: retry
    });
  }

  loading(){
    return <ProgressBar />;
  }
}
