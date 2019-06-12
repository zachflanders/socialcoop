import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import {follow, unfollow} from './apiUser'



class FollowProfileButton extends Component {
    constructor(){
        super()
        this.state = {
        }
    }

    followClick = () => {
        this.props.onButtonClick(follow)
    }
    unfollowClick = () => {
        this.props.onButtonClick(unfollow)
    }

    render(){

        return(
            <div>
                {!this.props.following ? 

                <Button
                    variant='contained'
                    color='primary'
                    onClick = {this.followClick}
                >
                    Follow
                </Button>
                :
                <Button
                onClick = {this.unfollowClick}
                >
                    Unfollow
                </Button>
                }

            </div>
        )
        
    }
}
export default FollowProfileButton;