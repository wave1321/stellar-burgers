import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { FC, useEffect } from 'react';
import {
  checkUserAuth,
  userActions,
  userSelectors
} from '../../storage/slices/user';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
  useMatch
} from 'react-router-dom';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useAppDispatch, useAppSelector } from '../../storage/hooks';
import { Preloader } from '../ui/preloader';

import { fetchIngredients } from '../../storage/slices/ingredients';
import { deleteCookie, getCookie } from '../../utils/cookie';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: JSX.Element;
}

const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const user = useAppSelector(userSelectors.getUser);
  const isAuthChecked = useAppSelector(userSelectors.getIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to='/' replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

function AppRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const background = location.state?.background;
  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
                onClose={() => {
                  navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title={'Описание ингредиента'}
                onClose={() => {
                  navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
                  onClose={() => {
                    navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
}

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = getCookie('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken || refreshToken) {
        try {
          await dispatch(checkUserAuth()).unwrap();
        } catch (error) {
          console.error('Authentication failed:', error);
          // Очищаем токены при ошибке аутентификации
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      // Устанавливаем флаг проверки аутентификации
      dispatch(userActions.authCheck());
    };

    initAuth();
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppRouter />
    </div>
  );
};

export default App;
