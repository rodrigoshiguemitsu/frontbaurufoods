import {useEffect, useState} from 'react'
import apiLocal from '../../Services/api'

function PagPets(){

    const [listaProdutosPets,setlistaProdutosPets]=useState([])


useEffect(()=>{
    async function VerProdutosPets(){
        const ProdutosPets = await apiLocal.get('/ListarPets/files')
        setlistaProdutosPets(ProdutosPets.data)
    }
    VerProdutosPets()
},[])

    return(
        <div>
            {listaProdutosPets.map((produtopet)=>{
                return(
                    <div>
                        <p>{produtopet.nome}</p>
                        <p>{produtopet.categoriaId}</p>
                        </div>
                )
            })}

            <h1>PagPets</h1>
        </div>

    )
}

export default PagPets