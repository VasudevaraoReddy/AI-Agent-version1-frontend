import React from 'react'
import { Send } from 'lucide-react'


const ChatInput = ({ isLoading, placeholder, onSubmit }) => {
  const [input, setInput] = React.useState('');

  const sendMessage = () => {
    onSubmit(input)
    setInput('')
  }

  return (
    <div className='flex flex-row justify-between mb-[-40px]'>
      <input placeholder={placeholder} className='h-[60px] border p-2 rounded-md w-full'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
          }
        }}
      ></input>
      <button onClick={sendMessage} className='bg-[#ffe600] p-3 cursor-pointer ml-1 rounded-md self-center'>
        <Send />
      </button>
    </div>
  )
}

export default ChatInput