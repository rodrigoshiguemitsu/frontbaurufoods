import {useEffect, useState} from 'react'
import apiLocal from '../../Services/api'



function PagPorcoes(){
    
    const [listaPorcoes,setListaPorcoes]= useState([])

    useEffect(()=>{
        async function VerListaPorcoes(){
            const resListaPorcoes = await apiLocal.get('/ListarPorcoes/files')
            setListaPorcoes(resListaPorcoes.data)
        }
        VerListaPorcoes()
    },[])

    return(
        <div>
            {listaPorcoes.map((porcao)=>{
                return(
                    <div>
                        <p>
                            {porcao.nome}
                        </p>
                        </div>
                )
            })}
        </div>
    )
}
export default PagPorcoes