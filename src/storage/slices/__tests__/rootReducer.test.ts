import rootReducer from '..';
import { combineReducers } from 'redux';
import { userSlice } from '../user';
import { burgerSlice } from '../burger';
import { feedSlice } from '../feed';
import { ingredientsSlice } from '../ingredients';
import { orderSlice } from '../order';
import { userOrdersSlice } from '../userOrders';

describe('rootReducer', () => {
  it('Инициализация rootReducer', () => {
    const expectedReducer = combineReducers({
      [userSlice.name]: userSlice.reducer,
      [burgerSlice.name]: burgerSlice.reducer,
      [feedSlice.name]: feedSlice.reducer,
      [ingredientsSlice.name]: ingredientsSlice.reducer,
      [orderSlice.name]: orderSlice.reducer,
      [userOrdersSlice.name]: userOrdersSlice.reducer
    });

    // Получаем ключи из оригинального и ожидаемого редьюсеров
    const originalReducerKeys = Object.keys(
      rootReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );
    const expectedReducerKeys = Object.keys(
      expectedReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );

    // Проверяем, что ключи совпадают
    expect(originalReducerKeys).toEqual(expectedReducerKeys);
  });
});
