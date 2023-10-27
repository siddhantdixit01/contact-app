import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage, setContactsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  const totalPages = Math.ceil(contacts.length / contactsPerPage);

  const next = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading contacts...</p>
      ) : (
        <div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{width:'30%'}}>Name</th>
                <th style={{width:'40%'}}>Email</th>
                <th style={{width:'30%'}}>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
            <div className="pagination">
                <button className="page-link" onClick={prev} disabled={currentPage === 1}>
                <span className="icon">&lt;</span>
                </button>
                <span className="page-number">
                Page {currentPage} of {totalPages}
                </span>
                <button className="page-link" onClick={next} disabled={currentPage === totalPages}>
                <span className="icon">&gt;</span>
                </button>
                <select
                id="contactsPerPage"
                value={contactsPerPage}
                onChange={(e) => {
                    setContactsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                }}
                >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                </select>
            </div>
        </div>
      )}
    </div>
  );
}

export default ContactList;
