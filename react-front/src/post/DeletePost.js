import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import {deleteById} from './apiPost';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth'


class DeletePost extends Component {
    constructor(){
        super()
        this.state = {
            redirect: false
        }
    }

    componentWillUnMount = () => {
        if(this.state.redirect === true){
            return(
                <Redirect to='/' />
            )
        }
    } 

    deletePost = () => {                
        const token = isAuthenticated().token;
        const postId = this.props.id;
        deleteById(postId, token)
        .then(data => {
            if(data.error){
                console.log('error')
            }
            else{
                this.setState({redirect: true})
            }
        })
    }

    deleteConfirmed= () =>{
        let answer = window.confirm('Are you sure you want to delete this post?');
        if(answer){
            this.deletePost()
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
                Delete Post
            </Button>
        )       
    }
}
export default DeletePost;