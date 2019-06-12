import React, { Component } from 'react';
import { Button, Tabs, Tab, Paper, AppBar, Toolbar, Avatar, Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import DefaultProfile from '../assets/avatar.png';
import {Link} from 'react-router-dom';




class ProfileTabs extends Component {
    constructor(){
        super()
        this.state = {
            tabValue: 0
        }
    }

    onChange = (event, value) => {
        this.setState({tabValue:value});
    }

    renderPostsTab = () =>{
        return ''
    }

    renderFollowersTab = () => {
        const  {following, followers} = this.props;
        return (
            <div style={{paddingTop:'20px', display:'flex'}}>
                {followers.map((follower, i)=>{
                    const photoURL =  `${process.env.REACT_APP_API_URL}/user/photo/${follower._id}?${new Date().getTime()}`;
                    return (
                        <Card key={i} style={{marginBottom:'10px', marginRight:'10px', width:'400px'}}>
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
                            title = {follower.name}
                            titleTypographyProps = {{variant:'h6'}}
                            subheader = {follower.location}
                            >
                        </CardHeader>
                        <CardContent>
                            {follower.about ? follower.about: <span>&nbsp;</span>}
                        </CardContent>
                         
                        <CardActions >
                            <Button
                                component={Link}
                                to={`/user/${follower._id}`}
                            >
                                View Profile
                            </Button>
                        </CardActions>  
                    </Card>
                )})}
            </div>
        )
    }

    renderFollowingTab = () => {
        const  {following, followers} = this.props;
        return (
            <div style={{paddingTop:'20px', display:'flex'}}>
                {following.map((follower, i)=>{
                    const photoURL =  `${process.env.REACT_APP_API_URL}/user/photo/${follower._id}?${new Date().getTime()}`;
                    return (
                        <Card key={i} style={{marginBottom:'10px', marginRight:'10px', width:'400px'}}>
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
                            title = {follower.name}
                            titleTypographyProps = {{variant:'h6'}}
                            subheader = {follower.location}
                            >
                        </CardHeader>
                        <CardContent>
                            {follower.about ? follower.about: <span>&nbsp;</span>}
                        </CardContent>
                         
                        <CardActions >
                            <Button
                                component={Link}
                                to={`/user/${follower._id}`}
                            >
                                View Profile
                            </Button>
                        </CardActions>  
                    </Card>
                )})}
            </div>
        )
    }


    render(){
        const  {following, followers} = this.props;
        const {tabValue} = this.state
        return(
            <div>
                <Tabs value={tabValue} onChange={this.onChange}>
                    <Tab label='Posts' />
                    <Tab label='Followers' />
                    <Tab label='Following' />
                </Tabs>
                {tabValue === 0 && this.renderPostsTab()}
                {tabValue === 1 && this.renderFollowersTab()}
                {tabValue === 2 && this.renderFollowingTab()}
            </div>
        )
        
    }
}
export default ProfileTabs;