import React,{ useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import apiLocal from '../../Services/api'
import apiCep from '../../Services/apiCep'
import imgLogo from '../../Multimidia/LogoMarca.png'

import './Cadastrar.scss'

function Cadastrar(){

    const navigation = useNavigate()

    const [nome,setNome] = useState('')
    
    const [email,setEmail] = useState('')
   

    const [password,setPassword] = useState('')
    const [repetPassword,setRepetPassword] = useState('')
    const tipoDocumento = 'CPF'
    const [cpf,setCpf] = useState('')
    const [ddd,setDdd] = useState('')
    const [whatsapp,setWhatsapp] = useState('')
    const [cep,setCep] = useState('') 
    const [endereco,setEndereco] = useState('')
    const [numero,setNumero] = useState('')
    const [bairro,setBairro] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')


    const [error, setError] = useState('');
    const [errorCpf,setErrorCpf]= useState('')
    const [errorMessage, setErrorMessage] = useState('');




    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cep') {
          setCep(value);
        }
      };

      const handleBuscaCep = async () => {
        try {
          const respostaBuscaCep = await apiCep.get(`${cep}/json/`);
          const data = respostaBuscaCep.data;
          setEndereco(data.logradouro || '');
          setBairro(data.bairro || '');
          setCidade(data.localidade || '');
          setEstado(data.uf || '');
          setErrorMessage('');
        } catch (error) {
          toast.warn("CEP não encontrado, verifique o numero e tente novamente")
          setErrorMessage('Erro ao buscar o CEP. Por favor, verifique o número e tente novamente.');
        }
      };

      useEffect(() => {
        if (cep.length === 8) {
          handleBuscaCep();
        }
      }, [cep,]);

      const handleDdd = (e) =>{
        const value = e.target.value
        if (value.length <= 2){
          setDdd(value)
        }
      }

      const handleWhatsapp = (e) =>{
        const value = e.target.value
        if (value.length <= 9){
          setWhatsapp(value)
        }
      }


      function validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
      
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
          return false;
        }
      
        let sum = 0;
        let remainder;
      
        // Valida o primeiro dígito verificador
        for (let i = 1; i <= 9; i++) {
          sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) {
          remainder = 0;
        }
        if (remainder !== parseInt(cpf.substring(9, 10))) {
          return false;
        }
      
        sum = 0;
        // Valida o segundo dígito verificador
        for (let i = 1; i <= 10; i++) {
          sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) {
          remainder = 0;
        }
        if (remainder !== parseInt(cpf.substring(10, 11))) {
          return false;
        }
      
        return true;
      }

      const handleCpf = (e) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
    
        if (value.length <= 11) {
          setCpf(value);
          if (value.length === 11) {
            if (validateCPF(value)) {
              setErrorCpf('');
            } else {
              setErrorCpf('CPF inválido.');
            }
          } else {
            setErrorCpf('');
          }
        }
      };
      

      const handlePassword = (e) => {
        const value = e.target.value;
        setPassword(value);
    
        // Regex to check for at least one uppercase letter, one number, and one special character
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{0,}$/;
    
        if (!regex.test(value)) {
          setError('A senha deve conter ao menos uma letra maiúscula, um número e um caractere especial.');
        } else {
          setError('');
        }
      };

      


    async function CadastrarClientes(e){
        e.preventDefault()
        

        if(password !== repetPassword){
          toast.warn('Senhas não conferem')
          return
        }

        if(cpf.length < 11){
          toast.error('Cpf inválido')
          return
        }else if(!validateCPF(cpf)){
          toast.error('Cpf inválido')
          return
        }


        if(!nome || !email || !password || !tipoDocumento || !cpf || !ddd || !whatsapp || !cep || !endereco || !numero || !bairro || !cidade || !estado){
          console.log(nome,email,password,tipoDocumento,cpf,ddd,whatsapp,cep,endereco,numero,bairro,cidade,estado)
            toast.warn('Existem campos em branco')
            return
        }
        try {
            await apiLocal.post('/CriarClientes',{
                nome,
                email,
                password,
                tipoDocumento,
                cpf,
                ddd,
                whatsapp,
                cep,
                endereco,
                numero,
                bairro,
                cidade,
                estado
            }
        )
        toast.success('Cadastro efetuado com sucesso')
        navigation('/Login')
        } catch (err) {
            //retorna resposta direto do back-end "throw new Error"
            toast.error(err.response.data.error)
        }


    }



    return(
        <div>
            <header id='Header_Cadastrar'>
              <div className='div_header_cadastrar'>
                <img id='img_header_cadastrar'src={imgLogo} alt='banner'/>
              </div>
              
              <div className='div_header_cadastrar'>
                <div id='div_link_header_cadastrar'>
              <Link id='link_header_cadastrar' to='/Login'>Login</Link>
                </div>
              </div>
            </header>

            <div id='div_body_cadastrar' >

            <form onSubmit={CadastrarClientes}
            id='form_body_cadastrar'
            >   
                <div id='form_filha_cadastrar'>

                <div id='label_body_cadastrar'> 

                
                <p><label>Nome:</label></p>
                <p><label>E-mail:</label></p>
                <p><label>Senha:</label></p>
                <p><label>c.senha:</label></p>
                <p><label>cpf:</label></p>
                <p><label>DDD:</label></p>
                <p><label>whatsapp:</label></p>
                <p><label>cep:</label></p>
                <p><label>endereço:</label></p>
                <p><label>numero:</label></p>
                <p><label>bairro:</label></p>
                <p><label>cidade:</label></p>
                <p><label>estado:</label></p>
                </div>



                <div id='input_body_cadastrar'>

                <p><input
                type='text'
                value={nome}
                onChange={(e)=>setNome(e.target.value)}
                /></p>
                
                <p><input
                type='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                /></p>
                
                <p><input
                type='password'
                value={password}
                onChange={handlePassword}
                data-tip
                data-for='passwordTooltip'
                />
              {error && <p style={{ color: 'red',zIndex: 9999, 
            position: 'relative', 
            top: '-25px', 
            backgroundColor: 'white',
            padding: '5px',
            border: '1px solid red',
            borderRadius: '5px'}}>{error}</p>}
                </p>
                
                <p><input
                type='password'
                value={repetPassword}
                onChange={(e)=>setRepetPassword(e.target.value)}
                /></p>

                


                <p><input
                type='number'
                value={cpf}
                onChange={handleCpf}
                className={error ? 'input-error' : ''}
                maxLength="11"
                /></p>
                {errorCpf && (
                  <p style={{ 
                    color: 'red', 
                    zIndex: 9999, 
                    position: 'relative', 
                    top: '-25px', 
                    backgroundColor: 'white',
                    padding: '5px',
                    border: '1px solid red',
                    borderRadius: '5px'
                  }}>
            {errorCpf}
          </p>)}
               

                
                <p><input
                type='number'
                value={ddd}
                onChange={handleDdd}
                /></p>
                
                <p><input
                type='number'
                value={whatsapp}
                onChange={handleWhatsapp}
                /></p>
                
                <p><input
                type='text'
                name='cep'
                value={cep}
                onChange={handleChange}
                /></p>
                
                <p><input
                type='text'
                name='endereco'
                value={endereco}
                onChange={(e)=>setEndereco(e.target.value)}
                disabled
                /></p>
                
                <p><input
                type='text'
                
                value={numero}
                onChange={(e)=>setNumero(e.target.value)}
                /></p>
                
                <p><input
                type='text'
                value={bairro}
                name='bairro'
                onChange={(e)=>setBairro(e.target.value)}
                disabled
                /></p>
                
                <p><input
                type='text'
                name='cidade'
                value={cidade}
                onChange={(e)=>setCidade(e.target.value)}
                disabled
                /></p>
                
                <p><input
                type='text'
                name='estado'
                value={estado}
                onChange={(e)=>setEstado(e.target.value)}
                disabled
                /></p>

                </div>
                </div>

                <button id='button_form_cadastrar'type='submit'>Cadastrar</button>

            </form>
            </div>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    )
}

export default Cadastrar