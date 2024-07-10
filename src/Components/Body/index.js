import { useEffect, useState } from 'react'
import { FiShoppingBag } from 'react-icons/fi'
import { useContador } from '../../ContContext/ContContext'
import { toast } from 'react-toastify'
import { AiOutlineClose } from 'react-icons/ai'


import Modal from 'react-modal'
import apiImg from '../../Services/apiImg'
import apiLocal from '../../Services/api'
import imgLogo from '../../Multimidia/LogoMarca.png'
import './body.scss'
import ListarCategorias from '../ListaCategorias/ListarCategorias'




function BodyCorpo() {

    const { incrementarContador } = useContador()

    const [modalAberto, setModalAberto] = useState(false)
    const [produtoSelecionado, setProdutoSelecionado] = useState(null)

  
    const [listaProdutos, setListaProdutos] = useState([])
    const [produtoLocalStorage, setProdutoLocalStorage] = useState([])



    useEffect(() => {

        async function VerProdutos() {
            const respostaProdutos = await apiLocal.get('/ListarProdutos/files', {
                params: {
                    sortBy: 'createdAt',
                    sortOrder: 'asc'
                }
            })
            setListaProdutos(respostaProdutos.data)

        }
        VerProdutos()
    }, [])


    const abrirModal = (produto) => {
        setProdutoSelecionado(produto)
        setModalAberto(true)
    }
    const fecharModal = () => {
        setProdutoSelecionado(null)
        setModalAberto(false)
    }

    //Adicionar Produto ao carrinho



    const AddLocalStorage = (produto) => {
        try {

            const ProdutoExistente = produtoLocalStorage.find(item => item.id === produto.id)

            if (!ProdutoExistente) {
                const ProdutoAtualizado = [...produtoLocalStorage, produto]
                setProdutoLocalStorage(ProdutoAtualizado)

                localStorage.setItem('listaProdutos', JSON.stringify(ProdutoAtualizado))

                toast.success("Produto adicionado no carrinho", produto)
                incrementarContador()


            } else {
                toast.warn('Produto selecionado')
            }
        } catch (error) {
            toast.error("Erro ao salvar o produto no localStorage", error)
        }
    }




    return (
        <div id='div_corpo_pricipal'>
            
            <div >

            <ListarCategorias />
            </div>


            <section id='div_body_principal'>
                <hr />
                <h1 id='aga1_promocoes'> Promoções </h1>
                <div>

                    {listaProdutos.map((produto) => {
                        return (
                            <div
                                id='div_produtos_principal'
                                key={produto.id}
                            >

                                <div id='div1_produtos_conteudo'>


                                    <img src={imgLogo} alt='logo' />



                                    <p>Valor:{produto.preco}</p>
                                    <p>{produto.dataInicial}</p>
                                    <p>{produto.dataValidade}</p>
                                    <p>{produto.quantidade}</p>
                                    <p>{produto.concorrentePreco}</p>

                                </div>

                                <div
                                    id='div2_produtos_conteudo'
                                >
                                    <img src={`${apiImg}${produto.banner}`} alt='banner' />
                                </div>

                                <div
                                    id='div3_produtos_conteudo'
                                >
                                    <h1>{produto.nome}</h1>

                                    <p>{produto.descricao}</p>

                                    <div id='button_detalhes'>

                                        <p>
                                            R$ {produto.preco}
                                        </p>
                                        {/* //Abrir modal */}
                                        <button onClick={() => abrirModal(produto)}> Detalhes </button>
                                    </div>

                                    <div id='button_add_carrinho'>

                                        {/* //Gravar produto no carrinho */}
                                        <button onClick={() => AddLocalStorage(produto)}>
                                            Add ao carrinho<FiShoppingBag id='icon_sacola' />
                                        </button>
                                    </div>


                                </div>

                                {produtoSelecionado && (

                                    <Modal
                                        isOpen={modalAberto}
                                        onRequestClose={fecharModal}
                                        contentLabel='exemplo Modal'
                                        
                                    >

                                        <div id='div_modal_principal' >
                                        <AiOutlineClose onClick={fecharModal} id='div_button_modal'/>
                                        <img src={`${apiImg}${produtoSelecionado.banner}`} alt='banner' />
                                        <div id='div_detalhes'>

                                            <div id='div1_detalhes'>

                                                <h2>{produtoSelecionado.nome}</h2>
                                                <p>Pedido liberado:<br/>{produtoSelecionado.dataInicial}</p>
                                                <p>Ultimo dia para retirada:<br/>{produtoSelecionado.dataValidade}</p>
                                            </div>

                                            <div id='div2_detalhes'>
                                                <h2>Descrição do produto:</h2>
                                                <p >{produtoSelecionado.descricao}</p>
                                                <p id='preco_concorrencia'>Preço na concorrencia delivery:<s>{produtoSelecionado.concorrentePreco}</s> </p>
                                                <p id='preco_bauru_foods'>Preço Bauru-Foods:<br/>{produtoSelecionado.preco}</p>
                                            </div>
                                        </div>
                                            
                                        </div>


                                    </Modal>
                                )}

                            </div>
                        )
                    })}
                </div>
            </section>




        </div>


    )
}
export default BodyCorpo