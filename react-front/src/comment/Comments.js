import React, {Component} from 'react';
import {list, getById} from '../post/apiPost';
import {comment, getComments} from './apiComment';
import {Grid, Box, Card, Divider, CardActions, Button, Typography, Avatar, CardHeader, CardContent, TextField } from '@material-ui/core';
import {Link} from 'react-router-dom';
import DefaultProfile from '../assets/avatar.png'
import PlaceIcon from '@material-ui/icons/Place';
import {isAuthenticated} from '../auth';



class Comments extends Component {
    constructor(props){
        super(props)
        this.state = {
            text:'',
            error:'',
            post: {},
            user:{},
            comments: {},
            loading: false      
        }

    }
    init = (postId) => {
        console.log(`getting post ${postId}`)
        getById(postId)
        .then(data =>{
            if(data.error){
                console.log(data)
            }
            else{
                console.log(data)
                this.setState({
                    post:data,
                    user:isAuthenticated().user
                })
            }
        })
        getComments(postId)
        .then(data =>{
            if(data.error){
                console.log(data)
            }
            else{
                console.log(data)
                this.setState({
                    comments:data,
                })
            }
        })
    }

    componentDidMount(){
        this.commentData = new FormData();
        const postId = this.props.post._id;
        this.init(postId);  
    }

    handleChange = (name) => (event) => {
        this.setState({error:''});
        const value = event.target.value;
        this.commentData.set(name, value)
        this.setState({[name]: value})
      };


      isValid = () =>{
        const {text} = this.state;
        if(text.length === 0){
            this.setState({error:'Comment is required.', loading:false});
            return false
        }
        return true
    }

      clickSubmit = event => {
        event.preventDefault();
        this.setState({loading: true})
        if(this.isValid()){
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token;
            const postId = this.props.post._id
            comment(userId, token, postId, this.commentData)
            .then(data =>{
                if(data.error){
                    this.setState({error: data.error.message})
                }
                else{
                    console.log('new commnt');
                    this.setState({
                        loading:false,
                        text: '',

                    })                
                }
            });
        }
    }


    render(){
        const {post, user, error, text, comments} = this.state;
        return(
            <div>
                <Typography variant='h6'>Comments</Typography>
                <br />
                <CommentList comments={comments} />

                <form style={{display:'flex'}}>
                    <TextField
                        id="text"
                        multiline
                        label="Add Comment"
                        style={{flexGrow:1}}
                        onChange={this.handleChange("text")}
                        value={this.state.text}
                    />
                    <Button onClick={this.clickSubmit}>
                        Comment
                    </Button>
                </form>
                
            </div>
        )
    }
}

export default Comments

const CommentList = (props) =>{
    var dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute:'numeric' };
    if(props.comments.length > 0) {
        return props.comments.map(comment => {
            return(
                <div style={{marginBottom:'30px'}}>
                    
                    <div style={{display:'flex'}}>
                    <Avatar align='middle'
                        component={Link}
                        to={`/user/${comment.user._id}`}
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.user._id}?${new Date().getTime()}`
                    }
                        imgProps={{ onError: (e) => { e.target.src = DefaultProfile; } }}
                        style={{
                            backgroundColor:'#eee',
                            height: '36px',
                            width: '36px',
                            marginRight:'10px'
                        }}>
                    </Avatar>
                    <div>
                        <Box color='textPrimary' fontWeight={700}>
                            {comment.user.name}&nbsp;&nbsp;
                        </Box>
                        <Typography color='textSecondary'>
                            {new Date(comment.createdAt).toLocaleDateString('en-US', dateOptions)}
                        </Typography>
                        </div>
                    

                    </div>
                    
                    {comment.text}
                </div>
            )
        })
    }
    return ''
}