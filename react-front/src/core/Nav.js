import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {logout, isAuthenticated} from '../auth'



const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
    display: 'flex'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};



class Nav extends React.Component {
  state = {
    anchorEl: null
  }
  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (callback) => {
    this.setState({ anchorEl: null });
    if(typeof callback == 'function'){
      callback();
    }
  };
  render(){
    const { classes, history } = this.props;
    const {anchorEl} = this.state;
    const open = Boolean(anchorEl);
    const photoURL = isAuthenticated().user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${isAuthenticated().user._id }?${new Date().getTime()}` : '../assets/avatar.png'

    return (
      <div className={classes.root}>
        <AppBar position="static" style={{marginBottom:'32px'}}>
          <Toolbar>
            <div className = {classes.grow}>
              <Typography component={Link} to='/' variant="h6" color="inherit" style={{textDecoration:'none', marginRight:'20px'}}>
                myCoop
              </Typography>
              <Button component={Link} to='/users' color="inherit">Directory</Button>
            </div>
            {!isAuthenticated() && (
              <Button component={Link} to='/login' color="inherit">Login</Button>
            )}
            {isAuthenticated() && (
              <>
                
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                  style={{
                    backgroundImage: `URL(${photoURL})`,
                    backgroundSize: 'cover',
                    width: '40px',
                    height: '40px'
                  }}
                >
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem 
                    onClick={this.handleClose}
                    component={Link}
                    to={`/user/${isAuthenticated().user._id}`}
                  >{isAuthenticated().user.name}</MenuItem>
                  <MenuItem onClick={()=>{this.handleClose(()=>logout(()=>{history.push('/')}))}}>Logout</MenuItem>
                </Menu>
              </div>
              </>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Nav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Nav));
