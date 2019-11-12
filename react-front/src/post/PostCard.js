import React, { Component } from 'react';
import { Button, Tabs, Tab, Paper, AppBar, Toolbar, Avatar, Card, CardHeader, CardContent, CardActions, Typography, Divider } from '@material-ui/core';
import PlaceIcon from '@material-ui/icons/Place'
import DefaultProfile from '../assets/avatar.png';
import {Link} from 'react-router-dom';

class PostCardImage extends Component {
    constructor(props){
        super(props)
        this.state = {
            image: false
        }
    }

    componentDidMount(){
        const {post} = this.props
        fetch(`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`).then(res => {
            const reader = res.body.getReader();
            reader.read().then((data) => {
                if(data.value){
                    this.setState({image:true})
                }
                
            });
        });

    }

    render (){
        const {post} = this.props
        if(this.state.image){
            return (<div 
                style={{
                    width: '100%',
                    height: '300px',
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: 'cover',
                    backgroundImage: `url(${process.env.REACT_APP_API_URL}/post/photo/${post._id})`
                }}
                />)
        }
        else {
            return (<Divider />)
        }
    }

} 

const PostCard = (props) =>{
    const {post} = props
    const posterId = post.postedBy ? post.postedBy._id : '';
    const posterName = post.postedBy ? post.postedBy.name : '';
    const photoURL =  `${process.env.REACT_APP_API_URL}/user/photo/${posterId}?${new Date().getTime()}`;
    var dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute:'numeric' };

    return (
        <Card 
            style={{
                marginBottom:'10px', 
                marginRight:'10px',
                maxWidth: '650px',
            }}
        >
            <CardHeader
                avatar = {
                    <Avatar align='middle'
                        component={Link}
                        to={`/user/${posterId}`}
                        src={photoURL}
                        imgProps={{ onError: (e) => { e.target.src = DefaultProfile; } }}
                        style={{
                            backgroundColor:'#eee',
                            height: '40px',
                            width: '40px'
                        }}>
                    </Avatar>
                }
                action = {post.created ? 
                    <Typography color='textSecondary' variant='subtitle2' style={{padding:'16px 16px'}}>
                        {new Date(post.created).toLocaleDateString('en-US', dateOptions)}
                        </Typography>
                    :
                        ''}

                title = {<Link to={`/user/${posterId}`} style={{textDecoration:'none',color:'#000'}}>{posterName}</Link>}
                titleTypographyProps = {{variant:'subtitle1'}}
                //subheader = {user.location ? <span><PlaceIcon style={{height:'18px',verticalAlign:'-4'}} />{user.location}</span>: ''}
                >
            </CardHeader>
            <PostCardImage post={post} />

            <CardContent>
                <Typography variant='h6'>{post.title}</Typography>
                {post.body}

            </CardContent>
            <CardActions>
                <Button
                    component={Link}
                    to={`/posts/${post._id}`}
                >
                    Read More</Button>
            </CardActions>
        </Card>)
}

export default PostCard