import { StrimzProvider } from '@strimz/sdk/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Success from './pages/Success'

function App() {
  return (
    <StrimzProvider
      publicKey={import.meta.env.VITE_STRIMZ_PUBLIC_KEY}
      environment="test"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </BrowserRouter>
    </StrimzProvider>
  )
}

export default App
