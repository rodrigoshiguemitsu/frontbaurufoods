import Rotas from "./routes";
import AuthProvider from "./Context/AuthContext";
import {ToastContainer} from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <AuthProvider>

    <div className="App">
      <Rotas/>
      <ToastContainer
      position="top-center"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"

      />
    </div>
    </AuthProvider>
  );
}

export default App;
