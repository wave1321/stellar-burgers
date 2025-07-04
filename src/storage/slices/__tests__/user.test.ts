import { createAction } from '@reduxjs/toolkit';
import userSlice, { userActions } from '../user';
import { RequestStatus, TUser } from '../../../utils/types';
import { USER_SLICE_NAME } from '../sliceNames';

export interface TUserState {
  isAuthChecked: boolean;
  data: TUser | null;
  requestStatus: RequestStatus;
}

describe('userSlice', () => {
  const initialState: TUserState = {
    isAuthChecked: false,
    data: null,
    requestStatus: RequestStatus.Idle
  };

  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('authCheck action', () => {
    it('Прверяем успешную аутентификацию', () => {
      const action = userActions.authCheck();
      const state = userSlice(initialState, action);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('extraReducers cases', () => {
    it('Проверяем checkUserAuth.fulfilled', () => {
      const action = {
        type: `${USER_SLICE_NAME}/checkUserAuth/fulfilled`,
        payload: { user: mockUser }
      };
      const state = userSlice(initialState, action);
      expect(state.data).toEqual(mockUser);
      expect(state.requestStatus).toBe(RequestStatus.Success);
    });

    it('Проверяем registerUser.fulfilled', () => {
      const action = {
        type: `${USER_SLICE_NAME}/registerUser/fulfilled`,
        payload: { user: mockUser }
      };
      const state = userSlice(initialState, action);
      expect(state.data).toEqual(mockUser);
      expect(state.requestStatus).toBe(RequestStatus.Success);
    });

    it('Проверяем loginUser.fulfilled', () => {
      const action = {
        type: `${USER_SLICE_NAME}/loginUser/fulfilled`,
        payload: { user: mockUser }
      };
      const state = userSlice(initialState, action);
      expect(state.data).toEqual(mockUser);
      expect(state.requestStatus).toBe(RequestStatus.Success);
    });

    it('Проверяем logoutUser.fulfilled', () => {
      const action = { type: `${USER_SLICE_NAME}/logout/fulfilled` };
      const state = userSlice({ ...initialState, data: mockUser }, action);
      expect(state.data).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.requestStatus).toBe(RequestStatus.Success);
    });
  });

  describe('extraReducers matchers', () => {
    it('Проверяем requestStatus когда загрузка', () => {
      const pendingAction = createAction(
        `${USER_SLICE_NAME}/anyAction/pending`
      )();
      const state = userSlice(initialState, pendingAction);
      expect(state.requestStatus).toBe(RequestStatus.Loading);
    });

    it('Проверяем requestStatus когда ошибка', () => {
      const rejectedAction = createAction(
        `${USER_SLICE_NAME}/anyAction/rejected`
      )();
      const state = userSlice(initialState, rejectedAction);
      expect(state.requestStatus).toBe(RequestStatus.Failed);
    });
  });
});
