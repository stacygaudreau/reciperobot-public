/*
    List of direction steps for recipe Composer
*/

'use client';

import { CornerDownLeft, Plus } from 'lucide-react';
import { Button } from '@/components/shadui/button';
import { Separator } from '@/components/shadui/separator';
import { Textarea } from '@/components/shadui/textarea';
import { useContext, useState, useRef } from 'react';
import {
  CardContent,
} from '@/components/shadui/card';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import DirectionListItem from '@/components/Composer/DirectionListItem';
import { ComposerContext } from '@/components/Composer/ComposerContext';

/**
 * Get the index related to an object with a given
 * id member, in an array of objects
 */
const getObjectIndexForId = (A, id) => {
  let i = 0;
  for (; i < A.length; ++i) {
    if (A[i].id === id) {
      break;
    }
  }
  return i;
};

const STEP_TEXT_PLACEHOLDER = 'Written directions for this step';

const DirectionsList = () => {
  const { mode, setModeEditing, recipeData, setSteps, addStep, deleteStep } =
    useContext(ComposerContext);
  const [text, setText] = useState('');
  const formRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const oldIndex = getObjectIndexForId(recipeData.steps, active.id);
    const newIndex = getObjectIndexForId(recipeData.steps, over.id);
    if (active.id !== over.id && oldIndex != newIndex)
      setSteps(arrayMove(recipeData.steps, oldIndex, newIndex));
  };

  const textIsValid = () => {
    return (
      text !== null && text !== STEP_TEXT_PLACEHOLDER && text.trim() !== ''
    );
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const form = Object.fromEntries(formData.entries());
    if (textIsValid()) {
      addStep(form.text);
      setText('');
    }
  };

  const handleTextareaKeyDown = (e) => {
    if (e.shiftKey && e.key === 'Enter') {
      // allow default behaviour (newline)
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // fire a submission event on the form
      formRef.current.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    }
  };

  return (
    <CardContent>
      <div className='flex flex-col flex-grow gap-4 mt-2'>
        <h2 className='text-lg font-semibold'>Directions</h2>
        <div className='flex flex-col flex-grow gap-2'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={recipeData.steps}
              strategy={verticalListSortingStrategy}
            >
              {recipeData.steps.length > 0 ? (
                <>
                  {recipeData.steps.map((step, i) => (
                    <DirectionListItem
                      step={step}
                      key={step.id}
                      id={step.id}
                      i={i}
                    />
                  ))}
                </>
              ) : (
                mode === 'standby' && (
                  <>
                    <div className='flex flex-col justify-center'>
                      <Button
                        className='h-10 gap-1.5'
                        variant='outline'
                        onClick={setModeEditing}
                      >
                        <Plus className='h-4 w-6' />
                        Add step
                      </Button>
                    </div>
                  </>
                )
              )}
            </SortableContext>
          </DndContext>
        </div>
        {!(mode === 'standby') && (
          <>
            <form
              className='flex gap-2'
              method='post'
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <Textarea
                placeholder='Written directions for this step'
                className='h-full'
                value={text}
                onChange={handleTextChange}
                name='text'
                id='text'
                onKeyDown={handleTextareaKeyDown}
              />
              <Button
                className='h-100'
                variant='outline'
                disabled={!textIsValid()}
                type='submit'
              >
                <CornerDownLeft className='h-4 w-6' />
              </Button>
            </form>
          </>
        )}
      </div>
    </CardContent>
  );
};

export default DirectionsList;
