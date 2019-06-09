import React, {Component} from 'react';
import {list} from './apiUser';
import { Card, CardActions, Button, Typography, Avatar, CardHeader } from '@material-ui/core';
import {Link} from 'react-router-dom';
import DefaultProfile from '../assets/avatar.png'

class Users extends Component {
    constructor(){
        super()
        this.state = {
            users:[]        
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

    renderUsers=(users)=>{
         return users.map((user, i)=>{
             console.log(user)
            const photoURL = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : '../assets/avatar.png'
            return(
            <Card key={i} style={{marginBottom:'10px', marginRight:'10px', width:'400px'}}>
                <CardHeader
                    avatar = {
                        <Avatar align='middle'
                        style={{
                            backgroundImage: `URL(${photoURL})`,
                            backgroundSize: 'cover',
                            backgroundColor:'#eee'
                        }}>
                        </Avatar>
                    }
                    title = {user.name}
                    >
                </CardHeader>
                 
                <CardActions>
                    <Button
                        component={Link}
                        to={`/user/${user._id}`}
                    >
                        View Profile
                    </Button>
                </CardActions>  
            </Card>
        )})
    }

    render(){
        const {users} = this.state;
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