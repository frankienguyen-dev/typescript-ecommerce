import useRouteElement from './routes/useRouteElement'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const routeElements = useRouteElement()

  return (
    <div>
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App
