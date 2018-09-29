import { combineReducers } from 'redux';
import currentUserReducer from './current-user';
import assignmentsReducer from './assignments';
import tagsReducer from './tags';
import subjectsReducer from './subjects';
import workshopsReducer from './workshops';
import usersReducer from './users';

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  assignments: assignmentsReducer,
  tags: tagsReducer,
  subjects: subjectsReducer,
  workshops: workshopsReducer,
  users: usersReducer,
});

export default rootReducer;
