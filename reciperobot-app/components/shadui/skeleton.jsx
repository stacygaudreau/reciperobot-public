/*
  This is a shadcn/ui component. 
  NOT written by the Recipe Robot author!
*/

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (<div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />);
}

export { Skeleton }
