import { useEffect, useState,useContext } from 'react'
import { AuthContext } from '../../Context/AuthContext';
import { FiShoppingBag } from 'react-icons/fi'
import { FaWhatsapp } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import { useContador } from '../../ContContext/ContContext'
import { toast } from 'react-toastify'
import { AiOutlineClose } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'


import Modal from 'react-modal'
import apiImg from '../../Services/apiImg'
import apiLocal from '../../Services/api'
import imgLogo from '../../Multimidia/LogoMarca.png'
import ListarCategorias from '../ListaCategorias/ListarCategorias'
import './body.scss'




const CountdownTimer = ({ endTime }) => {

    const calculateTimeLeft = () => {
        const difference = new Date(endTime) - new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                dia: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hr: Math.floor((difference / (1000 * 60 * 60)) % 24),
                m: Math.floor((difference / 1000 / 60) % 60),
                s: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());



    useEffect(() => {
        function updateTimer() {
            setTimeLeft(calculateTimeLeft());

            const timer = setTimeout(updateTimer, 1000);

            return () => clearTimeout(timer);
        } updateTimer()

    }, [endTime]); // Dependência do useEffect, atualiza quando endTime muda


    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }

        timerComponents.push(
            <span key={interval}>
                {timeLeft[interval]} {interval}{' '}
            </span>
        );
    });

    return (
        <div>
            {timerComponents.length ? timerComponents : <span>Tempo esgotado!</span>}
        </div>
    );
};



const formattedDate = (date) => {
    const options = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };

    return new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));
};






function BodyCorpo() {

    const { incrementarContador } = useContador()

    const [modalAberto, setModalAberto] = useState(false)
    const [produtoSelecionado, setProdutoSelecionado] = useState(null)


    const [listaProdutos, setListaProdutos] = useState([])
    const [produtoLocalStorage, setProdutoLocalStorage] = useState([])



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


    useEffect(() => {

        async function VerProdutos() {
            const iToken = localStorage.getItem('@usubaurufoods')
            const token = JSON.parse(iToken)
            try {
                const respostaProdutos = await apiLocal.get('/ListarProdutos/files',{
                    headers:{
                        Authorization:`Bearer ${token}`
                    },
                    params: {
                        sortBy: 'createdAt',
                        sortOrder: 'asc'
                    }
                })
                setListaProdutos(respostaProdutos.data)
            } catch (error) {
                toast.error('Erro ', error)
            }
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

                        const isTimeExpired = Date.now() > new Date(produto.end_time).getTime()

                        const banner1 = produto.banners[0]
                        const banner2 = produto.banners[1]

                        const precoAtualFix = parseFloat(produto.precoAtual).toFixed(2)

                        return (
                            <div
                                id='div_produtos_principal'
                                key={produto.id}
                            >

                                <div id='div1_produtos_conteudo'>

                                    <p>DE:<s>{precoAtualFix}</s></p>
                                    <p className='descontoProduto'>{produto.desconto}% OFF</p>
                                    <img src={`${apiImg}${banner2.url}`} alt='banner' />
                                    {/* {formattedDate(produto.end_time)} */}


                                    <p>Por apenas:</p>
                                    <p className='descontoProduto'>R$ {produto.preco}</p>

                                </div>

                                <div

                                    id='div2_produtos_conteudo'
                                >

                                    <img src={`${apiImg}${banner1.url}`} alt='banner' />


                                </div>

                                <div
                                    id='div3_produtos_conteudo'
                                >
                                    <img src={imgLogo} alt='logo' />
                                    <h1>{produto.nome}  </h1>

                                    <div id='button_detalhes'>


                                        <button onClick={() => abrirModal(produto)}

                                        > Detalhes </button>
                                    </div>

                                    <div id='button_add_carrinho'>

                                        {/* //Gravar produto no carrinho */}
                                        <button id='addCarrinho_button' onClick={() => AddLocalStorage(produto)}
                                            disabled={isTimeExpired}
                                        >
                                            Add ao carrinho<FiShoppingBag id='icon_sacola' />
                                        </button>

                                    </div>
                                    <div id='Hora_endTime'>

                                        <CountdownTimer endTime={produto.end_time} />
                                    </div>

                                </div>

                                {produtoSelecionado && (


                                    <Modal
                                        isOpen={modalAberto}
                                        onRequestClose={fecharModal}
                                        contentLabel='exemplo Modal'
                                        ariaHideApp={false} // Para evitar erro de acessibilidade

                                    >

                                        <div id='div_modal_principal' key={produtoSelecionado.id}>
                                            <div className='div_informacoes_Loja'>
                                            <AiOutlineClose onClick={fecharModal} id='div_button_modal' />
                                                <img id='img_logoEmpresa_modal_body' src={`${apiImg}${produtoSelecionado.banners[1].url}`} alt='banner' />
                                                <h1>{produtoSelecionado.nome}  </h1>

                                                
                                            </div>

                                            <div id='div_detalhes'>
                                                
                                                <img id='img_modal_body' src={`${apiImg}${produtoSelecionado.banners[0].url}`} alt='banner' />

                                                <div id='div2_detalhes'>
                                                    <h2>Descrição do produto:</h2>
                                                    <p >{produtoSelecionado.descricao}</p>
                                                    <p id='preco_concorrencia'>Preço normal:<s>{produtoSelecionado.precoAtual}</s> </p>
                                                    <p id='preco_bauru_foods'>Preço Bauru-Foods:<br />{produtoSelecionado.preco}</p>

                                                </div>


                                            </div>



                                            <div id='info_loja'>
                                                <h2>Loja parceira:</h2>
                                                <div id='div_flex_modal_loja'>

                                                    <div id='div1_detalhes'>

                                                        <h2>{produtoSelecionado.nome}</h2>
                                                        <p>Início:<br />{formattedDate(produtoSelecionado.dataInicial)}</p>
                                                        <p>Ultimo dia para retirada:<br />{formattedDate(produtoSelecionado.dataValidade)}</p>
                                                    </div>



                                                    <div className='div_informacoes_Loja'>

                                                        <p><Link to={`https://web.whatsapp.com/send?phone=55${produtoSelecionado.whatsappLoja}`} target='_blanck' className='link_info'><FaWhatsapp />{produtoSelecionado.whatsappLoja}</Link></p>

                                                        <p><Link to={produtoSelecionado.linkComoChegar} target='_blanck' className='link_info'><SiGooglemaps />Como chegar</Link></p>

                                                        <p>{produtoSelecionado.enderecoEmpresa}</p>

                                                    </div>

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