import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { FaWhatsapp } from "react-icons/fa";
import { toast } from 'react-toastify'

import Modal from 'react-modal'
import apiLocal from '../../Services/api';
import apiImg from '../../Services/apiImg';
import imgLogo from '../../Multimidia/LogoMarca.png'
import './pagamentos.scss'
import FooterRodape from '../Footer';

function GerarLinkPagamento() {

  const [nomeCliente,setnomeCliente] = useState('')
  const [valor, setValor] = useState('');
  const [descricao] = useState('ItensDeCompra');
  const [nome, setNome] = useState('');
  const [codUsuario,setCodUsuario] = useState('')
  const [email, setEmail] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('CPF');
  const [documento, setDocumento] = useState('');
  const [ddd, setDdd] = useState('');
  const [numero, setNumero] = useState('');
  const [paymentLink, setPaymentLink] = useState('');


  const navigate = useNavigate()
  const { loginToken } = useContext(AuthContext)

  
  const [produtos,setProdutos]=useState([])
  const [contadorItem,setContadorItem]=useState([])
  const [valorTotal,setValorTotal] = useState(0)


  const [modalAberto,setModalAberto] = useState (false)

  

  useEffect(()=>{

    const carrinhoCompleto = JSON.parse(localStorage.getItem('carrinhoCompleto')) || {produtos:[],contadorItem:[], valortotal:0};



    setProdutos(carrinhoCompleto.produtos)
    setValorTotal(carrinhoCompleto.valorTotal)
    setValor(carrinhoCompleto.valorTotal)
    setContadorItem(carrinhoCompleto.contadorItem)
  },[])

  useEffect(() => {
    const iToken = localStorage.getItem('@usubaurufoods')
    const token = JSON.parse(iToken)

    if (!token) {
      navigate('/Login')
      return
    } else if (token) {
      async function VerToken() {
        const resposta = await apiLocal.get('/ListarClienteToken', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        })

        if (resposta.data.dados) {
          navigate('/Login')
          return

        } else if (resposta.data.id) {
          navigate('/Pagamento')
          return
        }  
      }
      VerToken()
    }
  }, [loginToken, navigate])

  const iToken = localStorage.getItem('@usubaurufoods')
  const token = JSON.parse(iToken)

  useEffect(() => {


    async function handleClientePag() {

      const resClientePag = await apiLocal.get('/ClientePagController', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setNome(resClientePag.data.nome)
      setCodUsuario(resClientePag.data.codigoIdCliente)
      setEmail(resClientePag.data.email)
      setTipoDocumento(resClientePag.data.tipoDocumento)
      setDocumento(resClientePag.data.cpf)
      setDdd(resClientePag.data.ddd)
      setNumero(resClientePag.data.whatsapp)
      setnomeCliente(resClientePag.data.nome)
    }
    handleClientePag()
  }, [token])


  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if( valorTotal === 0){
      toast.warn('Ops seu carrinho esta vazio')
      navigate('/')
    }

    setModalAberto(!modalAberto)
    try {
      const response = await apiLocal.post('/Pagamentos', {
        valor,
        descricao,
        cliente: {
          nome,
          email,
          tipoDocumento,
          documento,
          telefone: {
            ddd,
            numero
          }
        }
      });
      setPaymentLink(response.data.paymentLink);
    } catch (error) {
      toast.error('Erro ao gerar link de pagamento PagBank:', error);
    }

    const produtoCar = produtos.map((produto)=>{
      const quantidadeItem = contadorItem[produto.id] || 1
      return{

        nome: produto.nome,
        quantidadeProduto: quantidadeItem,
        banner: produto.banner,
        categoriaId: produto.categoriaId,
        produtoId: produto.id,
        dataInicial: produto.dataInicial,
        dataValidade: produto.dataValidade,
        descricao: produto.descricao,
        preco: produto.preco,
        concorrentePreco: produto.concorrentePreco,
      }
  })
      apiLocal.post('/CarrinhoCliente',{
        nomeCliente,
        produtoCar,
        valorTotal})

    localStorage.removeItem('listaProdutos')
  };


  

  async function handleWhatsapp(e){
          e.preventDefault()
      try {
        
        const produtosMapeados = produtos.map((produto)=>{
          const quantidaItem = contadorItem[produto.id] || 1
          return `${produto.nome} - Qtd: ${quantidaItem}`
        }).join('\n')

        
        
        const message = encodeURIComponent(`Olá meu nome é ${nome} !\nfiz uma compra no Bauru foods e gostaria de liberar meu pedido, cód.usuário:${codUsuario}\n${produtosMapeados}\nValor Total: RS${valorTotal.toFixed(2)}
          `)

        

          const WhatsappURL = `https://web.whatsapp.com/send?phone=5514997934755&text=${message}`;
          window.open(WhatsappURL, '_blank')
          
          return
      } catch (error) {
        toast.error('Erro ao enviar mensagem')
      }
          
  }

 

  return (
    <div id='pagamento_principal'>
      <header id='div_header_pagamento'>

      <div id='div_img_header_pagamento'>
          <img src={imgLogo} alt='Logomarca'/>
      </div>

      <div id='div_link_header_pagamento'>
        <Link to='/' id='link_pagamento_header'>Home</Link>

      </div>

      </header>
      <div id='titulo_pagamento'>
      <h1>Seus produtos</h1>
      </div>
      
      <form onSubmit={handleSubmit}
      id='form_pagamento_principal'
      >
        
        <div id='div_produtos_form_pagamento'>
          {produtos.map((produto)=>{
            const quantidade = contadorItem[produto.id] || 1;
            const banner1 = produto.banners[0]
            const banner2 = produto.banners[1]
            return(
              <div
              key={produto.id}
              id='descricao_pagamento'
              > 
                <div id='nome_preco_pagamento'>
                <h2>{produto.nome}</h2><br/>
                <p>Quantidade:{quantidade}</p>
                <p>{produto.concorrentePreco}% OFF</p>
                <p>{produto.preco}R$</p>
                </div>
                
                <div id='div_img_pagamento'>
                <img src={`${apiImg}${banner1.url}`} alt='banner'/>
                </div>

                <div>
                  <h2>Informações gerais:</h2>
                  <p>{produto.descricao}</p>
                  <p>Retirada a partir de:{produto.dataInicial}</p>
                  <p>Ultimo dia para retirada:{produto.dataValidade}</p>
                </div>

              </div>
            )
          })}
          <div id='div_total_pagar'>
          <p>Total a pagar: R$ {valorTotal.toFixed(2)}</p>
          </div>
          
          
        </div>
        <div>
        
        <div id='div_dados_pagamento'>
          
          <div id='info_pagamentos'>

          <h2>Pague fácil:</h2>
          <p>Olá {nome}, para efetuar sua compra basta gerar um link de pagamento e efetuar o mesmo, seus dados e sua lista de compras estará salva em nosso sistema e os produtos do seu carrinho será liberado no prazo máximo de 2 horas após o pagamento para retirada de seus produtos nas lojas parceiras.</p>
          <p>Qualquer eventual problema pode entrar em contato com Bauru-Foods SAC: 14997934755 </p>
          
          </div>

          

        <div id='button_pagamento'>        
        <button type="submit">Gerar Link de Pagamento</button>
        
        </div>
        </div>

        <div>
            <h2>Segurança</h2>
            <p>Efetue pagamentos apenas com links gerados direto de sua conta, não aceite pagamentos de links de terceiros, somos uma empresa única e não trabalhamos em parceria com nenhum site de e-commerce semelhante!</p>
          </div>

        
        </div>
      </form>
      
      {modalAberto && (
            <Modal
              isOpen={modalAberto}
              onRequestClose={handleSubmit}
              contentLabel='Compra finalizada'
              ariaHideApp={false} // Para evitar erro de acessibilidade
            >
              <div id='modal_pagamentoFinalizado'>
              <div id='div_titulo'>
                <h1>Parabéns, compra finalizada!</h1>
              </div>
              {paymentLink && (
              <div id='div_link'>
                <h2 id='tit_link'>Link de Pagamento:</h2>
                <a href={paymentLink} target="_blank" rel="noopener noreferrer">{paymentLink}</a>
                <p>Click no  link para efetuar o pagamento, logo após click no botao "liberar pedido", para confirmação do pagamento e liberação da retirada de seus produtos na lojas parceiras.</p>
              </div>
              )}
              <div id='div_liberar_pedido'>
                  <button onClick={handleWhatsapp}>Liberar pedido <FaWhatsapp /> </button>
              </div>

            </div>
            </Modal>
          )}

          <div>
            <FooterRodape/>
          </div>
    </div>
  );
}

export default GerarLinkPagamento