import { Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";

import imgLogo from '../../Multimidia/LogoMarca.png'

import './footerRodape.scss'

function FooterRodape(){
return(
    <footer>

    <div id='footer_principal'>
        
        <div id='footer_displayFlex'>

        <div id='div_img_footer'>
            <img src={imgLogo} alt='logoMarca'/>
        </div>
        <div id='div_redes_sociais'>
            <h2>Redes sociais:</h2>
            <p><Link to='https://web.whatsapp.com/send?phone=5514997934755' target='_blanck' className='link_footer'><FaWhatsapp className='icons'/>Whatsapp</Link> </p>
            <p><Link to='https://www.instagram.com/bauru.foods/' target='_blanck' className='link_footer'><FaInstagram className='icons'/>instagram</Link></p>
            <p><Link to='https://www.facebook.com/profile.php?id=100090314790231' target='_blanck' className='link_footer'><FaFacebookF className='icons' />Facebook</Link></p>
        </div>
        <div id='div_informacoes_footer'>
            <p><Link className='link_informacoes'>Fale conosco</Link></p>
            <p><Link className='link_informacoes'> Site Bauru-Foods</Link></p>
            <p><Link className='link_informacoes'> Dicas de segurança</Link></p>
            <p><Link className='link_informacoes'> Termos e condições de uso </Link></p>
            <p><Link className='link_informacoes'> Privacidade </Link></p>
        </div>

        </div>
        
        <p>Desenvolvido por Bauru-Foods </p>
        <p>&reg;Todos os direitos reservados a &copy;Copyright</p>

    
    </div>


    </footer>
)
}
export default FooterRodape