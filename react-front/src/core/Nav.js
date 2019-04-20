import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

export const logout = (next) => {
  if(typeof window !== 'undefined'){
    localStorage.removeItem("jwt");
  }
  next();
  return fetch("http://localhost:8080/signout", {
    method: "GET"
  })
  .then(response => {
    console.log('signout', response)
    return response.json();
  })
  .catch(err => console.log(err));
}


function Nav(props) {
  const { classes, history } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography component={Link} to='/' variant="h6" color="inherit" className={classes.grow} style={{textDecoration:'none'}}>
            myCoop
          </Typography>
          <Button component={Link} to='/login' color="inherit">Login</Button>
          <Button color="inherit" onClick={()=>{logout(()=>{history.push('/')})}}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

Nav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Nav));
