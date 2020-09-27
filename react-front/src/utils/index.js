import { isAuthenticated } from '../auth';

const isOwner = (id) => {
    if (isAuthenticated()){
        return id === isAuthenticated().user._id
    }
    return false
    
}

export {isOwner};