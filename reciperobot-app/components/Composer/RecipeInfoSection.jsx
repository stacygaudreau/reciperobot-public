/*
    Basic recipe information editing card for in Composer view
*/

import {
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/shadui/card';
import { Badge } from '@/components/shadui/badge';
import { Input } from '@/components/shadui/input';
import { Textarea } from '@/components/shadui/textarea';
import { ComposerContext } from '@/components/Composer/ComposerContext';
import { useContext } from 'react';
import PublicSwitch from './PublicSwitch';

const RecipeInfoSection = () => {
  const {
    mode,
    recipeData,
    setDescription,
    setName,
    setModeEditing,
    toggleRecipePublic,
  } = useContext(ComposerContext);
  const isBeingEdited = mode !== 'standby';

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <>
      {isBeingEdited ? (
        <>
          <form method='post' onSubmit={(e) => {e.preventDefault()}}>
            <CardHeader>
              <div className='flex items-center gap-4 flex-grow justify-between'>
                <div className='flex items-center gap-4 flex-grow'>
                  <CardTitle>
                    <Input
                      id='name'
                      name='name'
                      type='text'
                      placeholder={recipeData.name}
                      value={recipeData.name}
                      onChange={handleNameChange}
                      required
                      className='text-2xl font-bold leading-none tracking-tight'
                    />
                  </CardTitle>
                  <Badge className='text-muted-foreground' variant='outline'>
                    Version {recipeData.version}
                  </Badge>
                  <PublicSwitch isPublic={recipeData.is_public} toggleIsPublicFn={toggleRecipePublic}/>
                </div>
              </div>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              <Textarea
                id='description'
                name='description'
                placeholder={recipeData.description}
                value={recipeData.description}
                onChange={handleDescriptionChange}
                className='text-md'
              />
            </CardContent>
          </form>
        </>
      ) : (
        <>
          <div className='cursor-text text-left' onClick={setModeEditing}>
            <CardHeader className='mb-0'>
              <div className='flex items-center gap-4'>
                <CardTitle className='font-bold'>{recipeData.name}</CardTitle>
                <Badge className='text-muted-foreground' variant='outline'>
                  Version {recipeData.version}
                </Badge>
                <div
                  className={'ml-auto'}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <PublicSwitch isPublic={recipeData.is_public} toggleIsPublicFn={toggleRecipePublic}/>
                </div>
              </div>
            </CardHeader>
            <CardContent className='text-muted-foreground text-justify mr-12'>
              {recipeData.description}
            </CardContent>
          </div>
        </>
      )}
    </>
  );
};

export default RecipeInfoSection;
