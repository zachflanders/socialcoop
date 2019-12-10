import React, {Component, useRef} from 'react';
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
            user: null,
            loading: true,
            posts:[],
            page: 1,        
        }
    }

    loadFeed = (user, page) => {
        this.setState({posts:[], loading:true});
        getFeed(user.user._id, user.token, page).then(data =>{
            console.log(data);
            if(data.error){
                console.log(data.error)
            }
            else{
                this.setState({posts:data, loading:false})
            }
        })
    }

    loadMore = (user, number) => {
        this.setState({ page: this.state.page + number });
        this.loadFeed(user, this.state.page + number);
    };
 
    loadLess = (user, number) => {
        this.setState({ page: this.state.page - number });
        this.loadFeed(user, this.state.page - number);
    };

    componentDidMount(){
        let user = isAuthenticated()
        this.setState({user:user})
        this.loadFeed(user, this.state.page)
        
    }
    renderFeed=(posts)=>{
        if(posts.length == 0 && !this.state.loading){
            return (
                <div>
                    There are no posts to display. <Link to='/users'>Follow more people</Link> to see their posts.
                </div>
            )
        }
        return posts.map((post)=>{
            return(
                <PostCard post={post} key={post._id} />
            )
        })


    }

    render(){
        const {posts, user} = this.state;
        return(
            <div style={{paddingRight:'16px', width:'700px', flexShrink:1}}>
                <div>
                    {(this.state.loading && <div className='dot-flashing' />)}
                    {this.renderFeed(posts)}
                    {(this.state.page > 1 && 
                        <Button
                            onClick={() => this.loadLess(user, 1)}
                        >
                            Previous
                        </Button>
                    )}
                    {(posts.length > 0 && 
                        <Button
                            onClick={() => this.loadMore(user, 1)}
                        >
                            Next
                        </Button>
                     )}
                </div>
                
            </div>
        )
    }
}

export default Feed