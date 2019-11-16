import React, { Component } from 'react';
import { Typography, TextField, Button, Paper, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {isAuthenticated} from '../auth';
import {getById, update} from './apiPost';
import {Redirect} from 'react-router-dom';
import DeletePost from './DeletePost';

const styles = () => ({
    textField: {
      width: '100%',
      marginBottom:'16px'
    }
  });

class EditPost extends Component {
    constructor(){
        super()
        this.state = {
            id: '',
            title: '',
            body: '',
            photo: '',
            error: '',
            user: {},
            fileSize: 0,
            loading: false
        }
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));        
        bytes.forEach((b) => binary += String.fromCharCode(b));        
        return window.btoa(binary);
    };

    init = (postId) => {
        getById(postId)
        .then(data =>{
            if(data.error){
                console.log(data.error)
            }
            else{
                var base64Flag = data.photo ? 'data:image/jpeg;base64,' : '';
                var imageStr = data.photo ? (this.arrayBufferToBase64(data.photo.data.data)) : '';
                this.setState({
                    id: data._id, 
                    title: data.title, 
                    body: data.body,
                    photo: data.photo ? (base64Flag + imageStr) : null 
                })
            }
        })
    }


    componentDidMount(){
        this.postData = new FormData();
        this.setState({user:isAuthenticated().user})
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    handleChange = (name) => (event) => {
        this.setState({error:''});
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.postData.set(name, value)
        this.setState({[name]: value, fileSize})
      };


    isValid = () =>{
        const {title, body, fileSize} = this.state;
        if(title.length === 0){
            this.setState({error:'Title is required.', loading:false});
            return false
        }
        if(body.length === 0){
            this.setState({error:'Post body is required.', loading:false});
            return false
        }   
        if(fileSize > 800000){
            this.setState({error:'File size must be less than 800kb', loading:false});
            return false
        }
        return true

    }

    clickSubmit = event => {
        event.preventDefault();
        this.setState({loading: true})
        if(this.isValid()){
            const token = isAuthenticated().token;
            const postId = this.props.match.params.postId;
            update(postId, token, this.postData)
            .then(data =>{
                if(data.error){
                    this.setState({error: data.error.message})
                }
                else{
                    console.log('edited post');
                    this.setState({
                        loading: false
                    })               
                }
            });
        }
    }

    editPostForm = (title, body, photo, id, classes) => {
        //const photoURL = id ? `${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}` : ''
        return(
        
        <form >
          <TextField
            id="title"
            className={classes.textField}
            label="Title"
            onChange={this.handleChange("title")}
            value={title}
            />
            <img src={photo} width='100%' alt='' />
            <input
                onChange = {this.handleChange("photo")}
                accept="image/*"
                type="file"
                id='photoUpload'
                style= {{marginBottom:'16px'}}
                />
            <TextField
                id="body"
                multiline
                className={classes.textField}
                label="Post"
                onChange={this.handleChange("body")}
                value={body}
            />
            <Button
            onClick={this.clickSubmit}
            variant='contained'
            color='primary'>
                Update
            </Button>
        </form>
      )
        }

    render(){
        const { classes } = this.props;
        const {id, title, body, photo, user, loading, error} = this.state;
        return(
            <div className='container'>
                <Typography variant='h4' style={{flexGrow:'1'}}>
                   Edit Post
                </Typography> 
                {error}
                <Paper style={{maxWidth:'600px', padding:'16px', marginTop:'16px'}}>
                    {this.editPostForm(title, body, photo, id, classes)}
                    <br/>
                    <DeletePost id={id} />
                    {loading ? <div>Loading...</div> : ''}
                </Paper>
                
                <br/>
         

            </div>
        )      
    }
}
export default withStyles(styles)(EditPost);