import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CustomAlertProvider } from './components/CustomAlertContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomAlertProvider>
        <App />
      </CustomAlertProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

