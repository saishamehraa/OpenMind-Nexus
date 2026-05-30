import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import HelpButton from './components/HelpButton';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      <HelpButton />
    </>
  );
}
