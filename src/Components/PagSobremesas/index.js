import {useEffect, useState} from 'react'
import apiLocal from '../../Services/api'



function PagSobremesas(){

const [listaSobremesas,setListaSobremesas]= useState([])

useEffect(()=>{
    async function verSobremesas(){
        const resVerSobremesas = await apiLocal.get('/ListarSobremesas/files')
        setListaSobremesas(resVerSobremesas.data)
    }
    verSobremesas()
},[])


    return(
        <div>
            {listaSobremesas.map((sobremesa)=>{
                return(
                    <div>
                        <p>{sobremesa.nome}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default PagSobremesas