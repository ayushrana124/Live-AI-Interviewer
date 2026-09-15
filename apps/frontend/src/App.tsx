import { useState } from 'react';
import Form from './components/Form';
import { Result } from './components/Result';
import { Interview } from './components/Interview';
import { Toaster } from 'sonner';
import {BrowserRouter as Router, Routes, Route} from "react-router";

export function App() {

  const [page, setPage] = useState<"form" | "interview" | "result">("form");


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/interview/:InterviewId" element={<Interview />} />
        <Route path="/result/:InterviewId" element={<Result />} />
      </Routes>
      <Toaster position="top-center" />
    </Router>
  )
}

export default App;