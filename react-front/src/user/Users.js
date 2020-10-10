import React, {Component} from 'react';
import {list} from './apiUser';
import { Card, CardActions, Button, Typography, Avatar, CardHeader, CardContent, Box } from '@material-ui/core';
import {Link} from 'react-router-dom';
import DefaultProfile from '../assets/avatar.png'
import PlaceIcon from '@material-ui/icons/Place';
import UserCard from './UserCard';
import { isAuthenticated } from '../auth';
import {read} from './apiUser';
import SidebarNav from '../core/SidebarNav'


class Users extends Component {
    constructor(){
        super()
        this.state = {
            users:[],
            loading: true,
        }
    }
    componentDidMount(){
        list().then(data =>{
            if(data.error){
                console.log(data.error)
            }
            else{
                this.setState({users:data, loading:false})
            }
        })
    }

    renderUsers=(users, following)=>{
         return users.map((user, i)=>{
            console.log(user)
            const photoURL = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : '../assets/avatar.png'
            console.log(user, photoURL)
            return(
            <UserCard user={user} key={i}/>
        )})
    }

    render(){
        const {users, following} = this.state;
        return(
            <Box display="flex" style={{paddingLeft:'16px', marginTop:'16px'}}>
                <SidebarNav />
                <div style={{width:'100%', paddingRight:'16px'}}>
                    <Typography variant='h4'>Directory</Typography> 
                    <br />
                    <div style={{display:'flex', flexWrap:'wrap'}}>
                        {(this.state.loading && <div className='dot-flashing' />)}
                        {this.renderUsers(users)}
                    </div>
                </div>
                
            </Box>
        )
    }
}

export default Users