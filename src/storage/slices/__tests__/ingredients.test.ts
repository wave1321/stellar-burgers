import { INGREDIENTS_SLICE_NAME } from '../sliceNames';
import type { TIngredient } from '../../../utils/types';
import ingredientsSlice from '../ingredients';

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
      const action = {
        type: `${INGREDIENTS_SLICE_NAME}/fetchAll/pending`
      };
      const state = ingredientsSlice(initialState, action);
      expect(state).toEqual({
        items: [],
        loading: true,
        error: null
      });
    });

    it('Состояние успеха', () => {
      const action = {
        type: `${INGREDIENTS_SLICE_NAME}/fetchAll/fulfilled`,
        payload: mockIngredients
      };
      const state = ingredientsSlice(
        { ...initialState, loading: true },
        action
      );
      expect(state).toEqual({
        items: mockIngredients,
        loading: false,
        error: null
      });
    });

    it('Состояние ошибки', () => {
      const errorMessage = 'Network error';
      const action = {
        type: `${INGREDIENTS_SLICE_NAME}/fetchAll/rejected`,
        error: { message: errorMessage }
      };
      const state = ingredientsSlice(
        { ...initialState, loading: true },
        action
      );
      expect(state).toEqual({
        items: [],
        loading: false,
        error: errorMessage || 'Невозможно получить ингредиенты'
      });
    });
  });
});
