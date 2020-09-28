import React, { Component } from 'react';
import { getById } from '../post/apiPost';
import { comment, getComments, deleteById } from './apiComment';
import { Box, Button, Typography, Avatar, TextField, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import DefaultProfile from '../assets/avatar.png'
import DeleteIcon from '@material-ui/icons/Delete';
import { isAuthenticated } from '../auth';
import { isOwner } from '../utils'

class Comments extends Component {
    constructor(props){
        super(props)
        this.state = {
            text:'',
            error:'',
            post: {},
            user:{},
            comments: {},
            loading: true,
            page: 1,
        }
    }
    init = (postId, page) => {
        getById(postId)
        .then(data =>{
            if(data.error){
                console.log(data)
            }
            else{
                this.setState({
                    post:data,
                    user:isAuthenticated().user
                })
            }
        })
        getComments(postId, page)
        .then(data =>{
            if(data.error){
                console.log(data)
            }
            else{
                this.setState({
                    comments:data,
                    loading: false,
                })
            }
        })
    }

    componentDidMount(){
        this.commentData = new FormData();
        const postId = this.props.post._id;
        const page = this.props.page
        this.init(postId, page);  
    }

    handleChange = (name) => (event) => {
        this.setState({error:''});
        const value = event.target.value;
        this.commentData.set(name, value)
        this.setState({[name]: value})
      };

    isValid = () => {
        const {text} = this.state;
        if(text.length === 0){
            this.setState({error:'Comment is required.', loading:false});
            return false
        }
        return true
    }

    loadMore = (number) => {
        this.setState({ page: this.state.page + number });
        this.loadComments(this.state.page + number);
    };
 
    loadLess = (number) => {
        this.setState({ page: this.state.page - number });
        this.loadComments(this.state.page - number);
    };

    loadComments = (page) => {
        this.setState({comments:[], loading:true});
        getComments(this.props.post._id, page).then(data =>{
            console.log(data);
            if(data.error){
                console.log(data.error)
            }
            else{
                this.setState({comments:data, loading:false})
            }
        })
    }

    clickSubmit = event => {
        (event && event.preventDefault());
        this.setState({loading: true, text:''})
        if(this.isValid()){
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token;
            const postId = this.props.post._id
            const page = this.props.page
            comment(userId, token, postId, this.commentData)
            .then(data =>{
                if(data.error){
                    this.setState({error: data.error.message})
                }
                else{
                    getComments(postId, page)
                    .then(data =>{
                        if(data.error){
                            console.log(data)
                        }
                        else{
                            console.log(data)
                            this.setState({
                                comments:data,
                                loading: false,
                            })
                        }
                    })              
                }
            });
        }
    }

    onKeyDown = (event) => {
        if(event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault();
            this.clickSubmit();
          }
    }

    removeComment = (commentToRemove) => {
        let comments = this.state.comments;
        comments = comments.filter(comment => comment._id !== commentToRemove._id);
        this.setState({
            loading:false,
            comments: comments
        }) 
    }

    render(){
        const { comments } = this.state;
        return(
            <div>
                <Typography variant='h6'>Comments</Typography>
                <br />
                <CommentList comments={comments} removeComment={this.removeComment} />
                {(this.state.loading && <div className='dot-flashing' />)}
                {(this.state.page > 1 && 
                        <Button
                            onClick={() => this.loadLess(1)}
                        >
                            Previous
                        </Button>
                    )}
                    {(comments.length > 5 && 
                        <Button
                            onClick={() => this.loadMore(1)}
                        >
                            Next
                        </Button>
                     )}
                {(isAuthenticated() ? 
                    <form style={{display:'flex', width:'100%'}}>
                        <TextField
                            id="text"
                            multiline
                            label="Add Comment"
                            style={{flexGrow:1}}
                            onChange={this.handleChange("text")}
                            onKeyDown={this.onKeyDown}
                            value={this.state.text}
                            style={{width:'100%', paddingRight:'100px'}}
                        />
                        <Box style={{position:'relative'}}>
                            <Button onClick={this.clickSubmit} type='submit' style={{position:'absolute',bottom:0, right:0}}>
                                Comment
                            </Button>
                        </Box>
                    </form>
                    : <div><Link to='/login'>Login</Link> or <Link to='/signup'>create an account</Link> to comment.</div>
                )}
                
            </div>
        )
    }
}

export default Comments

const deleteComment = (comment, callback) =>{     
    const token = isAuthenticated().token;
    const commentId = comment._id;
    deleteById(commentId, token)
    .then(data => {
        if(data.error){
            console.log('error')
        }
        else{
            callback(comment)
        }
    })
}

const CommentList = (props) => {
    var dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute:'numeric' };
    if(props.comments.length > 0) {
        return props.comments.map(comment => {
            return(
                <div key={comment._id} style={{marginBottom:'30px'}}>
                    <div style={{display:'flex'}}>
                        <div style={{display:'flex', flexGrow:'1'}}>
                            <Avatar align='middle'
                                component={Link}
                                to={`/user/${comment.user._id}`}
                                src={comment.user.photo_url}
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
                        {(isOwner(comment.user._id) && <Box><IconButton size='small' onClick={() => deleteComment(comment, props.removeComment)}><DeleteIcon fontSize='small' /></IconButton></Box>)}
                    </div>
                    {comment.text} <br/>
                </div>
            )
        })
    }
    return ''
}