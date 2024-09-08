/*
    A toggle switch for making a recipe public or not
*/

import { Switch } from '../shadui/switch';
import { Label } from '../shadui/label';

const PublicSwitch = ({ isPublic, toggleIsPublicFn, disableText = false }) => {
  return (
    <div className='flex items-center space-x-2'>
      {!disableText && <Label htmlFor='is-public'>Public</Label>}

      <Switch
        id='is-public'
        checked={isPublic}
        onCheckedChange={() => {
          toggleIsPublicFn();
        }}
      />
    </div>
  );
};

export default PublicSwitch;
