/*
  A dropdown selector form element which has autocomplete.
  Adapted from https://ui.shadcn.com/docs/components/combobox
*/

'use client';

import { useState } from 'react';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { Button } from '@/components/shadui/button';
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
import { CaretSortIcon } from '@radix-ui/react-icons';

function SelectorList({ setOpen, values, setSelectedValue, placeholder }) {
  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
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
  );
}

export default function AutoAddSelector({
  values,
  placeholder = 'Filter...',
  dataName = 'item',
  selectedValue,
  setSelectedValue,
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-[200px] justify-between'
          >
            {selectedValue ? selectedValue.label : `Select ${dataName}...`}
            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0' align='start'>
          <SelectorList
            setOpen={setOpen}
            values={values}
            setSelectedValue={setSelectedValue}
            placeholder={placeholder}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {selectedValue ? selectedValue.label : `Select ${dataName}...`}
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mt-4 border-t'>
          <SelectorList
            setOpen={setOpen}
            values={values}
            setSelectedValue={setSelectedValue}
            placeholder={placeholder}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
