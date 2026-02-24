import { createRoot } from 'react-dom/client'
import { MemoryRouter } from "react-router"
import { Provider } from "react-redux"
import "./i18n"

import 'tailwindcss/index.css'
import './assets/scss/main.scss'

import store from './store/index.ts'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </Provider>
)
