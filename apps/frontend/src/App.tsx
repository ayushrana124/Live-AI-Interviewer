import { useState } from 'react';
import Form from './components/Form';
import { Result } from './components/Result';
import { Interview } from './components/Interview';
import { Toaster } from 'sonner';

export function App() {

  const [page, setPage] = useState<"form" | "interview" | "result">("form");


  return (
    <>
      {page == "form" && <Form />}
      {page == "interview" && <Interview />}
      {page == "result" && <Result />}
      <Toaster position="top-center" />
    </>
  )
}

export default App;