import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";

const friendsLoad = "friends/load";

function friendsReducer(state = { list: undefined }, action) {
  switch (action.type) {
    case friendsLoad:
      return { ...state, list: action.friends || [] };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  friends: friendsReducer,
});

export default createStore(rootReducer, applyMiddleware(thunk));
