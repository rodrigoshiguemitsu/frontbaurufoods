import { TiShoppingCart } from 'react-icons/ti'
import { AiOutlineClose } from 'react-icons/ai'
import { IoTrashBin } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { useContador } from '../../ContContext/ContContext'
import { IoMdExit } from "react-icons/io";
import { toast } from 'react-toastify'


import Modal from 'react-modal'
import LogoMarca from '../../Multimidia/LogoMarca.png'
import apiImg from '../../Services/apiImg'
import './header.scss'
import apiLocal from '../../Services/api'
import { AuthContext } from '../../Context/AuthContext'

function Header() {

    const { contador } = useContador()
    const [produto, setProduto] = useState([])
    const [carrinhoAberto, setCarrinhoAberto] = useState(false)
    const [contadorItem, setContadorItem] = useState(1)
    const [codCliente,setCodCliente] = useState ([])
    const [tituloCarrinho,setTituloCarrinho] = useState('')


    const navigate = useNavigate()
    const { loginToken } = useContext(AuthContext)

    useEffect(()=>{
        const iToken = localStorage.getItem('@usubaurufoods')
        const token = JSON.parse(iToken)
        async function handleCliente(){
            const resClientePag = await apiLocal.get('/ClientePagController', {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            setCodCliente(resClientePag.data.codigoIdCliente)
            
        }handleCliente()

    },[loginToken])

    useEffect(() => {
        function handleRecuperarProduto() {
            const produtoRecuperado = localStorage.getItem('listaProdutos')
            

            if (produtoRecuperado) {
                const produto = JSON.parse(produtoRecuperado)
                
                // console.log(produto)
                setProduto(produto)
                
            }
        }   

            if(carrinhoAberto){
                setTituloCarrinho('Suas compras')
            }
       handleRecuperarProduto()
    }, [carrinhoAberto])


    



    const abrirCarrinho = () => {
        setCarrinhoAberto(!carrinhoAberto)
    }
    
    
    

    const contadorPositivo = (id) => {
        setContadorItem(preveContadores => ({
            ...preveContadores,
            [id]: Math.min((preveContadores[id] || 1) + 1, 5)
        }))
    }

    const contadorNegativo = (id) => {
        setContadorItem(preveContadores => ({
            ...preveContadores,
            [id]: Math.max((preveContadores[id] || 2) - 1, 1)
        }))
    }

    const valorTotal = produto.reduce((total, itemProduto) => {
        // Calcula o subtotal de cada produto
        const subtotal = (itemProduto.preco * contadorItem[itemProduto.id]) || itemProduto.preco;

        // Soma o subtotal ao total
        return total + parseFloat(subtotal);
    }, 0); // Inicializa o total como zero


    const carrinhoCompleto = {
        produtos: produto,
        valorTotal: valorTotal,
        contadorItem: contadorItem
    }
    localStorage.setItem('carrinhoCompleto', JSON.stringify(carrinhoCompleto))


    function FinalizarCompra(e) {
        e.preventDefault()
        if(valorTotal === 0){
            navigate('/')
            toast.warn('Ops seu carrinho está vazio')
            window.location.reload()
            return
        }else{
            navigate('/Pagamento')
        }
    }
    
    const deletarItem = (id) =>{
        const updateProdutos = produto.filter(itemProduto=>itemProduto.id !== id)

        setProduto(updateProdutos)

        localStorage.setItem('listaProdutos', JSON.stringify(updateProdutos))

        toast.error('Produto removido')
    }


    async function handleSair(e){
        e.preventDefault()
        localStorage.removeItem('carrinhoCompleto')
        localStorage.removeItem('listaProdutos')
        localStorage.removeItem('@usubaurufoods')
        navigate('/Login')
    }

    return (
        <div id='headerBauruFoods'>
            <header id='header_bauru_filha'>

                <div id='logoHeaderBauruFoods'>
                    <img src={LogoMarca} alt='LogoBauruFoods' />
                    
                </div>
                <p>Cód. Identificação:<strong>{codCliente}</strong> </p>
                <div id='ver_carrinho_header'>
                    <button onClick={abrirCarrinho}>
                        <TiShoppingCart />Ver Carrinho
                        
                    </button>

                    
                </div>

                <div id='button_sair_header'>
                <IoMdExit id='button_sair' onClick={handleSair} title='Sair' />
                </div>

                {carrinhoAberto && (

                    <Modal
                        isOpen={carrinhoAberto}
                        onRequestClose={abrirCarrinho}
                        contentLabel="Carrinho de Compras"
                        ariaHideApp={false} // Para evitar erro de acessibilidade
                    >
                        <div id='modal_principal'>
                            <div id='modal_cabecalho'>
                                <div className='titulo_fechar_modal'>
                                <h2>{tituloCarrinho}</h2>
                               
                                </div>
                               
                                <img src={LogoMarca} alt='Logomarca'/>
                            

                                <div className='titulo_fechar_modal'>
                                <AiOutlineClose id='FecharModal' onClick={abrirCarrinho} />
                                </div>
                            </div>

                            <div id='div_modal_produtos'>
                                {produto.map((itemProduto) => {
                                    const banner1 = itemProduto.banners[0]
                                    const banner2 = itemProduto.banners[1]

                                    return (
                                        <div id='div_filha_produtos' key={itemProduto.id}>
                                            <div id='div_img_produtos'>
                                            <img src={`${apiImg}${banner1.url}`} alt='imagem' />
                                            </div>
                                            <div id='div_titulo_contador'>
                                                <h1>{itemProduto.nome}</h1>
                                                <p>Quantidade:</p>
                                                <div id='div_qtd_carrinho'>
                                                    <button onClick={() => contadorNegativo(itemProduto.id)}>-</button>
                                                    <p id='numeroCarrinho'>{contadorItem[itemProduto.id] || 1}</p>
                                                    <button onClick={() => contadorPositivo(itemProduto.id)}>+</button>
                                                    <IoTrashBin id='lixeira_modal_header' onClick={()=>deletarItem(itemProduto.id)} />
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div id='div_modal_valorTotal'>
                                <h2 id='valor_total'>Subtotal:</h2>
                                <p id="p2">R$ {valorTotal.toFixed(2)}</p>
                            </div>

                            <button id='button_modal_finalizarCompra' onClick={FinalizarCompra}>Finalizar compra</button>
                        </div>
                    </Modal>
                )}

            </header>
        </div>
    )
}

export default Header