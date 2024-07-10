import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import PagPets from './Components/PagPets'
import PagLanches from './Components/PagLanches'
import PagPizzas from './Components/PagPizzas'
import PagSobremesas from './Components/PagSobremesas'
import PagPorcoes from './Components/PagPorcoes'
import Login from './Pages/Login'
import Cadastrar from './Pages/Cadastrar'
import GerarLinkPagamento from './Components/Pagamentos'



function Rotas(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path='/Login' element = {<Login/>}/>
            <Route path='/Cadastrar' element = {<Cadastrar/>}/>
            <Route path='/' element = {<Home/>}/>
            <Route path='/Pets' element ={<PagPets/>}/>
            <Route path='/Lanches' element = {<PagLanches/>}/>
            <Route path='/Pizzas' element = {<PagPizzas/>}/>
            <Route path='/Sobremesas' element ={<PagSobremesas/>}/>
            <Route path='/Porções' element ={<PagPorcoes/>}/>
            <Route path='/Pagamento' element={<GerarLinkPagamento/>}/>
        </Routes>
        </BrowserRouter>
    )
}
export default Rotas