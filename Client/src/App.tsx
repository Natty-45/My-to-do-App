import { Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import CreateTodo from './pages/CreateTodo'
import HomePage from './pages/HomePage'

function App() {


  return (
    <Routes>
    <Route path='/' element={<HomePage/>} />
    <Route path='/auth' element={<Auth />} />
    <Route path='/create' element={<CreateTodo />} />
    </Routes>
  )
}

export default App
