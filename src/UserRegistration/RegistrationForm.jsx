import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@gen3/ui-component/dist/components/Button';

/**
 * @param {Object} prop
 * @param {string} prop.label
 * @param {JSX.Element} prop.input
 */
const RegistrationFormField = ({ label, input }) => (
  <div className='user-registration__form__field-container'>
    <label className='user-registration__form__field-label'>{label}</label>
    <div className='user-registration__form__field-input'>{input}</div>
  </div>
);

const affiliations = ['University of Chicago'];
const affiliationOptions = affiliations.map((option) => ({
  label: option,
  value: option,
}));

function RegistrationForm({ onClose }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [affiliation, setAffiliation] = useState(null);
  const [isValidInput, setIsValidInput] = useState(false);
  useEffect(() => {
    setIsValidInput(
      firstName !== '' && lastName !== '' && affiliation !== null
    );
  }, [firstName, lastName, affiliation]);

  const [isDone, setIsDone] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  function handleRegister() {
    alert('Registered!');
    setIsDone(true);
  }

  function handleClose() {
    if (isSubscribed) alert('Subscribed!');
    onClose();
  }

  const stepInput = (
    <div className='user-registration__step-input'>
      <p>
        <FontAwesomeIcon
          className='screen-size-warning__icon'
          icon='exclamation-triangle'
          color='#EF8523' // g3-color__highlight-orange
        />
        Your account does not have access to PCDC data.
        <br />
        Please register to gain access.
      </p>
      <RegistrationFormField
        label='First name'
        input={
          <input
            type='text'
            value={firstName}
            autoFocus
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
        }
      />
      <RegistrationFormField
        label='Last name'
        input={
          <input
            type='text'
            value={lastName}
            required
            onChange={(e) => setLastName(e.target.value)}
          />
        }
      />
      <RegistrationFormField
        label='Affiliation'
        input={
          <Select
            value={affiliation}
            onChange={(e) => setAffiliation(e)}
            options={affiliationOptions}
            isClearable
          />
        }
      />
    </div>
  );

  const stepDone = (
    <div className='user-registration__step-done'>
      <h2>Thank you for registering!</h2>
      <p>
        You now have access to PCDC data based on your institutional
        affiliation.
      </p>
      <div className='user-registration__subscribe'>
        <input
          type='checkbox'
          checked={isSubscribed}
          onChange={(e) => setIsSubscribed(e.target.checked)}
        />
        Subscribe to the quarterly PCDC newsletter to get the latest updates on
        the PCDC project and more.
      </div>
    </div>
  );

  return (
    <form className='user-registration__form'>
      {isDone ? stepDone : stepInput}
      <div>
        <Button
          label='Back to page'
          buttonType='default'
          onClick={handleClose}
        />
        {!isDone && (
          <Button
            type='submit'
            label='Register'
            enabled={isValidInput}
            onClick={handleRegister}
          />
        )}
      </div>
    </form>
  );
}

export default RegistrationForm;
