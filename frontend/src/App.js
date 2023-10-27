import React from 'react';
import './App.css';
import ContactImport from './components/ContactImport';
import ContactList from './components/ContactList';

function App() {
  return (
    <div className='container'>
      <ContactImport/>
      <ContactList />
    </div>
  );
}

export default App;
