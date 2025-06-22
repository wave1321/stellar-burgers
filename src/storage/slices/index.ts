import { combineReducers } from 'redux';
import { userSlice } from './user';
import { burgerSlice } from './burger';
import { feedSlice } from './feed';
import { ingredientsSlice } from './ingredients';
import { orderSlice } from './order';
import { userOrdersSlice } from './userOrders';

const rootReducer = combineReducers({
  [userSlice.name]: userSlice.reducer,
  [burgerSlice.name]: burgerSlice.reducer,
  [feedSlice.name]: feedSlice.reducer,
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [userOrdersSlice.name]: userOrdersSlice.reducer
});

export default rootReducer;
