import React, {Component} from 'react';
import PropTypes from "prop-types";
import {isAuthenticated} from '../auth';
import {Redirect, withRouter} from 'react-router-dom'
import {read} from './apiUser';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Typography, Avatar, Divider, Box } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PlaceIcon from '@material-ui/icons/Place';
import FollowProfileButton from './FollowProfileButton'
import ProfileTabs from './ProfileTabs'
import DefaultProfile from '../assets/avatar.png';
import SidebarNav from '../core/SidebarNav'

let photoURL = undefined;

class Profile extends Component {
    constructor(props){
        super(props)
        this.state = {
            user:{following:[], followers:[]},
            redirectToSignin: false,
            error: ''
        }
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      };

    init = (userId) => {
        this.setState({user:{following:[], followers:[]}});
        const token = isAuthenticated().token
        read(userId, token)
        .then(data =>{
            if(data.error){
                this.setState({redirectToSignin: true})
            }
            else{
                this.setState({user:data})
            }
        })
    }

    componentDidMount(){
        const userId = this.props.match.params.userId;
        this.init(userId);  
    }

    componentDidUpdate(prevProps){
        if (this.props.match.params.userId !== prevProps.match.params.userId) {
            const userId = this.props.match.params.userId;
            this.init(userId);
        }
    }

    render(){
        const {redirectToSignin, user} = this.state;
        var dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };


        if(redirectToSignin) return <Redirect to="/login" />
        const { match, location, history } = this.props;
        return(
            <Box display="flex" style={{paddingLeft:'16px'}}>
                <SidebarNav />
                <div style={{width:'100%', paddingRight:'16px'}}>
                <div style={{display:'flex', flexWrap:'wrap'}}>
                    <Avatar 
                        src={user.photo_url}
                        imgProps={{ onError: (e) => { e.target.src = DefaultProfile; } }}
                        style={{
                            marginRight:'10px', 
                            width:'80px', 
                            height:'80px',
                            backgroundColor:'#eee'
                        }}
                    />
                    <div style={{padding:'10px', flexGrow:1}}>                
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
                                user={user} 
                            />
                        </div>)}
                </div>
                <br />
                <Divider/>
                <br/>
                <div>
                    <div style={{fontSize:'14px'}}>
                        Joined {user.created ? `${new Date(user.created).toLocaleDateString('en-US', dateOptions)}`:''} 
                        <br />
                        {user.about}
                    </div>
                    <div >
                        <ProfileTabs user={user} />
                    </div>
                </div>
                </div>
            </Box>
        )
    }
}

export default withRouter(Profile)