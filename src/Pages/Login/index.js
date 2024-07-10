import React,{ useContext,useEffect,useState } from "react"
import { useNavigate,Link } from "react-router-dom"
import {AuthContext} from '../../Context/AuthContext'
import { toast } from 'react-toastify'

import apiLocal from "../../Services/api"

import imgLogo from '../../Multimidia/LogoMarca.png'

import './Login.scss'

function Login(){


const navigate = useNavigate()
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')

const {signIn} = useContext(AuthContext) 


useEffect(()=>{
    
    const iToken = localStorage.getItem('@usubaurufoods')
    const token = JSON.parse(iToken)
    if(!token){
        navigate('/Login')
        return
    }else if(token){
        async function VerToken(){
            const resposta = await apiLocal.get('/LoginController',{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            if(resposta.data.dados){
                localStorage.removeItem('@usubaurufoods')
                navigate('/Login')
                return
            }else if(resposta.data.id){
                navigate('/')
                return
            }
        }
        VerToken()
    }
},[navigate])

useEffect(()=>{
    const iToken = localStorage.getItem("@usubaurufoods")
    const token =JSON.parse(iToken)
    async function handleLogin(){

        if(!token){
            navigate('/Login')
            return
        }else if(token){
            navigate('/')
            return
        }
    }
    handleLogin()
},[navigate])



    async function FazerLogin(e){
        e.preventDefault()
        if(!email || !password){
            toast.warn('campos em brancos não são permitidos')
            return
        }
        let data ={
            email,
            password
        }
        const resposta = await signIn(data)
        if(!resposta){
            toast.error('erro de login')
        }else if (resposta.status === 200){
            const token = resposta.data.token
            localStorage.setItem('@usubaurufoods',JSON.stringify(token))
            toast.success('login efetuado com sucesso')
            navigate('/')
        }
    }
    


    return(
        <div>
            <header id="header_Login">
                <div className="div_header_login">
                    <img src={imgLogo} alt=" banner"/>
                </div>

                <div className="div_header_login">   
                    <div id="div_cadastrar_login">
                        <Link id="link_cadastrar_login" to='/Cadastrar'>Cadastre-se</Link>
                    </div>
                </div>
            </header>
            
            <div id="div_body_Login">
                <form onSubmit={FazerLogin}
                id="div_form_login"
                >
                    <div id="div_label_input_login">

                    <div id="div_label">
                        <p><label>Email:</label></p>
                        <p><label>Senha:</label></p>
                    </div>
                    
                    <div id="div_input">

                    <input
                    type="email"
                    // autoComplete="username"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    /><br/>
                    
                    <input
                    type="password"
                    // autoComplete="current-password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                    </div>

                    </div>
                    <button id="button_login" type="submit">Login</button>
                </form>
                
            </div>
        </div>
    )
}
export default Login