import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '../../utils/types';
import { BURGER_SLICE_NAME } from './sliceNames';
import { RootState } from '..';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerSlice = createSlice({
  name: BURGER_SLICE_NAME,
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = crypto.randomUUID();
        return {
          payload: { ...ingredient, id }
        };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, removed);
    },
    clearBurger: () => initialState
  }
});

export const { addIngredient, removeIngredient, moveIngredient, clearBurger } =
  burgerSlice.actions;

export default burgerSlice.reducer;

export const selectConstructorItems = (state: RootState) => state.burger;
