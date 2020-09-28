import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {logout, isAuthenticated} from '../auth'
import { Avatar } from '@material-ui/core';
import DefaultProfile from '../assets/avatar.png'
import MenuIcon from '@material-ui/icons/Menu';
import './nav.css'





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
    const photoURL = isAuthenticated() ? isAuthenticated().user.photo_url : '../assets/avatar.png';
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{marginBottom:'32px'}}>
          <Toolbar>
            <IconButton
                onClick = {this.props.toggleDrawer(true)}
                id='menuButton'
                color="inherit"
                aria-label="Menu"
                style={{marginLeft: -12, marginRight: 20}}
            >
              <MenuIcon />
            </IconButton>
            <div className = {classes.grow}>
              <Typography component={Link} to='/' variant="h6" color="inherit" style={{textDecoration:'none', marginRight:'20px'}}>
                myCoop
              </Typography>
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
                  style={{padding:'6px'}}
                >
                  <Avatar
                    src={photoURL}
                    imgProps={{ onError: (e) => { e.target.src = DefaultProfile; } }}
                  >

                  </Avatar>
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
                    >
                      Profile
                    </MenuItem>
                  <MenuItem 
                    onClick={this.handleClose}
                    component={Link}
                    to={`/user/${isAuthenticated().user._id}/settings`}
                    >
                      Settings
                    </MenuItem>
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
