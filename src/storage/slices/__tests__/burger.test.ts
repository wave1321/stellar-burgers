import burgerSlice, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearBurger
} from '../burger';
import type { TIngredient, TConstructorIngredient } from '../../../utils/types';
import { BURGER_SLICE_NAME } from '../sliceNames';

describe(`${BURGER_SLICE_NAME} slice`, () => {
  const mockBun: TIngredient = {
    _id: '60d3b41abdacab0026a733c6',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const mockMain: TIngredient = {
    _id: '60d3b41abdacab0026a733c7',
    name: 'Флюоресцентная булка R2-D3',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
  };

  describe('addIngredient action', () => {
    it('Добавление булки', () => {
      const action = addIngredient(mockBun);
      const result = burgerSlice(undefined, action);

      expect(result.bun).toEqual({
        ...mockBun,
        id: expect.any(String)
      });
      expect(result.ingredients).toHaveLength(0);
    });

    it('Добавление ингредиента', () => {
      const action = addIngredient(mockMain);
      const result = burgerSlice(undefined, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual({
        ...mockMain,
        id: expect.any(String)
      });
    });
  });

  describe('removeIngredient action', () => {
    it('Удаление ингредиента', () => {
      const addAction = addIngredient(mockMain);
      let state = burgerSlice(undefined, addAction);
      const ingredientId = state.ingredients[0].id;

      const removeAction = removeIngredient(ingredientId);
      state = burgerSlice(state, removeAction);

      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('moveIngredient action', () => {
    const initialStateWithIngredients = {
      bun: null,
      ingredients: [
        { ...mockMain, id: '1' },
        { ...mockMain, id: '2' },
        { ...mockMain, id: '3' }
      ]
    };

    it('Перемещение первого ингредиента вниз', () => {
      const action = moveIngredient({ fromIndex: 0, toIndex: 2 });
      const result = burgerSlice(initialStateWithIngredients, action);

      expect(
        result.ingredients.map((i: TConstructorIngredient) => i.id)
      ).toEqual(['2', '3', '1']);
    });

    it('Перемещение последнего ингредиента наверх', () => {
      const action = moveIngredient({ fromIndex: 2, toIndex: 0 });
      const result = burgerSlice(initialStateWithIngredients, action);

      expect(
        result.ingredients.map((i: TConstructorIngredient) => i.id)
      ).toEqual(['3', '1', '2']);
    });
  });

  describe('clearBurger action', () => {
    it('Возврат к начальному состоянию', () => {
      const stateWithItems = {
        bun: mockBun,
        ingredients: [{ ...mockMain, id: '1' }]
      };
      const result = burgerSlice(stateWithItems, clearBurger());

      expect(result).toEqual({
        bun: null,
        ingredients: []
      });
    });
  });
});
