import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Nav from './core/Nav';
import Home from './core/Home';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import Users from './user/Users';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';
import NewPost from './post/NewPost';




const MainRouter = () => (
  <div>
    <Nav />
    <Switch>
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/users' component={Users}></Route>
      <Route exact path='/signup' component={Signup}></Route>
      <Route exact path='/login' component={Signin}></Route>
      <PrivateRoute exact path='/user/:userId' component={Profile}></PrivateRoute>
      <PrivateRoute exact path='/user/edit/:userId' component={EditProfile}></PrivateRoute>
      <PrivateRoute exact path='/post/create' component={NewPost}></PrivateRoute>

    </Switch>
  </div>
)

export default MainRouter;
