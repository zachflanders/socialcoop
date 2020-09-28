import React from 'react';
import Typography from '@material-ui/core/Typography';
import {isAuthenticated} from '../auth';
import Signup from '../user/Signup';
import LockIcon from '@material-ui/icons/Lock';
import BlockIcon from '@material-ui/icons/Block';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {Box, Paper} from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper, faUsers, faBullhorn } from '@fortawesome/free-solid-svg-icons'
import Posts from '../post/Posts';
import Feed from '../post/Feed';
import SidebarNav from '../core/SidebarNav';
import NotificationsIcon from '@material-ui/icons/Notifications';





const Home = () => (
  <div >
  {!isAuthenticated() && (
    <div className='container' style={{display:'flex', flexWrap:'wrap'}}>
      <div style={{flexGrow:1, width:'500px', minWidth:'350px', marginRight:'24px', marginBottom:'24px'}}>
        <span style={{fontSize:'44px', fontWeight:'500'}}>
          Own Your Social Experience
        </span>
        <br />
        <Typography variant='h5' color='textSecondary'>
          MyCoöp is a cooperatively owned social platform that connects you to the people you care about.
        </Typography>
        <br />
        <div style={{display:'flex', flexWrap:'wrap'}}>
        <div style={{flexGrow:1, width:'50%', minWidth:'250px'}}>
          <List >
          <ListItem alignItems="flex-start">
             <ListItemAvatar>
               <FontAwesomeIcon icon={faUsers} />
             </ListItemAvatar>
             <ListItemText
               primary={<strong>Coöperative Ownership</strong>}
               secondary="MyCoöp is a user owned coöperative.  Users own the platform and set the policies."
             />
           </ListItem>
            <ListItem alignItems="flex-start">
               <ListItemAvatar>
                 <LockIcon />
               </ListItemAvatar>
               <ListItemText
                 primary={<strong>Privacy</strong>}
                 secondary="We will never sell your data."
               />
             </ListItem>
            </List>
          </div>
          <div style={{flexGrow:1, width:'50%', minWidth:'250px'}}>
            <List >
              <ListItem alignItems="flex-start">
                 <ListItemAvatar>
                   <BlockIcon />
                 </ListItemAvatar>
                 <ListItemText
                   primary={<strong>No Ads</strong>}
                   secondary="MyCoöp is user supported and does not generate revenue from ads"
                 />
               </ListItem>
               <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <FontAwesomeIcon icon={faNewspaper} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<strong>Genuine Content</strong>}
                    secondary="The coöperative business model allows quality content to flourish, not fake news."
                  />
                </ListItem>
            </List>
          </div>
        </div>
      </div>
      <div className='centered'>
        <Signup />
      </div>
    </div>
  )}
  {isAuthenticated() && (
    <Box display="flex" style={{paddingLeft:'16px'}}>
      <SidebarNav />
      <Feed />
      <div style={{width:'260px', marginLeft:'0px', marginRight:'16px'}} className='desktop'>
      <Box style={{paddingRight:'16px'}}>
        <Paper style={{padding:'16px', width:'228px', background:'#c8e6c9'}}>
        <FontAwesomeIcon icon={faBullhorn} />&nbsp;&nbsp;
          Welcome to the alpha preview of myCoöp.
        </Paper>
        </Box>
        </div>
    </Box>
  )}

  </div>
)

export default Home;
