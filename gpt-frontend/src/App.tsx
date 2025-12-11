import { Button } from './components/ui/button'
import './App.css'
import { useState, useRef, useEffect } from 'react'; // Added useRef/useEffect for auto-scroll
import { Textarea } from "@/components/ui/textarea"

interface Message{
  role : "user" | "assistant";
  content : string
}

function App() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null); // To scroll to bottom automatically

  const [messages, setMessages] = useState<Message[]>([]);

  // Scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // MODIFIED: Accepts the text as an argument to ensure we don't send an empty string
  const sendMessage = async (messageText: string) => {
    try {
      setLoading(true);
      
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: messageText })
      });
      
      const json = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: json.response }
      ]);
  
      
    } catch (error) {
      console.error(error);
      
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = input.trim();
      if (!text) return;
  
      // 1. Append user message
      setMessages(prev => [
        ...prev,
        { role: "user", content: text }
      ]);
  
      // 2. Clear input immediately
      setInput(""); 
  
      // 3. Trigger backend request
      sendMessage(text); 
    }
  };
  


  return (
    <div className="w-full h-screen bg-neutral-950 text-white relative flex flex-col font-sans">
      <div className="mx-auto w-full h-full flex flex-col lg:max-w-3xl">

        {/* Chat content area */}
        {/* Added ref={scrollRef} to this div for auto-scrolling */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 pb-[140px] scroll-smooth">
          
          {messages && messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                 rounded-2xl px-4 py-2 text-sm leading-relaxed border
                ${msg.role === 'assistant' 
                  ? 'border-none text-neutral-300 rounded-tl-sm' 
                  : 'bg-zinc-800 border-transparent rounded-tr-sm font-medium'
                }
              `}>
                <p className='tracking-wide'>{msg.content}</p>
              </div>
            </div>
          ))}

          {/* ---- LOADING INDICATOR ---- */}
          {loading && (
             <div className="flex w-full justify-start animate-in fade-in duration-300">
               <div className="max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-neutral-900 border-neutral-800 text-neutral-300 rounded-tl-sm">
                 <div className="flex items-center gap-2">
                   {/* Option 1: Just Text */}
                   <span className="animate-pulse tracking-wide text-neutral-400">Thinking...</span>
                   
                   {/* Option 2: (Optional) Bouncing Dots - You can remove this if you only want text */}
                   {/* <div className="flex gap-1 h-full items-center">
                     <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                     <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                     <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
                   </div> */}
                 </div>
               </div>
             </div>
          )}

        </div>

        {/* Fixed Input Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-neutral-950/80 backdrop-blur-xl border-t border-white/5 pb-6 pt-4 px-4 z-10">
          <div className="mx-auto container lg:max-w-3xl">
            <div className="relative flex w-full items-end rounded-3xl bg-neutral-900/50 p-2 shadow-2xl border border-white/10 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-white/20 transition-all duration-300">
              <Textarea
                value={input}
                placeholder="Ask anything..."
                className="
                  w-full resize-none bg-transparent border-none p-3 pl-4 min-h-[50px]
                  text-neutral-200 placeholder:text-neutral-500
                  focus:border-none focus:outline-none focus:ring-0
                  focus-visible:ring-0 focus-visible:outline-none
                  scrollbar-hide text-base
                "
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                onClick={() => handleKeyDown({ key: "Enter", preventDefault: () => {} })}
                className="mb-1 mr-1 rounded-full px-5 bg-white text-black hover:bg-neutral-200 transition-colors"
                size="sm"
                disabled={loading} // Disable button while loading
              >
                {loading ? '...' : 'Ask'}
              </Button>
            </div>
            <div className='text-center mt-3'>
              <p className='text-xs text-neutral-600 font-medium'>Powered by AI</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App;