import axios from 'axios'
export const loginCall = async (userCredential,dispatch) => {
    console.log(userCredential);
    dispatch({type : "LOGIN_START"})
    try {
        const res = await axios.post("http://localhost:5000/api/auth/login",userCredential)
        dispatch({type : "LOGIN_SUCCESS",payload : res.data})
        console.log(res.data)
    } catch (error) {
        dispatch({type : "LOGIN_FAILURE",payload : error})
    }
}