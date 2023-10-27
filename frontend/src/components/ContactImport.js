import React, { useRef } from 'react';
import axios from 'axios';

function ContactImport() {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post('https://contact-app-lake-rho.vercel.app/api/import-contacts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Imported contacts:', response.data);
        window.location.reload();
      } catch (error) {
        console.error('Error importing contacts:', error);
      }
    }
  };

  return (
    <div className='button'>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button onClick={handleImportClick} className='import'>+ &nbsp; Import Contacts</button>
    </div>
  );
}

export default ContactImport;
