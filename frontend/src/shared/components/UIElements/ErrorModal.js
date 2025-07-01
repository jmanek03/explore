import React from 'react';

import Modal from './Modal';
import Button from '../FormElements/Button';

const ErrorModal = props => {
  let modalHeader = 'An Error Occurred';
  if (props.error) {
    if (props.error.includes('Authentication')) {
      modalHeader = 'Authentication Error';
    } else if (props.error.includes('validation')) {
      modalHeader = 'Validation Error';
    } else if (props.error.includes('upload')) {
      modalHeader = 'Upload Error';
    }
  }

  return (
    <Modal
      onCancel={props.onClear}
      header={modalHeader}
      show={!!props.error}
      headerClass="error-modal__header"
      contentClass="error-modal__content"
      footerClass="error-modal__footer"
      footer={
        <Button onClick={props.onClear} inverse>
          Okay
        </Button>
      }
    >
      <p className="error-modal__message">{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
