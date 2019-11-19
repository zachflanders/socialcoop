import { isAuthenticated } from '../auth';

const isOwner = (id) => {
    return id === isAuthenticated().user._id
}

export {isOwner};