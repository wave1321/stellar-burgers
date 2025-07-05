import userSlice, {
  userActions,
  checkUserAuth,
  registerUser,
  loginUser,
  logoutUser
} from '../user';
import type { TUser } from '../../../utils/types';
import { RequestStatus } from '../../../utils/types';

describe('userSlice', () => {
  const initialState = {
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

  describe('async thunks reducers', () => {
    it('Проверяем checkUserAuth.fulfilled', () => {
      const action = checkUserAuth.fulfilled(
        {
          user: mockUser,
          success: false
        },
        ''
      );
      const state = userSlice(initialState, action);
      expect(state.data).toEqual(mockUser);
      expect(state.requestStatus).toBe(RequestStatus.Success);
    });

    it('Проверяем registerUser.fulfilled', () => {
      const action = registerUser.fulfilled(
        {
          user: mockUser,
          accessToken: 'token',
          refreshToken: 'refresh',
          success: false
        },
        '',
        { email: 'test@test.com', password: '123456', name: 'Test' }
      );
      const state = userSlice(initialState, action);
      expect(state.data).toEqual(mockUser);
      expect(state.requestStatus).toBe(RequestStatus.Success);
    });

    it('Проверяем loginUser.fulfilled', () => {
      const action = loginUser.fulfilled(
        {
          user: mockUser,
          accessToken: 'token',
          refreshToken: 'refresh',
          success: false
        },
        '',
        { email: 'test@test.com', password: '123456' }
      );
      const state = userSlice(initialState, action);
      expect(state.data).toEqual(mockUser);
      expect(state.requestStatus).toBe(RequestStatus.Success);
    });

    it('Проверяем logoutUser.fulfilled', () => {
      const action = logoutUser.fulfilled(undefined, '');
      const state = userSlice({ ...initialState, data: mockUser }, action);
      expect(state.data).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.requestStatus).toBe(RequestStatus.Success);
    });
  });

  describe('requestStatus matchers', () => {
    it('Проверяем requestStatus когда загрузка', () => {
      const pendingAction = checkUserAuth.pending('');
      const state = userSlice(initialState, pendingAction);
      expect(state.requestStatus).toBe(RequestStatus.Loading);
    });

    it('Проверяем requestStatus когда ошибка', () => {
      const rejectedAction = checkUserAuth.rejected(new Error('Error'), '');
      const state = userSlice(initialState, rejectedAction);
      expect(state.requestStatus).toBe(RequestStatus.Failed);
    });
  });
});
