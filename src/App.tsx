import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TravelPage from './components/TravelPage'
import Login from './components/Login'
import SignupForm from './components/SignUpForm'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TravelPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </Router>
  )
}

export default App