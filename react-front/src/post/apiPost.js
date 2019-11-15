export const create = (userId, token, post) =>{
    return fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
        method: "POST",
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
    .then(response =>{
        return response.json()
    })
    .catch(err => console.log(err));
}

export const list = () =>{
    return fetch(`${process.env.REACT_APP_API_URL}/posts`, {
        method: "GET",
    })
    .then(response =>{
        return response.json()
    })
    .catch(err => console.log(err));
}

export const getByUserId = (userId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts/by/${userId}`, {
        method: "GET",
    })
    .then(response =>{
        return response.json()
    })
    .catch(err => console.log(err));
}

export const getById = (postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "GET",
    })
    .then(response =>{
        return response.json()
    })
    .catch(err => console.log(err));
}