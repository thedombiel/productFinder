import * as types from './const';

export const load = ({ name, description }) => {
  return {
    type: types.LOAD_POST,
    data: { name, description }
  };
};

