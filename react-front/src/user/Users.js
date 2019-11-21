import React, {Component} from 'react';
import {list} from './apiUser';
import { Card, CardActions, Button, Typography, Avatar, CardHeader, CardContent } from '@material-ui/core';
import {Link} from 'react-router-dom';
import DefaultProfile from '../assets/avatar.png'
import PlaceIcon from '@material-ui/icons/Place';
import UserCard from './UserCard';
import { isAuthenticated } from '../auth';
import {read} from './apiUser';


class Users extends Component {
    constructor(){
        super()
        this.state = {
            users:[],
        }
    }
    componentDidMount(){
        list().then(data =>{
            if(data.error){
                console.log(data.error)
            }
            else{
                this.setState({users:data})
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
            <div className='container'>
                <Typography variant='h4'>Directory</Typography> 
                <br />
                <div style={{display:'flex', flexWrap:'wrap'}}>
                    {this.renderUsers(users)}
                </div>
                
            </div>
        )
    }
}

export default Users