import { Button } from './components/ui/button'
import './App.css'
import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea"

function App() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(""); 

  const handleKeyUp = (e : any)=>{
    if (e.key == "Enter"){
      const text = input.trim();
      if (!text){
        return;
      }
      console.log(text);
    }
  };

  return (
    <div className="w-full h-screen bg-[#131314] text-white relative">
      <div className="mx-auto container h-full flex flex-col px-3 lg:max-w-3xl">

        {/* Chat content area */}
        <div className="flex-1 overflow-y-auto p-4 rounded-2xl space-y-4 pb-[120px]">
          <div className="rounded-xl w-fit px-4 py-2 bg-[#1f1f1f] border border-[#2a2a2a] text-gray-200">
            <p className='tracking-tight font-light text-sm' >Assistant Message</p>
          </div>

          <div className="w-fit px-4 py-2 rounded-xl ml-auto bg-[#3a3a3c] text-gray-100 border border-[#4a4a4c]">
            <h1 className='tracking-tight font-light text-sm'></h1>
          </div>

          {/* (Your long list of messages…) */}
        </div>

        {/* ---- FIXED INPUT BAR ---- */}
        <div className="fixed bottom-0 left-0 w-full bg-[#131314] px-4 pb-4">

          {/* Centered inside container */}
          <div className="mx-auto container lg:max-w-3xl">
            <div className="relative flex w-full items-end rounded-2xl bg-[#1f1f1f] p-3 shadow-md border border-[#2e2e2e]">

              {/* Textarea */}
              <Textarea
                placeholder="Ask anything..."
                className="
          w-full resize-none bg-transparent border-none p-0
          focus:border-none focus:outline-none focus:ring-0
          focus-visible:ring-0 focus-visible:outline-none
        "       
                onChange={(e)=>{
                  setInput(e.target.value);
                }}
                onKeyUp={(e)=>{
                  handleKeyUp(e);
                }}
                
              />

              {/* Ask Button */}
              <Button
                onClick={() => { }}
                className="absolute right-3 bottom-3 rounded-xl px-4 py-2 text-sm"
                variant="secondary"
              >
                Ask
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default App
