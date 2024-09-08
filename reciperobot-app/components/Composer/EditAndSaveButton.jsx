/*
    A button which toggles between starting an edit process
    and saving (exiting) the editing process.
*/
'use client';

import { Save, Pen } from 'lucide-react';
import { Button } from '@/components/shadui/button';

const getIconComponent = (mode) => {
  switch (mode) {
    case 'standby':
      return <Pen className='h-3.5 w-3.5' />;
    case 'save':
      return <Save className='h-3.5 w-3.5' />;
    case 'editing':
      return <Save className='h-3.5 w-3.5' />;
    default:
      return <Pen className='h-3.5 w-3.5' />;
  }
};

const getText = (mode) => {
  switch (mode) {
    case 'standby':
      return 'Edit';
    case 'save':
      return 'Save';
    case 'editing':
      return 'Save';
  }
};

const getVariant = (mode) => {
  switch (mode) {
    case 'standby':
      return 'default';
    case 'save':
      return 'default';
    case 'editing':
      return 'outline';
  }
};

/**
 * An edit and save button, with up to three states.
 */
const EditAndSaveButton = ({
  editFn,
  saveFn,
  mode = 'standby',
  hasChanges = false,
  isMinimal = false,
}) => {
  mode = mode.toLowerCase();
  const disabled = !hasChanges && mode === 'editing';
  const onClick = mode === 'standby' ? editFn : saveFn;
  return (
    <Button
      size='sm'
      className='h-7 gap-1.5'
      variant={getVariant(mode)}
      onClick={onClick}
      disabled={disabled}
    >
      {getIconComponent(mode)}
      <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
        {getText(mode)}
      </span>
    </Button>
  );
};

export default EditAndSaveButton;
