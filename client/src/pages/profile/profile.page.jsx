import { useEffect } from 'react';
import { Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMyPosts, getPostsUser } from '../../store/actions/posts.actions';
import { checkToken } from '../../store/actions/user.actions';

// Components
import PostsList from '../../components/posts/posts-list/post-list.component';
import AddPostForm from '../../components/forms/add-post-form/add-post-form.component';

import classes from './profile.module.css';

const Profile = () => {
  const user = useSelector(state => state.user.user);
  const isAuth = useSelector(state => state.user.isAuth);

  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuth) dispatch(checkToken());
  }, [dispatch, isAuth]);

  const profileOwner = +params.id === user.id;
  useEffect(() => {
    if (profileOwner) {
      dispatch(getMyPosts());
    } else {
      dispatch(getPostsUser(params.id));
    }
  }, [dispatch, params.id, profileOwner]);

  if (!profileOwner) {
    return (
      <div className={classes.profile}>
        <h2>{user.name} Profile</h2>
        <PostsList />
      </div>
    );
  }

  return (
    <div className={classes.profile}>
      <Row justify="space-around">
        <Col span={6} xs={24} lg={10} pull={2}>
          <AddPostForm />
        </Col>
        <Col span={18} xs={24} lg={14}>
          <h2>{user.name} Profile</h2>
          <PostsList />
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
