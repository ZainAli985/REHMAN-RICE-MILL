import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import CreateAccount from './components/accounts/CreateAccount';
import ViewAccounts from './components/accounts/ViewAccounts';
import GeneralJournalEntry from './components/general-entries/GeneralJournalEntry';
import ViewGeneralEntries from './components/general-entries/ViewGeneralEntries';
import ViewSalesInvoices from './components/invoices/ViewSalesInvoices';
import InvoiceDashboard from './components/invoices/InoviceDashboard';
import SalesInvoice from './components/invoices/SalesInvoice.jsx';
import PurchaseInvoiceForm from './components/invoices/PurchaseInvoiceForm.jsx';
import ViewPurchaseInvoices from './components/invoices/ViewPurchaseInvoices.jsx';

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
    <Route path='/' element= {<Login/>} />
    <Route path='/dashboard' element= {<Dashboard/>} />
    <Route path='/create-account' element= {<CreateAccount/>} />
    <Route path='/view-accounts' element= {<ViewAccounts/>} />
    <Route path='/general-entries' element= {<GeneralJournalEntry/>} />
    <Route path='/general-journal-entry' element= {<GeneralJournalEntry/>} />
    <Route path='/view-general-entries' element= {<ViewGeneralEntries/>} />
    <Route path='/add-invoice' element= {<InvoiceDashboard/>} />
    <Route path='/add-invoice-sales' element= {<SalesInvoice/>} />
    <Route path='/view-sales-invoices' element= {<ViewSalesInvoices/>} />
    <Route path='/add-invoice-purchase' element= {<PurchaseInvoiceForm/>} />
    <Route path='/view-purchase-invoices' element= {<ViewPurchaseInvoices/>} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
