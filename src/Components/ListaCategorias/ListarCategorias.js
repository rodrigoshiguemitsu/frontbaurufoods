import { useEffect,useState,useRef } from "react"
import { Link } from "react-router-dom"

import apiImg from "../../Services/apiImg"
import apiLocal from "../../Services/api"
import './listarCategorias.scss'

function ListarCategorias(){

    const elementosRef = useRef(null)

    const smoothScroll = (scrollOffset) => {
        const startPosition = elementosRef.current.scrollLeft;
        const distance = scrollOffset;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, 500);
            elementosRef.current.scrollLeft = run;
            if (timeElapsed < 500) requestAnimationFrame(animation);
        };

        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
    };

    const avancar = () => {
        smoothScroll(500);
    };

    const voltar = () => {
        smoothScroll(-500);
    };




    const [listaCategoria, setListaCategoria] = useState([])

    useEffect(() => {
        const iToken = localStorage.getItem('@usubaurufoods')
        const token = JSON.parse(iToken)
        async function VerCategorias() {

            const resposta = await apiLocal.get('/ListarCategoria/files',{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            setListaCategoria(resposta.data)
        }
        VerCategorias()
    }, [])


    return(
        <div>
           
<section id='div_categorias1_corpo' ref={elementosRef}>
    
            <div id='div-left-todosCursos'>
                    <button className='rolagemLateral left-lateral' onClick={voltar}>&lt;</button>
             </div> 
        
{listaCategoria.map((categoria) => {
    return (
        <div
            id='div_categoria_filha1'
            key={categoria.id}>  

            

            {/* <Link to={categoria.nomeCategoria} id="link_categoria"> */}
            <Link to='#' id="link_categoria">
                <img id='img_banner_categoria' src={`${apiImg}${categoria.banner}`} alt='banner' />

                <p>{categoria.nomeCategoria}</p>
            </Link>
        
        </div>
    )
})}
                    <div id='div-rigth-todosCursos'>
                    <button className='rolagemLateral rigth-lateral' onClick={avancar}>&gt;</button>
                    </div>
</section>

        </div>
    )
}
export default ListarCategorias