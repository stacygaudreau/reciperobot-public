/*
  A selector form element which has autocomplete and lets you
  add a new entry if none is found.
  Adapted from https://ui.shadcn.com/docs/components/combobox
*/

'use client';

import { useMediaQuery } from '@/lib/useMediaQuery';
import { Button } from '@/components/shadui/button';
import { Plus } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/shadui/command';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/shadui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadui/popover';
import { useState } from 'react';

import { capitalise } from '@/lib/utils';

function SelectorList({
  setOpen,
  values,
  setSelectedValue,
  placeholder,
  addNewFn = null,
}) {
  const [filterValue, setFilterValue] = useState('');

  return (
    <div className='flex flex-col items-center justify-center'>
      <Command>
        {' '}
        <CommandList>
          <CommandGroup>
            <CommandItem className='flex items-center justify-center'>
              {addNewFn !== null && (
                <Button
                  disabled={filterValue == ''}
                  onClick={() => {
                    addNewFn(filterValue);
                    setOpen(false);
                  }}
                >
                  <Plus className='h-4 w-6' />
                  Add {'ingredient'}
                </Button>
              )}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <Command>
        <CommandInput
          placeholder={placeholder}
          value={filterValue}
          onValueChange={(v) => {
            setFilterValue(v);
          }}
        />

        <CommandList>
          <CommandEmpty>
            No results found.
          </CommandEmpty>
          <CommandGroup>
            {values.map((v) => (
              <CommandItem
                key={v.id}
                value={v.id}
                onSelect={() => {
                  setSelectedValue(
                    values.find((item) => item.id === v.id) || null
                  );
                  setOpen(false);
                }}
              >
                {v.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

export default function AutoAddSelector({
  values,
  placeholder = 'Filter...',
  dataName = 'item',
  selectedValue,
  setSelectedValue,
  addNewFn = null,
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' className='w-[150px] justify-start'>
            {selectedValue ? (
              <>{selectedValue.label}</>
            ) : (
              <>+ {capitalise(dataName)}</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0' align='start'>
          <SelectorList
            setOpen={setOpen}
            values={values}
            setSelectedValue={setSelectedValue}
            placeholder={placeholder}
            addNewFn={addNewFn}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline' className='w-[150px] justify-start'>
          {selectedValue ? (
            <>{selectedValue.label}</>
          ) : (
            <>+ {capitalise(dataName)}</>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mt-4 border-t'>
          <SelectorList
            setOpen={setOpen}
            values={values}
            setSelectedValue={setSelectedValue}
            placeholder={placeholder}
            addNewFn={addNewFn}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
