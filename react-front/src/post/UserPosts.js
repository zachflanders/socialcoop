import React, {Component} from 'react';
import {list, get_by_id} from './apiPost';
import { Card, CardActions, Button, Typography, Avatar, CardHeader, CardContent } from '@material-ui/core';
import {Link} from 'react-router-dom';
import DefaultProfile from '../assets/avatar.png'
import PlaceIcon from '@material-ui/icons/Place';
import PostCard from './PostCard';
import {isAuthenticated} from '../auth';



class UserPosts extends Component {
    constructor(props){
        super(props)
        this.state = {
            posts:[]        
        }
    }
    componentDidMount(){
        console.log(this.props)
        if(this.props.userId) {
            console.log(`getting posts for ${this.props.userId}`)
            get_by_id(this.props.userId).then(data => {
                if(data.error){
                    console.log(data.error)
                }
                else{
                    console.log(data)
                    this.setState({posts:data})
                }
            })
        }
    }
    componentDidUpdate(prevProps){
        console.log(this.props)
        if(this.props.userId && this.props.userId !== prevProps.userId) {
            console.log(`getting posts for ${this.props.userId}`)
            get_by_id(this.props.userId).then(data => {
                if(data.error){
                    console.log(data.error)
                }
                else{
                    console.log(data)
                    this.setState({posts:data})
                }
            })
        }
    }

    renderPosts=(posts)=>{
         return posts.map((post, i)=>{
            return(
            <PostCard post={post} key={i} />
        )})
    }

    render(){
        const {posts} = this.state;
        console.log(posts)
        return(
            <div>
                <div style={{}}>
                    {this.renderPosts(posts)}
                </div>
                
            </div>
        )
    }
}

export default UserPosts