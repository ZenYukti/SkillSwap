import { render } from '@testing-library/react'
import App from '../App'
import { BrowserRouter } from 'react-router-dom'

test('renders App without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
})
