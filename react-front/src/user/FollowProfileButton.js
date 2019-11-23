import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import {follow, unfollow, read} from './apiUser';
import {isAuthenticated} from '../auth';



class FollowProfileButton extends Component {
    constructor(){
        super()
        this.state = {
            loading: true,
            following: false,
            user: null
        }
    }

    clickFollowButton = user => {
        const myUserId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        follow(myUserId, token, user._id)
        .then(data=>{
            if(data.error){
                this.setState({error: data.error})
            }
            else{
                this.setState({following: !this.state.following})
            }
        })
    }

    clickUnFollowButton = user => {
        const myUserId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        unfollow(myUserId, token, user._id)
        .then(data=>{
            if(data.error){
                this.setState({error: data.error})
            }
            else{
                this.setState({following: !this.state.following})
            }
        })
    }

    checkFollower = user => {
        const jwt = isAuthenticated();
        const match = user.followers ? user.followers.find(follower => {
            return follower._id === jwt.user._id
        }) : false
        return match
    }

    componentDidMount() {
        const jwt = isAuthenticated();
        read(this.props.user._id, jwt.token).then(data=>{
            console.log(data)
            this.setState({
                user: data,
                following: this.checkFollower(data),
                loading: false
            })
        })
    }

    render(){
        return(
            <div>
                {(!this.state.loading && isAuthenticated() && this.props.user._id !== isAuthenticated().user._id &&
                (!this.state.following ? 

                <Button
                    variant='contained'
                    color='primary'
                    onClick = {()=>this.clickFollowButton(this.props.user)}
                >
                    Follow
                </Button>
                :
                <Button
                onClick = {()=>this.clickUnFollowButton(this.props.user)}
                >
                    Unfollow
                </Button>
                ))}

            </div>
        )
        
    }
}
export default FollowProfileButton;