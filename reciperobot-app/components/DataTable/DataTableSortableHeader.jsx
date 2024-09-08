import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/shadui/button';

/** Header for a data table column which can be sorted. */
const DataTableSortableHeader = ({ column, title }) => {
  return (
    <Button
      variant='text'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className='justify-start px-0 hover:text-accent-foreground'
    >
      <span>{title}</span>
      <ArrowUpDown className='ml-2 h-4 w-4' />
    </Button>
  );
};

export default DataTableSortableHeader;
