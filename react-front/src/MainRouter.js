import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Nav from './core/Nav';
import Home from './core/Home';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import Settings from './user/Settings';
import Users from './user/Users';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';
import NewPost from './post/NewPost';
import EditPost from './post/EditPost';
import Post from './post/Post';
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import SidebarNav from './core/SidebarNav';
import {Box, Paper, Container} from '@material-ui/core'
import { isAuthenticated } from './auth';


const toggleDrawer = () => {
  return null
}

const MainRouter = (props) => (
  <div>
    <Nav 
      toggleDrawer = {toggleDrawer}
      update_theme = {props.update_theme}
      theme = {props.theme}
      change_theme = {props.change_theme}
    />
    <Switch >
      <Route exact path='/' render={()=>{return(<Home update_theme={props.update_theme}/>)}}></Route>
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route
        exact
        path="/reset-password/:resetPasswordToken"
        component={ResetPassword}
      />
      <Route exact path='/users' component={Users}></Route>
      <Route exact path='/signup' render={()=>{return(<Signup update_theme={props.update_theme}/>)}}></Route>
      <Route exact path='/login' render={()=>{return(<Signin update_theme={props.update_theme}/>)}}></Route>
      <PrivateRoute exact path='/post/create' component={NewPost}></PrivateRoute>
      <PrivateRoute exact path='/post/edit/:postId' component={EditPost}></PrivateRoute>
      <Route exact path='/post/:postId' component={Post}></Route>
      <PrivateRoute exact path='/user/:userId/settings' component={Settings} update_theme={props.update_theme} theme={props.theme}></PrivateRoute>
      <PrivateRoute exact path='/user/:userId' component={Profile}></PrivateRoute>
      <PrivateRoute exact path='/user/edit/:userId' component={EditProfile}></PrivateRoute>
    </Switch>
  </div>
)

export default MainRouter;
