import React, {Component} from 'react';
import {list, getById} from './apiPost';
import {Grid, Card, Divider, CardActions, Button, Typography, Avatar, CardHeader, CardContent } from '@material-ui/core';
import {Link} from 'react-router-dom';
import DefaultProfile from '../assets/avatar.png'
import PlaceIcon from '@material-ui/icons/Place';
import PostCard from './PostCard';
import {isAuthenticated} from '../auth';
import './post.css'
import Comments from '../comment/Comments'



class Post extends Component {
    constructor(props){
        super(props)
        this.state = {
            post: {
                title: null,
                body: null,
                created: null,
                photo_url: null,
            }        
        }
    }
    init = (postId) => {
        console.log(`getting post ${postId}`)
        getById(postId)
        .then(data =>{
            if(data.error){
                this.setState({redirectToSignin: true})
            }
            else{
                console.log(data)
                this.setState({post:data})
            }
        })
    }

    componentDidMount(){
        const postId = this.props.match.params.postId;
        this.init(postId);  
    }

    render(){
        const {post} = this.state;
        const posterId = post.postedBy ? post.postedBy._id : '';
        const posterName = post.postedBy ? post.postedBy.name : '';
        const photoURL =  post.postedBy ? post.postedBy.photo_url : '';
        var dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute:'numeric' };
        return(
            <div className='post-page' style={{marginTop:'16px'}}>
                <Typography variant='h3' style={{marginBottom:'10px'}}>
                    {post.title}
                </Typography>
                <Grid container justify="left" alignItems="left">
                <Avatar 
                    align='middle'
                    component={Link}
                    to={`/user/${posterId}`}
                    src={photoURL}
                    imgProps={{ onError: (e) => { e.target.src = DefaultProfile; } }}
                    style={{
                        backgroundColor:'#eee',
                        height: '55px',
                        width: '55px',
                        marginRight: '15px'
                    }}>
                    </Avatar>
                    
                    <div style={{marginTop:'5px'}} className='post-page-text'>
                        <Link to={`/user/${posterId}`} style={{textDecoration:'none'}}><Typography color='textPrimary'>{posterName}</Typography></Link>
                        <Typography color='textSecondary'>
                            {(post.created && new Date(post.created).toLocaleDateString('en-US', dateOptions))}
                        </Typography>
                    </div>
                </Grid>
                <br/>
                <Divider />
                <br />
                <div style={{width:'100%', textAlign:'center'}}>
                    <img src={post.photo_url} style={{maxHeight: '500px', maxWidth:'100%'}}></img>
                </div>
                <p className='post-page-text'>
                    {
                        (post.body && post.body.split('\n').map((item, key) => {
                            return <span key={key}>{item}<br/></span>
                        }))
                    }
                </p>
                <Divider />
                <br />
                {(post._id && <Comments post={post} />)}
                <br />

                
            </div>
        )
    }
}

export default Post