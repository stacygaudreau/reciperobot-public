/*
    A single step/direction list item for in a recipe
*/

'use client';

import { Grip, X, Check } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Button } from '@/components/shadui/button';
import { ComposerContext } from '@/components/Composer/ComposerContext';
import { useContext, useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/shadui/textarea';

const DirectionListItem = ({ step, i }) => {
  const textRef = useRef(null);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const { mode, deleteStep, updateStep, setModeEditing } =
    useContext(ComposerContext);
  const [text, setText] = useState(step.text);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: step.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    setModeEditing();
    setIsBeingEdited(true);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const updateRecipeStep = () => {
    if (text && text !== '') updateStep(step.id, text);
    else deleteStep(step.id);
    setIsBeingEdited(false);
  };

  const handleTextareaKeyDown = (e) => {
    if (e.shiftKey && e.key === 'Enter') {
      // allow default behaviour (newline)
    } else if (e.key === 'Enter') {
      e.preventDefault();
      updateRecipeStep();
    }
  };

  useEffect(() => {
    if (textRef.current) {
      // focus the text area and push the text cursor to the end
      textRef.current.focus();
      const len = textRef.current.value.length;
      textRef.current.setSelectionRange(len, len);
    }
  }, [isBeingEdited, mode]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'flex items-center justify-between gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent'
        // mail.selected === item.id && 'bg-muted'
      )}
    >
      {isBeingEdited && mode !== 'standby' ? (
        <>
          <div className='pl-3 pr-3 w-10 flex flex-grow items-center cursor-text'>
            <div className='h-full cursor-pointer' {...listeners}>
              <Button
                variant='ghost'
                className='text-gray-300 p-1 m-0 my-6 h-8 self-center cursor-pointer'
              >
                <Grip className='h-6 w-6' />
              </Button>
            </div>
            <span className='px-2 ml-4 cursor-text'>{i + 1}.</span>
            <Textarea
              placeholder={text}
              className='ml-4 my-1 resize-none'
              value={text}
              onChange={handleTextChange}
              name='text'
              id='text'
              rows='2'
              onKeyDown={handleTextareaKeyDown}
              ref={textRef}
            />
          </div>
          <div className='text-right flex'>
            <Button
              variant='outline'
              className='px-2'
              onClick={() => {
                updateRecipeStep();
              }}
            >
              <Check className='h-6 w-6' />
            </Button>
          </div>
        </>
      ) : (
        <>
          <div
            className='pl-3 pr-3 w-10 flex flex-grow items-center cursor-text'
            onClick={handleClick}
          >
            <div className='h-full cursor-pointer' {...listeners}>
              <Button
                variant='ghost'
                className='text-gray-300 p-5 px-1 m-0 h-6 self-center cursor-pointer'
              >
                <Grip className='h-6 w-6' />
              </Button>
            </div>
            <span className='px-2 ml-4 cursor-text'>{i + 1}.</span>
            <div className='px-2 ml-0 font-light cursor-text'>{step.text}</div>
          </div>
          <div className='text-right flex'>
            <Button
              variant='ghost'
              className='text-gray-300 px-2'
              onClick={() => {
                deleteStep(step.id);
              }}
            >
              <X className='h-6 w-6' />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DirectionListItem;
