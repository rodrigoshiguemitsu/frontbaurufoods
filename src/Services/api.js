import axios from 'axios';



const apiLocal = axios.create({

    baseURL:"http://localhost:3333",
    headers:{
        'Access-Control-Allow-Origin':'*',
        'Content-Type':'application/json'
    }

})

export default apiLocal