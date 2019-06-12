import React, {Component} from 'react';
import {isAuthenticated} from '../auth';
import {Redirect} from 'react-router-dom'
import {read} from './apiUser';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Typography, Avatar, Divider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PlaceIcon from '@material-ui/icons/Place';
import FollowProfileButton from './FollowProfileButton'
import ProfileTabs from './ProfileTabs'

import DefaultProfile from '../assets/avatar.png';
let photoURL = undefined;


class Profile extends Component {
    constructor(){
        super()
        this.state = {
            user:{ following:[], followers:[]},
            redirectToSignin: false,
            following: false,
            error: ''
        }
    }

    checkFollower = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            return follower._id === jwt.user._id
        })
        return match
    }

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id)
        .then(data=>{
            if(data.error){
                this.setState({error: data.error})
            }
            else{
                this.setState({user:data, following: !this.state.following})
            }
        })
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data =>{
            if(data.error){
                this.setState({redirectToSignin: true})
            }
            else{
                let following = this.checkFollower(data)
                this.setState({user:data, following})
            }
        })
    }

    componentDidMount(){
        const userId = this.props.match.params.userId;
        this.init(userId);  
    }

    componentWillReceiveProps(props){
        
        const userId = props.match.params.userId;
        this.init(userId);  
    }

    render(){
        const {redirectToSignin, user} = this.state;
        var dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

        photoURL = undefined;
        photoURL = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : ''

        if(redirectToSignin) return <Redirect to="/login" />
        return(
            <div className = 'container'>
                <div style={{display:'flex', flexWrap:'wrap'}}>
                    <Avatar 
                        src={photoURL}
                        imgProps={{ onError: (e) => { e.target.src = DefaultProfile; } }}
                        style={{
                            marginRight:'10px', 
                            width:'80px', 
                            height:'80px',
                            backgroundColor:'#eee'
                    }}
                    />
                    <div style={{flexGrow:'1', padding:'10px'}}>                
                        <Typography variant='h4' >
                            {user.name}
                        </Typography> 
                        <Typography style={{fontSize:'14px'}} color='textSecondary'>
                            {user.location ? 
                            <span><PlaceIcon style={{height:'18px',verticalAlign:'-4'}} />
                            {user.location}</span> : ''}
                        </Typography>
                    </div>
                    {isAuthenticated().user && isAuthenticated().user._id === user._id ? (
                        <div style={{paddingTop:'10px'}}>
                            <Button
                                component={Link}
                                to={`/user/edit/${isAuthenticated().user._id}`}
                                style={{marginRight:'10px'}}
                            >
                                <EditIcon />&nbsp;
                                Edit Profile
                            </Button>
                        </div>
                    ): (user._id && 
                        <div style={{paddingTop:'10px'}}>
                            <FollowProfileButton 
                                following={this.state.following} 
                                onButtonClick= {this.clickFollowButton}
                            />
                        </div>)}
                </div>
                <br />
                <Divider/>
                <br/>
                <div style={{display:'flex', flexWrap:'wrap'}}>
                    <div style={{flexGrow:1, maxWidth:'300px', fontSize:'14px', padding:'0px 20px 0px 0px'}}>
                        Joined {user.created ? `${new Date(user.created).toLocaleDateString('en-US', dateOptions)}`:''} 
                        <br />
                        {user.about}
                    </div>
                    <div style={{flexGrow: 3}}>
                        <ProfileTabs followers={user.followers} following={user.following} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile