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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper, faUsers } from '@fortawesome/free-solid-svg-icons'
import Posts from '../post/Posts';



const Home = () => (
  <div>
  {!isAuthenticated() && (
    <div className='container' style={{display:'flex', flexWrap:'wrap'}}>
      <div style={{flexGrow:1, width:'500px', minWidth:'350px', marginRight:'24px', marginBottom:'24px'}}>
        <span style={{fontSize:'44px', fontWeight:'500'}}>
          Own Your Social Experience
        </span>
        <br />
        <Typography variant='h5' color='textSecondary'>
          MyCoop is a cooperatively owned social platform that connects you to the people you care about.
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
               primary={<strong>Cooperative Ownership</strong>}
               secondary="MyCoop is a user owned cooperative.  Users own the platform and set the policies."
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
                   secondary="MyCoop is user supported and does not generate revenue from ads"
                 />
               </ListItem>
               <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <FontAwesomeIcon icon={faNewspaper} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<strong>Genuine Content</strong>}
                    secondary="The cooperative business model allows quality content to flourish, not fake news."
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
    <div className = 'container'>
      Hello, {isAuthenticated().user.name}
      <br/>
      <br />
      <Posts />
    </div>
  )}

  </div>
)

export default Home;
