import React, { useState } from 'react';
import Progress from './Progress';
import axios from 'axios';
import {toast} from 'react-toastify'


const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const token = user.token;
    
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      };
      try {
        const res = await axios.post('http://localhost:8200/upload', formData, config
          // onUploadProgress: progressEvent => {
          //   setUploadPercentage(
          //     parseInt(
          //       Math.round((progressEvent.loaded * 100) / progressEvent.total)
          //     )
          //   );
          // }
        );
        
        // Clear percentage
        // setTimeout(() => setUploadPercentage(0), 10000);

        const { fileName, filePath } = res.data;

        setUploadedFile({ fileName, filePath });

        toast.success('File Uploaded');
      } catch (err) {
        if (err.response.status === 500) {
          toast.error('There was a problem with the server');
        } else {
          toast.error(err.response.data.message);
        }
        setUploadPercentage(0)
      }
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        {/* <Progress percentage={uploadPercentage} /> */}

        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FileUpload;