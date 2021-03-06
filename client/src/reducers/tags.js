import { TAGS_HAS_LOADED, TAGS_IS_LOADING, TAG_CREATED } from '../actions/action-types';

const initialState = {
  all: [],
};

const tagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case TAGS_IS_LOADING:
      return { ...state, ...action.payload };
    case TAGS_HAS_LOADED:
      return { ...state, ...action.payload };
    case TAG_CREATED:
      return { ...state, all: [...state.all, action.payload] };
    default:
      return state;
  }
};

export default tagsReducer;
