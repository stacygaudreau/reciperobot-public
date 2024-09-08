/*
    An alert to display errors to the user in forms
*/

import { Alert, AlertDescription, AlertTitle } from '@/components/shadui/alert';
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

const ErrorAlert = ({message}) => {
  return (
    <Alert variant="destructive" className='bg-background'>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  )
}

export default ErrorAlert
