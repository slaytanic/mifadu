import { WORKSHOPS_HAS_LOADED, WORKSHOPS_IS_LOADING } from '../actions/action-types';

const initialState = {
  all: [],
};

const workshopsReducer = (state = initialState, action) => {
  switch (action.type) {
    case WORKSHOPS_IS_LOADING:
      return { ...state, ...action.payload };
    case WORKSHOPS_HAS_LOADED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default workshopsReducer;
