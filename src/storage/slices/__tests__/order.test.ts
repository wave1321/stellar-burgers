import orderSlice, {
  clearOrder,
  createOrder,
  fetchOrderByNumber
} from '../order';
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
      const pendingAction = createOrder.pending('', ['ing1', 'ing2']);
      const state = orderSlice(initialState, pendingAction);
      expect(state).toEqual({
        currentOrder: null,
        loading: true,
        error: null
      });
    });

    it('Состояние успеха', () => {
      const fulfilledAction = createOrder.fulfilled(
        {
          order: mockOrder,
          success: true,
          name: ''
        },
        '',
        ['ing1', 'ing2']
      );
      const state = orderSlice(
        { ...initialState, loading: true },
        fulfilledAction
      );
      expect(state).toEqual({
        currentOrder: mockOrder,
        loading: false,
        error: null
      });
    });

    it('Состояние ошибки', () => {
      const errorMessage = 'Невозможно создать заказ';
      const rejectedAction = createOrder.rejected(new Error(errorMessage), '', [
        'ing1',
        'ing2'
      ]);
      const state = orderSlice(
        { ...initialState, loading: true },
        rejectedAction
      );
      expect(state).toEqual({
        currentOrder: null,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('fetchOrderByNumber actions', () => {
    it('Состояние ожидания', () => {
      const pendingAction = fetchOrderByNumber.pending('', 1234);
      const state = orderSlice(initialState, pendingAction);
      expect(state).toEqual({
        currentOrder: null,
        loading: true,
        error: null
      });
    });

    it('Состояние успеха', () => {
      const fulfilledAction = fetchOrderByNumber.fulfilled(mockOrder, '', 1234);
      const state = orderSlice(
        { ...initialState, loading: true },
        fulfilledAction
      );
      expect(state).toEqual({
        currentOrder: mockOrder,
        loading: false,
        error: null
      });
    });

    it('Состояние ошибки', () => {
      const errorMessage = 'Невозможно получить заказ';
      const rejectedAction = fetchOrderByNumber.rejected(
        new Error(errorMessage),
        '',
        1234
      );
      const state = orderSlice(
        { ...initialState, loading: true },
        rejectedAction
      );
      expect(state).toEqual({
        currentOrder: null,
        loading: false,
        error: errorMessage
      });
    });
  });
});
