import { useAuthStore } from '../store/useAuthStore'

function ChatPage() {
  const {logout} = useAuthStore();
  return (
    <div>
      <div>ChatPage </div>
    <button onClick={logout} type='submit'>logout</button>
    </div>
    
  )
}

export default ChatPage