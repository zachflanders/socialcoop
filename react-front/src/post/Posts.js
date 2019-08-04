import React, {Component} from 'react';
import {list} from './apiPost';
import { Card, CardActions, Button, Typography, Avatar, CardHeader, CardContent } from '@material-ui/core';
import {Link} from 'react-router-dom';
import DefaultProfile from '../assets/avatar.png'
import PlaceIcon from '@material-ui/icons/Place';
import PostCard from './PostCard';


class Posts extends Component {
    constructor(){
        super()
        this.state = {
            posts:[]        
        }
    }
    componentDidMount(){
        list().then(data =>{
            if(data.error){
                console.log(data.error)
            }
            else{
                console.log(data)
                this.setState({posts:data})
            }
        })
    }

    renderPosts=(posts)=>{
         return posts.map((post, i)=>{
            //const photoURL = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : '../assets/avatar.png'
            return(
            <PostCard post={post} key={i} />
        )})
    }

    render(){
        const {posts} = this.state;
        return(
            <div>
                <Typography variant='h4'>Posts</Typography> 
                <br />
                <div style={{}}>
                    {this.renderPosts(posts)}
                </div>
                
            </div>
        )
    }
}

export default Posts