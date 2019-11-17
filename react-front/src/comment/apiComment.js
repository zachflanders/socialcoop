export const comment = (userId, token, postId, comment) =>{
    return fetch(`${process.env.REACT_APP_API_URL}/comment/new/${postId}/${userId}`, {
        method: "POST",
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: comment
    })
    .then(response =>{
        return response.json()
    })
    .catch(err => console.log(err));
}

export const getComments = (postId) => {
    console.log('getting comments')
    return fetch(`${process.env.REACT_APP_API_URL}/comments/${postId}`, {
        method: "GET",
    })
    .then(response =>{
        return response.json()
    })
    .catch(err => console.log(err));
}