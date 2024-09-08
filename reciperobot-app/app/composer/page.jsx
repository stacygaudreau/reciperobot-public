'use client';

import Composer from '@/components/Composer/Composer';
import { ComposerStateProvider } from '@/components/Composer/ComposerContext';

const ComposerView = () => {
  return (
    <ComposerStateProvider>
      <Composer />
    </ComposerStateProvider>
  )
}

export default ComposerView;