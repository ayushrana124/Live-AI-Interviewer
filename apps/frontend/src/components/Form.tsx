import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { toast } from "sonner"
import axios from "axios";
import { BACKEND_URL } from "../lib/config";

function Form() {

  const [github, setGithub] = useState<string>("");

  async function onSubmit() {
    if (!github) {
      toast.error("Please fill in all fields");
    }

   await axios.post(`${BACKEND_URL}/api/v1/pre-interview`, {
      github,
   }
    )
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">AI Interview Kickstart</h2>
        <Input
          className="mb-4"
          placeholder="GitHub Profile URL"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
        />
        <Button onClick={onSubmit}>Start Interview</Button>
      </div>
    </div>
  )
}

export default Form;
