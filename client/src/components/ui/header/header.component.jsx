import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/actions/user.actions';

import Button from '../button/button.component';

import classes from './header.module.css';

const Header = () => {
  const isAuth = useSelector(state => state.user.isAuth);
  const dispatch = useDispatch();

  const onLogoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header className={classes.header}>
      <div className={classes.brand}>
        <Link to="/">Academlo Blog</Link>
      </div>

      {isAuth && (
        <nav className={classes.navigation}>
          {/* TODO: SET USER ID */}
          <Link className={classes['navigation__link']} to="/profile/1">
            Profile
          </Link>
          <Button
            className={classes['navigation__link']}
            onClick={onLogoutHandler}
          >
            Logout
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
