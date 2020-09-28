import React from 'react';
import {Link} from 'react-router-dom'

import {isAuthenticated} from '../auth'

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import HomeIcon from '@material-ui/icons/Home';
import ContactsIcon from '@material-ui/icons/Contacts';
import { Avatar, Button, Typography } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';


import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

class SidebarNav extends React.Component {
  state = {
  }

  render(){
    console.log(isAuthenticated().user.photo_url)
    const photoURL = isAuthenticated() ? isAuthenticated().user.photo_url : '../assets/avatar.png'

    return (
      <div style={{marginRight: '16px', minWidth:'260px', width:'260px'}} className='desktop'>
        <Button
            color="primary"
            variant='contained'
            component = {Link}
            to='/post/create'
            style= {{width:'100%'}} 
            startIcon={<AddIcon />}
        >
            Create Post
        </Button>
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            >
            <ListItem 
                button
                component={Link}
                to={`/`}
            >
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={<Typography color='textPrimary'>Home Feed</Typography>} />
            </ListItem>
            <ListItem 
                button
                component={Link}
                to={`/users`}
            >
                <ListItemIcon>
                    <ContactsIcon />
                </ListItemIcon>
                <ListItemText primary={<Typography color='textPrimary'>Directory</Typography>} />
            </ListItem>
            <ListItem 
                button
                component={Link}
                to={`/user/${isAuthenticated().user._id}`}
            >
                <ListItemIcon>
                    <Avatar
                        src={photoURL}
                        style={{
                            marginRight:'10px', 
                            width:'24px', 
                            height:'24px',
                            backgroundColor:'#eee'
                        }}
                    >

                  </Avatar>
                </ListItemIcon>
                <ListItemText primary={<Typography color='textPrimary'>Profile</Typography>} />
            </ListItem>
            
        </List>
      </div>
    );
  }
}

export default SidebarNav;


