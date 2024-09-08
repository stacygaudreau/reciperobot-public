/*
    Ingredient List for Composer
*/

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadui/table';
import { Card, CardContent, CardTitle, CardHeader } from '../shadui/card';
import { Badge } from '@/components/shadui/badge';
import { CornerDownLeft, Plus } from 'lucide-react';
import { Button } from '@/components/shadui/button';
import { Separator } from '@/components/shadui/separator';
import { Input } from '@/components/shadui/input';
import AutoAddSelector from '@/components/AutoSelector/AutoAddSelector';
import AutoSelector from '@/components/AutoSelector/AutoSelector';
import IngredientListItem from '@/components/Composer/IngredientListItem';

import { ComposerContext } from './ComposerContext';
import { useContext, useState, useRef, useEffect } from 'react';

/** An editor list of recipe ingredients for in the Recipe Composer view  */
const IngredientList = () => {
  const {
    ingredients,
    measures,
    addRecipeIngredient,
    mode,
    setModeEditing,
    addIngredient,
    recipeData,
  } = useContext(ComposerContext);
  const ingredientPairs = ingredients.map((ing) => {
    return { id: ing.id, label: ing.name };
  });
  const qtyRef = useRef(null);
  const modifierRef = useRef(null);
  const [qty, setQty] = useState('');
  const [modifier, setModifier] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [selectedMeasure, setSelectedMeasure] = useState(null);
  const [newIngredient, setNewIngredient] = useState(null);

  const handleQtyChange = (e) => {
    setQty(e.target.value);
  };

  const handleModifierChange = (e) => {
    setModifier(e.target.value);
  };

  const getFormIsValid = () => {
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

  const formIsVisible = mode !== 'standby';
  const formIsValid = getFormIsValid();

  // add ingredient form handling
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const form = Object.fromEntries(formData.entries());
    if (formIsValid) {
      addRecipeIngredient(
        selectedIngredient,
        form.qty,
        selectedMeasure,
        form.modifier
      );
    }
  };

  useEffect(() => {
    let newIng = ingredientPairs.find((ing) => ing.label === newIngredient);
    if (newIng) setSelectedIngredient(newIng);
  }, [ingredients, newIngredient]);

  return (
    <CardContent>
      <h2 className='text-lg font-semibold mt-0 mb-4'>Ingredients</h2>
      {recipeData.ingredients.length > 0 ? (
        <>
          <Separator className='mb-0' />
          <Table className='pt-0'>
            <TableBody className=''>
              {recipeData.ingredients.map((ingredient, i) => (
                <IngredientListItem
                  key={ingredient.id}
                  recipeIngredient={ingredient}
                  i={i}
                />
              ))}
            </TableBody>
          </Table>
          <Separator className={mode === 'standby' ? 'mb-0' : 'mb-6'} />
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
                Add ingredient
              </Button>
            </div>
          </>
        )
      )}
      {formIsVisible && (
        <>
          <form method='post' onSubmit={handleSubmit}>
            <div className='flex items-center gap-2 h-8'>
              <AutoAddSelector
                values={ingredientPairs}
                dataName='ingredient'
                selectedValue={selectedIngredient}
                setSelectedValue={setSelectedIngredient}
                addNewFn={(name) => {
                  addIngredient(name);
                  setNewIngredient(name);
                }}
              />
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
              <AutoSelector
                values={measures.map((measure) => {
                  return { id: measure.id, label: measure.name };
                })}
                dataName='measure'
                selectedValue={selectedMeasure}
                setSelectedValue={setSelectedMeasure}
              />
              <Input
                id='modifier'
                name='modifier'
                type='text'
                placeholder='Modifier'
                value={modifier}
                onChange={handleModifierChange}
                ref={modifierRef}
              />
              <Button
                className='h-10'
                variant='outline'
                type='submit'
                disabled={!formIsValid}
              >
                <CornerDownLeft className='h-4 w-6' />
              </Button>
            </div>
          </form>
        </>
      )}
    </CardContent>
  );
};

export default IngredientList;
