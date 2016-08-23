import * as types from '../actions/const';


const INITIAL_STATE = { name: '', description: '' };

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case types.LOAD_POST:
      return action.data;
    default:
      return state;
  }
};
