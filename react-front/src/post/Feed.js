import React, {Component} from 'react';
import {list, getByUserId, getFeed} from './apiPost';
import { Card, CardActions, Button, Typography, Avatar, CardHeader, CardContent } from '@material-ui/core';
import {Link} from 'react-router-dom';
import DefaultProfile from '../assets/avatar.png'
import PlaceIcon from '@material-ui/icons/Place';
import PostCard from './PostCard';
import {isAuthenticated} from '../auth';


class Feed extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            posts:[]        
        }
    }
    componentDidMount(){
        const user = isAuthenticated()
        getFeed(user.user._id, user.token).then(data =>{
            console.log(data);
            if(data.error){
                console.log(data.error)
            }
            else{
                this.setState({posts:data, loading:false})
            }
        })
    }
    renderFeed=(posts)=>{
        if(posts.length == 0 && !this.state.loading){
            return (
                <div>
                    There are no posts to display. <Link to='/users'>Follow more people</Link> to see their posts.
                </div>
            )
        }
        return posts.map((post, i)=>{
            return(
                <PostCard post={post} key={i} />
            )
        })


    }

    render(){
        const {posts} = this.state;
        return(
            <div>
                <div>
                    {(this.state.loading && <div className='dot-flashing' />)}

                    {this.renderFeed(posts)}
                </div>
                
            </div>
        )
    }
}

export default Feed