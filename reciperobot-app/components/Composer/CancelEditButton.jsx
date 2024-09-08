/*  
    Button which cancels active editing mode
*/

import { X } from 'lucide-react';
import { Button } from '../shadui/button';

const CancelEditButton = ({ onClickFn, mode }) => {
  return (
    <Button
      size='sm'
      className='h-7 gap-1.5'
      variant='outline'
      disabled={mode === 'standby'}
      onClick={onClickFn}
    >
      <X className='h-3.5 w-3.5' />
      <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
        {mode === 'save' ? 'Cancel' : 'Exit'}
      </span>
    </Button>
  );
};

export default CancelEditButton;
