import React, {Component} from 'react';
import {isAuthenticated} from '../auth';
import {Redirect} from 'react-router-dom'
import {read} from './apiUser';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Typography, Avatar, Divider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteUser from './DeleteUser'

import DefaultAvatar from '../assets/avatar.png';


class Profile extends Component {
    constructor(){
        super()
        this.state = {
            user:'',
            redirectToSignin: false
        }
    }

    

    init = (userId) => {
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

    componentWillReceiveProps(props){
        const userId = props.match.params.userId;
        this.init(userId);  
    }

    render(){
        const {redirectToSignin, user} = this.state;
        const photoURL = user.photo ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : '../assets/avatar.png'

        if(redirectToSignin) return <Redirect to="/login" />
        return(
            <div className = 'container'>
                <div style={{display:'flex', flexWrap:'wrap'}}>
                    <Avatar style={{
                        marginRight:'10px', 
                        width:'60px', 
                        height:'60px',
                        backgroundImage: `URL(${photoURL})`,
                        backgroundSize: 'cover'
                    }}

                    >                    </Avatar>
                    <Typography variant='h4' style={{flexGrow:'1', padding:'10px'}}>
                        {user.name}
                    </Typography> 
                    {isAuthenticated().user && isAuthenticated().user._id === user._id && (
                        <div style={{paddingTop:'10px'}}>
                            <Button
                                component={Link}
                                to={`/user/edit/${isAuthenticated().user._id}`}
                                style={{marginRight:'10px'}}
                            >
                                <EditIcon />&nbsp;
                                Edit Profile
                            </Button>
                            <DeleteUser userId={user._id} />
                        </div>
                    )}
                </div>
                <br />
                <Divider/>
                <br />
                <div >
                    Email: {user.email} <br />
                    Joined {`${new Date(user.created).toDateString()}`}
                </div>
            </div>
        )
    }
}

export default Profile