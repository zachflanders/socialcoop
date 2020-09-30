import React, { Component } from 'react';
import { Typography, TextField, Button, Paper, Divider, Container, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {isAuthenticated} from '../auth';
import {create} from './apiPost';
import ImageIcon from '@material-ui/icons/Image';

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
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const elem = document.createElement('canvas');
                    const maxSize = 800;
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
                    const dataUrl = ctx.canvas.toDataURL('image/jpeg');
                    ctx.canvas.toBlob((blob)=>{
                        this.postData.set(name, blob)
                        this.setState({
                            [name]:blob,
                            photoURL: dataUrl,
                            fileSize: blob.size
                        });
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
        return(
            <form >
                <TextField
                    id="title"
                    color='secondary'
                    className={classes.textField}
                    label="Title"
                    onChange={this.handleChange("title")}
                    value={title}
                    />
                <img src={this.state.photoURL} alt='' width='100%'/>
                <label htmlFor="photoUpload">
                    <input
                        onChange = {this.handleChange("photo")}
                        style={{ display: 'none' }}
                        id='photoUpload'
                        name="photoUpload"
                        type="file"
                        accept="image/*"
                    />

                    <IconButton color="secondary" variant="contained" component="span">
                        <ImageIcon />
                    </IconButton>
                    <br /><br />
                </label>
                <TextField
                    color='secondary'
                    id="body"
                    multiline
                    className={classes.textField}
                    label="Post"
                    onChange={this.handleChange("body")}
                    value={body}
                    variant="outlined"
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
            <Container>
                <Typography variant='h4' style={{maxWidth:'700px', marginRight:'auto', marginLeft:'auto'}}>
                Create a New Post
                </Typography> 
                {error}
                <Paper style={{maxWidth:'700px', padding:'16px', marginTop:'16px', marginRight:'auto', marginLeft:'auto'}}>
                    {this.newPostForm(title, body, photo, user, classes)}
                    <br/>
                    {loading ? <div>Loading...</div> : ''}
                </Paper>                
                <br/>
            </Container>
        )      
    }
}
export default withStyles(styles)(NewPost);