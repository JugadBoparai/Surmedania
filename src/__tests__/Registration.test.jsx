import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '../context/LanguageContext'
import RegistrationPage from '../pages/RegistrationPage'

test('renders registration form and validates required fields', async () => {
  render(
    <LanguageProvider>
      <BrowserRouter>
        <RegistrationPage />
      </BrowserRouter>
    </LanguageProvider>
  )

  const submit = screen.getByRole('button', { name: /submit|send|registr/i })
  // Try submitting without required fields
  fireEvent.click(submit)
  expect(await screen.findByText(/Please fill required fields/i)).toBeInTheDocument()
})
