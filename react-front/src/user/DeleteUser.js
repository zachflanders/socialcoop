import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { isAuthenticated } from '../auth'
import {remove} from './apiUser';
import {logout} from '../auth'
import { Redirect } from 'react-router-dom';


class DeleteUser extends Component {
    constructor(){
        super()
        this.state = {
            redirect: false
        }
    }

    deleteAccount = () =>{
        const token = isAuthenticated().token;
        const userId = this.props.userId;
        remove(userId, token)
        .then(data => {
            if(data.error){
                console.log('error')
            }
            else{
                logout(()=>console.log('user is deleted'))
                this.setState({redirect: true})
            }
        })

    }

    deleteConfirmed= () =>{
        let answer = window.confirm('Are you sure you want to delete your account?');
        if(answer){
            this.deleteAccount()
        }
    }

    render(){
        if(this.state.redirect === true){
            return(
                <Redirect to='/' />
            )
        }
        return(
            <Button
                onClick={this.deleteConfirmed}
                style={{
                    background:'#e74c3c', 
                    color:'#fff',
                }}
             >
                <DeleteIcon />&nbsp;
                Delete Profile
            </Button>
        )
        
    }
}
export default DeleteUser;