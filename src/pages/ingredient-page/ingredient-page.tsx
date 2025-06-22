import { IngredientDetails } from '@components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './ingredient-page.module.css';

export const IngredientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state?.background) {
    return (
      <div className={styles.pageContainer}>
        <IngredientDetails />
      </div>
    );
  }

  return null;
};
