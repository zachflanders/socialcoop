import React, { Component } from 'react';
import { Typography, TextField, Button, Paper, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {isAuthenticated} from '../auth';
import {create} from './apiPost';
import {Redirect} from 'react-router-dom';


const styles = theme => ({

    textField: {
      width: '100%',
      marginBottom:'16px'
    }
  });

class EditPost extends Component {
    constructor(){
        super()
        this.state = {
            title:'',
            body:'',
            photo:'',
            error:'',
            user:{},
            fileSize:0,
            loading: false
        }
    }


    componentDidMount(){
        this.postData = new FormData();
        this.setState({user:isAuthenticated().user})
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
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token;
            create(userId, token, this.postData)
            .then(data =>{
                if(data.error){
                    this.setState({error: data.error.message})
                }
                else{
                    console.log('new post');
                    this.setState({
                        loading:false,
                        title: '',
                        body: '',
                        photo:''
                    })                
                }
            });
        }
    }

    editPostForm = (title, body, photo, user, classes) => {
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
                Publish
            </Button>
        </form>
      )
        }

    render(){
        const { classes } = this.props;
        const { title, body, photo, user, loading, error} = this.state;
        return(
            <div className='container'>
                <Typography variant='h4' style={{flexGrow:'1'}}>
                   Create a New Post
                </Typography> 
                {error}
                <Paper style={{maxWidth:'600px', padding:'16px', marginTop:'16px'}}>
                    {this.editPostForm(title, body, photo, user, classes)}
                    <br/>
                    

                    {loading ? <div>Loading...</div> : ''}
                </Paper>
                
                <br/>
         

            </div>
        )      
    }
}
export default withStyles(styles)(EditPost);