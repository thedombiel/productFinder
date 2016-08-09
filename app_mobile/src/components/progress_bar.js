import React from 'react';
import {
  View,
  ActivityIndicator
} from 'react-native';

const ProgressBar = (props) => {
  const { position } = props;
  return (
      <View style={styles.container}>
      <View style={[styles.row, {flex: 2}]}>
      <ActivityIndicator size='large' color='rgba(192, 192, 192, 0.5)' />
      </View>
      {props.position==='low'&& <View style={styles.row} />}
      {props.position==='high'&& <View style={[styles.row, { flex: 4} ]} />}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressBar: {
  }
};

export default ProgressBar;
