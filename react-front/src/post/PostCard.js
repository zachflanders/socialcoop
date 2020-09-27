import React, { Component } from 'react';
import { Button, Tabs, Tab, Paper, AppBar, Toolbar, Avatar, Card, CardHeader, CardContent, CardActions, Typography, Divider } from '@material-ui/core';
import PlaceIcon from '@material-ui/icons/Place'
import EditIcon from '@material-ui/icons/Edit'

import DefaultProfile from '../assets/avatar.png';
import {Link} from 'react-router-dom';
import Comments from '../comment/Comments'
import {isOwner} from '../utils'

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

class PostCard extends Component{
    constructor(props){
        super(props)
        this.state = {
            truncated: false
        }
        this.body = ''
    }

    truncatePost = (post) => {
        let truncatedPost = post.slice(0,600)
        truncatedPost = truncatedPost.slice(0, truncatedPost.lastIndexOf(' ')) + ' . . .';
        return truncatedPost
    }

    componentWillMount(){
        const {post} = this.props
        if(post.body.length > 200){
            const truncatedPost = this.truncatePost(post.body)
            this.setState({
                truncated:true,
                body: truncatedPost
            })
        }
        else {
            this.setState({
                body: post.body
            })
        }
    }

    showFullPost = () => {
        const {post} = this.props
        this.setState({
            truncated:false,
            body: post.body
        })
    }

    render(){
        const {post} = this.props
        const posterId = post.postedBy ? post.postedBy._id : '';
        const posterName = post.postedBy ? post.postedBy.name : '';
        const photoURL =  `${process.env.REACT_APP_API_URL}/user/photo/${posterId}?${new Date().getTime()}`;
        var dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute:'numeric' };
        return (
            <Card 
                style={{
                    marginBottom:'10px', 
                    marginRight:'0px',
                    maxWidth: '700px',
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
                                height: '48px',
                                width: '48px'
                            }}>
                        </Avatar>
                    }

                    title = {<Link to={`/user/${posterId}`} style={{textDecoration:'none',color:'#000'}}>{posterName}</Link>}
                    titleTypographyProps = {{variant:'h6'}}
                    subheader = {post.created ? 
                        <Typography color='textSecondary' >
                            {new Date(post.created).toLocaleDateString('en-US', dateOptions)}
                            </Typography>
                        :
                            ''}
                    >
                </CardHeader>
                <PostCardImage post={post} />

                <CardContent>
                    <Typography variant='h4'>
                        <Link to={`/post/${post._id}`} style={{textDecoration:'none',color:'#000'}}>
                            {post.title}
                        </Link>
                    </Typography>
                    <br/>
                    {
                        this.state.body.split('\n').map((item, key) => {
                            return <span key={key} style={{overflowWrap: 'break-word'}}>{item}<br/></span>
                        })
                    }

                </CardContent>
                <CardActions>
                    {(this.state.truncated === true &&
                        <Button
                            onClick={this.showFullPost}
                        >
                            Read More
                        </Button>
                    )}
                    {(
                        isOwner(posterId) && 
                        <Button
                            component={Link}
                            to={`/post/edit/${post._id}`}
                            style={{marginLeft:'auto'}}
                        >
                            <EditIcon />&nbsp; Edit
                        </Button>
                    )}
                </CardActions>
                <Divider />
                <CardContent>
                    <Comments post={post}></Comments>
                </CardContent>
            </Card>)
    }
}

export default PostCard