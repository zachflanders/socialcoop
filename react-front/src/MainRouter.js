import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Nav from './core/Nav';
import Home from './core/Home';
import Signup from './user/Signup';
import Signin from './user/Signin';




const MainRouter = () => (
  <div>
    <Nav />
    <Switch>
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/signup' component={Signup}></Route>
      <Route exact path='/login' component={Signin}></Route>
    </Switch>
  </div>
)

export default MainRouter;
