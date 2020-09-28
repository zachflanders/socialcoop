import React, { Component } from 'react';
import { Typography, TextField, Button, Paper, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {isAuthenticated} from '../auth';
import {read, update, updateUser} from './apiUser';
import {Redirect} from 'react-router-dom';
import DeleteUser from './DeleteUser'
import DefaultProfile from '../assets/avatar.png';



const styles = theme => ({

    textField: {
      width: '100%',
      marginBottom:'16px'
    }
  });

class EditProfile extends Component {
    constructor(){
        super()
        this.state = {
            id:'',
            name:'',
            redirectToProfile: false,
            error:'',
            loading: false,
            fileSize: 0,
            about:'',
            location:'',
            photo_url: '',
        }
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data =>{
            if(data.error){
                this.setState({redirectToProfile: true})
            }
            else{
                this.setState({
                    id: data._id, 
                    name: data.name, 
                    about:data.about,
                    location: data.location,
                    photo_url: data.photo_url
                })
            }
        })
    }

    componentDidMount(){
        this.userData = new FormData();
        const userId = this.props.match.params.userId;
        this.init(userId);  
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
                    const maxSize = 250;
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
                        this.userData.set(name, blob)
                        this.setState({
                            [name]:blob,
                            photo_url: dataUrl,
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
            this.userData.set(name, value)
            this.setState({[name]: value, fileSize})
        }
        
      };


    isValid = () =>{
        const {name, fileSize} = this.state;
        if(name.length === 0){
            this.setState({error:'Name is required.', loading:false});
            return false
        }
        if(fileSize > 1000000){
            this.setState({error:'File size must be less than 1000kb', loading:false});
            return false
        }
        return true

    }

    clickSubmit = event => {
        event.preventDefault();
        this.setState({loading: true})
        if(this.isValid()){
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            update(userId, token, this.userData)
            .then(data =>{
                if(data.error){
                    console.log(data.error.message);
                    this.setState({error: data.error.message})
                }
                else{
                    updateUser(data, ()=>{
                        this.setState({
                            redirectToProfile: true
                        })
                    })
                    
                }
            });
        }
    }

    editProfileForm = (name, location, about, classes) => {
        return(
            <form >
                <TextField
                    id="name"
                    className={classes.textField}
                    label="Name"
                    onChange={this.handleChange("name")}
                    value={name}
                />
                <TextField
                    id="location"
                    className={classes.textField}
                    label="Location"
                    onChange={this.handleChange("location")}
                    value={location}
                />
                <img src={this.state.photo_url} alt='' width='250'/>
                <Typography color='textSecondary' style={{fontSize:'12px', paddingBottom:'6px'}} >
                    Profile Image
                </Typography>
                <input
                    onChange = {this.handleChange("photo")}
                    accept="image/*"
                    type="file"
                    id='profileUpload'
                    style= {{marginBottom:'16px'}}
                />
                <TextField
                    id="about"
                    multiline
                    className={classes.textField}
                    label="About"
                    onChange={this.handleChange("about")}
                    value={about}
                />
                <Button
                onClick={this.clickSubmit}
                variant='contained'
                color='primary'>
                    Save Edits
                </Button>
            </form>
        )
    }

    render(){
        const { classes } = this.props;
        const { id, name, location, email, password, about, error, redirectToProfile, loading} = this.state;
        if(redirectToProfile){
            return(<Redirect to={`/user/${id}`} />)
        }
        console.log(classes);
        return(
            <div className='container'>
                <Typography variant='h4' style={{flexGrow:'1'}}>
                   Edit Profile
                </Typography> 
                {error}
                <Paper style={{maxWidth:'600px', padding:'16px', marginTop:'16px'}}>
                    {this.editProfileForm(name, location, about, classes)}
                    <br/>
                    {loading ? <div>Loading...</div> : ''}
                </Paper>
                <br/>
            </div>
        )      
    }
}
export default withStyles(styles)(EditProfile);
