import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TUser } from '../../utils/types';
import { USER_SLICE_NAME } from './sliceNames';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { UserResponse, UserResponseToken } from '../../utils/types';
import { createAppAsyncThunk } from '../hooks';
import { isActionPending, isActionRejected } from '../../utils/redux';
import { TLoginData, TRegisterData } from '@api';

export const checkUserAuth = createAppAsyncThunk<UserResponse, void>(
  `${USER_SLICE_NAME}/checkUserAuth`,
  async (_, { extra }) => await extra.getUserApi()
);

export const registerUser = createAppAsyncThunk<
  UserResponseToken,
  TRegisterData
>(`${USER_SLICE_NAME}/registerUser`, async (dataUser, { extra }) => {
  const data = await extra.registerUserApi(dataUser);
  setCookie('accessToken', data.accessToken);
  setCookie('refreshToken', data.refreshToken);
  return data;
});

export const loginUser = createAppAsyncThunk<UserResponseToken, TLoginData>(
  `${USER_SLICE_NAME}/loginUser`,
  async (dataUser, { extra }: any) => {
    const data = await extra.loginUserApi(dataUser);
    setCookie('accessToken', data.accessToken);
    setCookie('refreshToken', data.refreshToken);
    return data;
  }
);

export const logoutUser = createAppAsyncThunk(
  `${USER_SLICE_NAME}/logout`,
  async (_, { extra }) => {
    try {
      await extra.logoutApi();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
);

export const updateUser = createAppAsyncThunk(
  `${USER_SLICE_NAME}/update`,
  async (userData: Partial<TRegisterData>, { extra }) => {
    const res = await extra.updateUserApi(userData);
    return res.user;
  }
);

export const sliceName = 'user';

export interface TUserState {
  isAuthChecked: boolean;
  data: TUser | null;
  requestStatus: RequestStatus;
}

const initialState: TUserState = {
  isAuthChecked: false,
  data: null,
  requestStatus: RequestStatus.Idle
};

export const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.requestStatus = RequestStatus.Success;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.requestStatus = RequestStatus.Success;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.requestStatus = RequestStatus.Success;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.isAuthChecked = true;
        state.requestStatus = RequestStatus.Idle;
      })
      .addMatcher(isActionPending(USER_SLICE_NAME), (state) => {
        state.requestStatus = RequestStatus.Loading;
      })
      .addMatcher(isActionRejected(USER_SLICE_NAME), (state) => {
        state.requestStatus = RequestStatus.Failed;
      });
  },
  selectors: {
    getUser: (state) => state.data,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getRequestStatus: (state) => state.requestStatus
  }
});

export default userSlice.reducer;

export const userActions = userSlice.actions;
export const userSelectors = userSlice.selectors;
