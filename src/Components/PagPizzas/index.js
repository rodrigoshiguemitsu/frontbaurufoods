import {useEffect, useState} from 'react'
import apiLocal from '../../Services/api'



function PagPizzas(){

    const [listaPizzas,setListaPizzas]= useState([])

    useEffect(()=>{
        async function VerProdutosPizzas(){
            const resProdutoPizzas = await apiLocal.get('/ListarPizzas/files')
            setListaPizzas(resProdutoPizzas.data)
        }
        VerProdutosPizzas()
    },[])


    return(
        <div>
            {listaPizzas.map((pizza)=>{
                return(
                    <div>
                        <p>
                            {pizza.nome}
                        </p>
                    </div>
                )
            })}


            <h1>Olá Pág pizzas</h1>
        </div>
    )
}

export default PagPizzas