import { SUBJECTS_HAS_LOADED, SUBJECTS_IS_LOADING } from '../actions/action-types';

const initialState = {
  all: [],
};

const subjectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBJECTS_IS_LOADING:
      return { ...state, ...action.payload };
    case SUBJECTS_HAS_LOADED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default subjectsReducer;
