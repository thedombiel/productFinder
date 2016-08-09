import React from 'react';
import {
  Text,
  TouchableOpacity
} from 'react-native';


const Button = (props) => {
  const backgroundColor = props.color ? props.color : '#CB0049';
	return (
      <TouchableOpacity
        onPress={props.onPress}
        style={[styles.button, props.style, { backgroundColor }]}
      >
        <Text style={styles.buttonText}>
          {props.text}
        </Text>
      </TouchableOpacity>
	);
};

const styles = {
	button: {
		flex: 1,
		height: 42,
		marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
	},
	buttonText: {
		color: '#FFF',
		fontWeight: '500'
	}
};

export default Button;
