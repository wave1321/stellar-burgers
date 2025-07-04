import orderSlice, { clearOrder } from '../order';
import { ORDER_SLICE_NAME } from '../sliceNames';
import type { TOrder } from '../../../utils/types';

describe('orderSlice', () => {
  const initialState = {
    currentOrder: null,
    loading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    name: 'Order 1',
    number: 1234,
    createdAt: '2025-07-04',
    updatedAt: '2025-07-04'
  };

  describe('clearOrder action', () => {
    it('Очистка заказа', () => {
      const stateWithOrder = {
        ...initialState,
        currentOrder: mockOrder
      };
      const state = orderSlice(stateWithOrder, clearOrder());
      expect(state.currentOrder).toBeNull();
    });
  });

  describe('createOrder actions', () => {
    it('Состояние ожидания', () => {
      const action = { type: `${ORDER_SLICE_NAME}/create/pending` };
      const state = orderSlice(initialState, action);
      expect(state).toEqual({
        currentOrder: null,
        loading: true,
        error: null
      });
    });

    it('Состояние успеха', () => {
      const action = {
        type: `${ORDER_SLICE_NAME}/create/fulfilled`,
        payload: { order: mockOrder }
      };
      const state = orderSlice({ ...initialState, loading: true }, action);
      expect(state).toEqual({
        currentOrder: mockOrder,
        loading: false,
        error: null
      });
    });

    it('Состояние ошибки', () => {
      const errorMessage = 'Create order failed';
      const action = {
        type: `${ORDER_SLICE_NAME}/create/rejected`,
        error: { message: errorMessage }
      };
      const state = orderSlice({ ...initialState, loading: true }, action);
      expect(state).toEqual({
        currentOrder: null,
        loading: false,
        error: errorMessage || 'Невозможно создать заказ'
      });
    });

    describe('fetchOrderByNumber actions', () => {
      it('Состояние ожидания', () => {
        const action = { type: `${ORDER_SLICE_NAME}/fetchByNumber/pending` };
        const state = orderSlice(initialState, action);
        expect(state).toEqual({
          currentOrder: null,
          loading: true,
          error: null
        });
      });

      it('Состояние успеха', () => {
        const action = {
          type: `${ORDER_SLICE_NAME}/fetchByNumber/fulfilled`,
          payload: mockOrder
        };
        const state = orderSlice({ ...initialState, loading: true }, action);
        expect(state).toEqual({
          currentOrder: mockOrder,
          loading: false,
          error: null
        });
      });

      it('Состояние ошибки', () => {
        const errorMessage = 'Fetch order failed';
        const action = {
          type: `${ORDER_SLICE_NAME}/fetchByNumber/rejected`,
          error: { message: errorMessage }
        };
        const state = orderSlice({ ...initialState, loading: true }, action);
        expect(state).toEqual({
          currentOrder: null,
          loading: false,
          error: errorMessage || 'Невозможно получить заказ'
        });
      });
    });
  });
});
