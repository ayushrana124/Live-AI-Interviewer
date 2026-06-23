import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";


function Form() {
    return (
            <div className="h-screen w-screen flex justify-center items-center">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">AI Interview Kickstart</h2>
        <Input className="mb-4" placeholder="Linkedin Profile URL" />
        <Input className="mb-4" placeholder="GitHub Profile URL" />
        <Button >Start Interview</Button>
      </div>
    </div>
    )
}

export default Form;
