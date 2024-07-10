import {createContext,useState} from 'react'
import apiLocal from '../Services/api'



export const AuthContext = createContext()

export default function AuthProvider({children}){

    const [user,setUser]=useState('')

    const isAutenticado = !!user

    const iToken = localStorage.getItem('@usubaurufoods')
    const token = JSON.parse(iToken)

    async function loginToken(){
        try {
            const respostaToken = await apiLocal.get('/ListarClienteToken',{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(respostaToken)
            setUser(respostaToken)

        } catch (error) {
            console.log("Erro no contexto loginToken",error)
        }
    }


    async function signIn({email,password}){
        try {
            const resposta = await apiLocal.post('/LoginController',{
                email,
                password
            })
            return (resposta)
        } catch (erro) {
            console.log("Erro no contexto signIn")
            return (erro)
        }
    }

    return(
        <AuthContext.Provider value={{signIn, loginToken}}>
            {children}
        </AuthContext.Provider>
    )


}

