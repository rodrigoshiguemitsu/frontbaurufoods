import {useEffect, useState} from 'react'
import apiLocal from '../../Services/api'



function PagLanches(){


    const [listaLanches,setListaLanches]=useState([])


useEffect(()=>{
    async function VerLanchesProdutos(){
        const VerLanches = await apiLocal.get('/ListarLanches/files')
        setListaLanches(VerLanches.data)
    }
    VerLanchesProdutos()
},[])

    return(
        <div>
            {listaLanches.map((lanche)=>{
                return(
                    <div>
                        <p>{lanche.nome}</p>
                    </div>
                )
            })}
            <h1>Olá Pag Lanches</h1>
        </div>
    )
}

export default PagLanches