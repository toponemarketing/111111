import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Quotes } from './pages/Quotes'
import { CreateQuote } from './pages/CreateQuote'
import { EditQuote } from './pages/EditQuote'
import { ViewQuote } from './pages/ViewQuote'
import { PublicQuote } from './pages/PublicQuote'
import { Invoices } from './pages/Invoices'
import { CreateInvoice } from './pages/CreateInvoice'
import { EditInvoice } from './pages/EditInvoice'
import { ViewInvoice } from './pages/ViewInvoice'
import { PublicInvoice } from './pages/PublicInvoice'
import { Clients } from './pages/Clients'
import { Settings } from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/quote/:token" element={<PublicQuote />} />
      <Route path="/invoice/:id" element={<PublicInvoice />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="quotes" element={<Quotes />} />
        <Route path="quotes/new" element={<CreateQuote />} />
        <Route path="quotes/:id/edit" element={<EditQuote />} />
        <Route path="quotes/:id" element={<ViewQuote />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="invoices/new" element={<CreateInvoice />} />
        <Route path="invoices/:id/edit" element={<EditInvoice />} />
        <Route path="invoices/:id" element={<ViewInvoice />} />
        <Route path="clients" element={<Clients />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
