import { INGREDIENTS_SLICE_NAME } from '../sliceNames';
import type { TIngredient } from '../../../utils/types';
import ingredientsSlice, { fetchIngredients } from '../ingredients';

type TIngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

describe('ingredientsSlice', () => {
  const initialState: TIngredientsState = {
    items: [],
    loading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 11,
      fat: 11,
      carbohydrates: 11,
      calories: 11,
      price: 11,
      image: '',
      image_mobile: '',
      image_large: ''
    },
    {
      _id: '2',
      name: 'Котлета',
      type: 'main',
      proteins: 22,
      fat: 22,
      carbohydrates: 22,
      calories: 22,
      price: 22,
      image: '',
      image_mobile: '',
      image_large: ''
    }
  ];

  describe('fetchIngredients actions', () => {
    it('Состояние ожидания', () => {
      const pendingAction = fetchIngredients.pending('', undefined);
      const state = ingredientsSlice(initialState, pendingAction);
      expect(state).toEqual({
        items: [],
        loading: true,
        error: null
      });
    });

    it('Состояние успеха', () => {
      const fulfilledAction = fetchIngredients.fulfilled(
        mockIngredients,
        '',
        undefined
      );
      const state = ingredientsSlice(
        { ...initialState, loading: true },
        fulfilledAction
      );
      expect(state).toEqual({
        items: mockIngredients,
        loading: false,
        error: null
      });
    });

    it('Состояние ошибки', () => {
      const rejectedAction = fetchIngredients.rejected(
        new Error('Невозможно получить ингредиенты'),
        '',
        undefined
      );
      const state = ingredientsSlice(
        { ...initialState, loading: true },
        rejectedAction
      );
      expect(state).toEqual({
        items: [],
        loading: false,
        error: 'Невозможно получить ингредиенты'
      });
    });
  });
});
