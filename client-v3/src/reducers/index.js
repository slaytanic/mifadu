import { combineReducers } from 'redux';
import currentUserReducer from './current-user';

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
});

export default rootReducer;
