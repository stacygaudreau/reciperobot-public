/*
    Editable ingredient list item for in recipe composer 
*/

import { useState, useContext, useRef } from 'react';

import { TableCell, TableRow } from '../shadui/table';
import { Button } from '../shadui/button';
import { Badge } from '../shadui/badge';
import { Grip, Check, X } from 'lucide-react';
import { ComposerContext } from './ComposerContext';
import { Input } from '@/components/shadui/input';
import AutoAddSelector from '@/components/AutoSelector/AutoAddSelector';
import AutoSelector from '@/components/AutoSelector/AutoSelector';
import RecipeIngredient from '@/lib/models/RecipeIngredient';

const IngredientListItem = ({ recipeIngredient, i }) => {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const {
    mode,
    setModeEditing,
    deleteRecipeIngredient,
    updateRecipeIngredient,
    ingredients,
    measures,
  } = useContext(ComposerContext);
  const ingredientPairs = ingredients.map((ing) => {
    return { id: ing.id, label: ing.name };
  });

  const [ingredientPair, setIngredientPair] = useState(
    ingredientPairs.find((pair) => pair.id === recipeIngredient.ingredientId)
  );
  const selectedIngredient = ingredients.find(
    (ing) => ing.id === recipeIngredient.ingredientId
  );
  const [qty, setQty] = useState(recipeIngredient.qtyFloat);
  const qtyRef = useRef(null);
  const [modifier, setModifier] = useState(
    recipeIngredient.modifier === null ? '' : recipeIngredient.modifier
  );
  const modifierRef = useRef(null);
  const handleModifierChange = (e) => {
    setModifier(e.target.value);
  };

  const measurePairs = measures.map((measure) => {
    return { id: measure.id, label: measure.name };
  });
  const [measurePair, setMeasurePair] = useState(
    measurePairs.find((pair) => pair.id === recipeIngredient.measureId)
  );
  const selectedMeasure = measures.find((m) => m.id === measurePair.id);
  const handleQtyChange = (e) => {
    setQty(e.target.value);
  };

  const handleClick = () => {
    setModeEditing();
    setIsBeingEdited(true);
  };

  const formIsValid = () => {
    const qtyInput = qtyRef.current;
    const modifierInput = modifierRef.current;
    return (
      selectedIngredient !== null &&
      selectedMeasure !== null &&
      qtyInput &&
      qtyInput.validity.valid &&
      modifierInput.validity.valid
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formIsValid()) {
      updateRecipeIngredient(
        recipeIngredient.id,
        ingredients.find((ing) => ing.id === ingredientPair.id),
        qty,
        selectedMeasure,
        modifier
      );
    }
  };

  return isBeingEdited && mode !== 'standby' ? (
    <>
      <TableRow className='flex'>
        <TableCell className='font-medium px-1 pl-0'>
          <AutoAddSelector
            values={ingredientPairs}
            dataName='ingredient'
            selectedValue={ingredientPair}
            setSelectedValue={setIngredientPair}
          />
        </TableCell>
        <TableCell className='px-1'>
          <Input
            id='qty'
            name='qty'
            type='number'
            placeholder='Amount'
            value={qty}
            onChange={handleQtyChange}
            required
            ref={qtyRef}
          />
        </TableCell>
        <TableCell className='px-1'>
          <AutoSelector
            values={measurePairs}
            dataName='measure'
            selectedValue={measurePair}
            setSelectedValue={setMeasurePair}
          />
        </TableCell>
        <TableCell className='px-1'>
          <Input
            id='modifier'
            name='modifier'
            type='text'
            placeholder='Modifier'
            value={modifier}
            onChange={handleModifierChange}
            ref={modifierRef}
          />
        </TableCell>
        <TableCell className='text-right pl-1'>
          <Button
            variant='outline'
            className='px-2'
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit(e);
              setIsBeingEdited(false);
            }}
          >
            <Check className='h-6 w-6' />
          </Button>
        </TableCell>
      </TableRow>
    </>
  ) : (
    <TableRow
      className='cursor-text flex items-center justify-between'
      onClick={handleClick}
    >
      <TableCell className='flex items-center justify-evenly gap-4'>
        <span className='mr-2 font-medium'>{selectedIngredient && selectedIngredient.name}</span>
        <Badge variant='secondary' className='font-normal'>
          {recipeIngredient.getQty()} {selectedMeasure.name}
        </Badge>
        {recipeIngredient.modifier && (
          <span className='font-light'>({recipeIngredient.modifier})</span>
        )}
      </TableCell>
      <TableCell className='text-right pl-1'>
        <Button
          variant='ghost'
          className='text-gray-300 px-2'
          onClick={(e) => {
            e.stopPropagation();
            deleteRecipeIngredient(recipeIngredient.id);
          }}
        >
          <X className='h-6 w-6' />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default IngredientListItem;
