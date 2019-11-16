import React, { Component } from 'react';
import { Button, Tabs, Tab, Paper, AppBar, Toolbar, Avatar, Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import DefaultProfile from '../assets/avatar.png';
import UserCard from './UserCard';
import {Link} from 'react-router-dom';
import UserPosts from '../post/UserPosts';


class ProfileTabs extends Component {
    constructor(props){
        super(props)
        this.state = {
            tabValue: 0
        }
    }

    onChange = (event, value) => {
        this.setState({tabValue:value});
    }

    renderPostsTab = () =>{
        const  {userId, followers} = this.props;
        return (
            <div>
                <br />
                <UserPosts userId={userId}/>
            </div>
            
        )
    }

    renderFollowersTab = () => {
        const  {following, followers} = this.props;
        return (
            <div style={{paddingTop:'20px', display:'flex', flexWrap:'wrap'}}>
                {followers.map((follower, i)=>{
                    return (
                        <UserCard user={follower} key={i} />
                )})}
            </div>
        )
    }

    renderFollowingTab = () => {
        const  {following, followers} = this.props;
        return (
            <div style={{paddingTop:'20px', display:'flex', flexWrap:'wrap'}}>
                {following.map((follower, i)=>{
                    const photoURL =  `${process.env.REACT_APP_API_URL}/user/photo/${follower._id}?${new Date().getTime()}`;
                    return (
                        <UserCard user={follower} key={i} />
                )})}
            </div>
        )
    }


    render(){
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