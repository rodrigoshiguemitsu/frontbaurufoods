import { useContext,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../Context/AuthContext"
import apiLocal from "../../Services/api"




import BodyCorpo from "../../Components/Body"
import Header from "../../Components/Header"
import { ContadorProvider } from "../../ContContext/ContContext"
import FooterRodape from "../../Components/Footer"



function Home(){

    // Fazer aqui a lógica de proteção de token, se tem token e se o token e válido continue aqui se nao, navegar para tela de login!

    const navigate = useNavigate()
    const {loginToken} = useContext(AuthContext)

    useEffect(()=>{
        const iToken = localStorage.getItem('@usubaurufoods')
        const token = JSON.parse(iToken)

        if(!token){
            navigate('/Login')
            return
        }else if (token){
            async function VerToken(){
                const resposta = await apiLocal.get('/ListarClienteToken',{
                    headers:{
                        Authorization: `Bearer ${token}`
                    },
                })
                
                if(resposta.data.dados){
                    localStorage.removeItem('@usubaurufoods')
                    navigate('/Login')
                    return
                
                }else if (resposta.data.id){
                    navigate('/')
                    return
                }
            }
            VerToken()
        }

    },[loginToken,navigate])

    

    return(
       <div>
        <ContadorProvider>

        <div>

            <Header/>
        </div>
        <div>

            <BodyCorpo/>
        </div>
        
        <div>
            <FooterRodape/>
        </div>
        
        </ContadorProvider>
       </div>
    )
}

export default Home