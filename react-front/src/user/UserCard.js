import React, { Component } from 'react';
import { Button, Tabs, Tab, Paper, AppBar, Toolbar, Avatar, Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import PlaceIcon from '@material-ui/icons/Place'
import DefaultProfile from '../assets/avatar.png';
import {Link} from 'react-router-dom';
import FollowProfileButton from './FollowProfileButton'
import {isAuthenticated} from '../auth'



const UserCard = (props) =>{
    console.log(props);
    const {user} = props

    const photoURL =  user.photo_url;
    return (<Card style={{marginBottom:'10px', marginRight:'10px', width:'280px', height:'auto'}}>
                        <CardHeader
                            avatar = {
                                <Avatar align='middle'
                                    src={photoURL}
                                    imgProps={{ onError: (e) => { e.target.src = DefaultProfile; } }}
                                    style={{
                                        backgroundColor:'#eee',
                                        height: '50px',
                                        width: '50px'
                                    }}>
                                </Avatar>
                            }
                            title = {user.name}
                            titleTypographyProps = {{variant:'h6'}}
                            subheader = {user.location ? <span><PlaceIcon style={{height:'18px',verticalAlign:'-4'}} />{user.location}</span>: ''}
                            >
                        </CardHeader>
                        <CardContent>
                            {user.about ? user.about: <span>&nbsp;</span>}
                        </CardContent>
                         
                        <CardActions >
                            <Button
                                component={Link}
                                to={`/user/${user._id}`}
                            >
                                View Profile
                            </Button>
                            <FollowProfileButton 
                                user={user} 
                            />
                        </CardActions>  
                    </Card>)
}

export default UserCard