/*
    Recipe Composer/Authoring View
*/

'use client';

import { useState, useContext } from 'react';
import { CopyPlus, File, FilePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/shadui/button';
import IngredientList from '@/components/Composer/IngredientList';
import DirectionsList from '@/components/Composer/DirectionsList';
import EditAndSaveButton from '@/components/Composer/EditAndSaveButton';
import CancelEditButton from '@/components/Composer/CancelEditButton';
import RecipeInfoSection from '@/components/Composer/RecipeInfoSection';
import { Card } from '@/components/shadui/card';
import { ComposerContext } from './ComposerContext';

/**
 * Row of buttons/actions above Recipe Composer
 */
const ComposerActionRow = () => {
  const {
    mode,
    setModeEditing,
    discardChanges,
    hasChanges,
    commitChangesToBackend,
    deleteCurrentRecipe,
    createAndEditNewRecipe,
    createNewVersionOfRecipe,
  } = useContext(ComposerContext);
  return (
    <div className='flex items-center justify-between pt-2'>
      {/* left items */}
      <div className='flex gap-2'>
        <EditAndSaveButton
          mode={mode}
          editFn={() => {
            setModeEditing();
          }}
          saveFn={() => {
            commitChangesToBackend();
          }}
          hasChanges={hasChanges}
        />
        {mode !== 'standby' && (
          <CancelEditButton
            onClickFn={() => {
              discardChanges();
            }}
            mode={mode}
          />
        )}
        
      </div>
      {/* right items */}
      <div className='flex gap-2'>
        <Button
          size='sm'
          className='h-7 gap-1.5'
          variant='destructive'
          onClick={() => {
            deleteCurrentRecipe();
          }}
        >
          <Trash2 className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
            Delete
          </span>
        </Button>
        <Button
          size='sm'
          className='h-7 gap-1.5'
          variant='outline'
          onClick={() => {
            createNewVersionOfRecipe();
          }}
        >
          <CopyPlus className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
            Version
          </span>
        </Button>
        <Button variant='outline' className='h-7 gap-1.5'>
          <File className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
            Export
          </span>
        </Button>
        <Button
          size='sm'
          className='h-7 gap-1.5'
          variant='outline'
          onClick={() => {
            createAndEditNewRecipe();
          }}
        >
          <FilePlus className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
            New
          </span>
        </Button>
      </div>
    </div>
  );
};

/**
 * The main component for editing and authoring recipes
 */
const Composer = () => {
  const { recipeIsLoading, recipeError } = useContext(ComposerContext);

  if (recipeIsLoading) {
    return (
      <div className='grid w-full items-start gap-6 p-0 pt-0'>
        Loading recipe...
      </div>
    );
  }

  if (recipeError) {
    return (
      <div className='grid w-full items-start gap-6 p-0 pt-0'>
        {recipeError}
      </div>
    );
  }

  return (
    <div className='grid w-full items-start gap-6 p-0 pt-0'>
      {/* action row */}
      <ComposerActionRow />
      <Card>
        {/* general recipe info */}
        <RecipeInfoSection />
        <IngredientList />
        <DirectionsList />
      </Card>
    </div>
  );
};

export default Composer;
