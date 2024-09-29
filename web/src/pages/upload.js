import React, { useRef } from 'react';
import styles from './upload.module.css';
import { faClapperboard, faFilm, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../components/button';
import ProgressBar from '../components/progress-bar';

export default function Upload() {
  const fileInputRef = useRef(null);
  const dropzoneRef = useRef(null);
  const [buttonActive, setButtonActive] = React.useState(true);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    console.log(files);
    // handle files here
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    console.log(files);
    // handle files here
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  console.log(buttonActive);

  return (
    <div className={styles['upload']}>
        <div className={styles['slogan']}>
            Dokonaj analizy przemówienia w parę sekund!
        </div>
        <div 
          className={styles['dropzone']} 
          ref={dropzoneRef} 
          onDragOver={handleDragOver} 
          onDrop={handleDrop}
          onDragEnter={() => {dropzoneRef.current.classList.add(styles['drag-over']); setButtonActive(false)}}
          onDragLeave={() => {dropzoneRef.current.classList.remove(styles['drag-over']); setButtonActive(true)}}
        >
            <div className={styles['drop-tip']}>Upuść tutaj materiały wideo...</div>
            <FontAwesomeIcon className={styles['upload-icon']} icon={faUpload} />
            <Button className={styles['upload-button'] + (!buttonActive ? " " + styles['upload-button-disabled'] : "")} onClick={handleClick}>Wybierz z Dysku</Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileSelect} 
            />
        </div>
        {/* <ProgressBar /> */}
    </div>
  );
}