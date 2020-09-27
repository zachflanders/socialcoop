import React, {Component} from 'react';
import {list, getByUserId} from './apiPost';
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
            posts:[],
            loading: true,        
        }
    }
    componentDidMount(){
        if(this.props.userId) {
            getByUserId(this.props.userId).then(data => {
                if(data.error){
                    console.log(data.error)
                }
                else{
                    console.log(data)
                    this.setState({posts:data, loading:false})
                }
            })
        }
    }
    componentDidUpdate(prevProps){
        if(this.props.userId && this.props.userId !== prevProps.userId) {
            getByUserId(this.props.userId).then(data => {
                if(data.error){
                    console.log(data.error)
                }
                else{
                    console.log(data)
                    this.setState({posts:data, loading: false})
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
        return(
            <div>
                <div style={{}}>
                    {(this.state.loading && <div className='dot-flashing' />)}
                    {this.renderPosts(posts)}
                </div>
                
            </div>
        )
    }
}

export default UserPosts