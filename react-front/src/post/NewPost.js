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

class NewPost extends Component {
    constructor(){
        super()
        this.state = {
            title:'',
            body:'',
            photo:'',
            error:'',
            user:{},
            fileSize:0,
            loading: false,
            photoURL: '',
        }
    }


    componentDidMount(){
        this.postData = new FormData();
        this.setState({user:isAuthenticated().user})
    }

    handleChange = (name) => (event) => {
        this.setState({error:''});
        if(name==='photo'){
            console.log('photo')
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const elem = document.createElement('canvas');
                    const maxSize = 800;
                    console.log(img)
                    let width = img.width;
                    let height = img.height;
                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }
                    elem.width = width;
                    elem.height = height;
                    const ctx = elem.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    console.log(ctx);
                    const dataUrl = ctx.canvas.toDataURL('image/jpeg');
                    ctx.canvas.toBlob((blob)=>{
                        console.log(blob, dataUrl)
                        this.postData.set(name, blob)
                        this.setState({
                            [name]:blob,
                            photoURL: dataUrl,
                            fileSize: blob.size
                        });
                        console.log(this.state)    
                    });
                }
                reader.onerror = error => console.log(error);
            }
        }
        else{
            const value =  event.target.value;
            const fileSize =  0;
            this.postData.set(name, value)
            this.setState({[name]: value, fileSize})
        }
        
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

    newPostForm = (title, body, photo, user, classes) => {
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
            <img src={this.state.photoURL} alt='' width='100%'/>
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
                    {this.newPostForm(title, body, photo, user, classes)}
                    <br/>
                    

                    {loading ? <div>Loading...</div> : ''}
                </Paper>
                
                <br/>
         

            </div>
        )      
    }
}
export default withStyles(styles)(NewPost);