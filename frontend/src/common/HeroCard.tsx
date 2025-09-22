import { MessageCircleMore } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const HeroCard = () => {
  return (
      <div className="flex-1 p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition cursor-pointer">
          <NavLink to="/chat">
            <div className="flex flex-col items-center gap-1">
              <MessageCircleMore size={50} className="text-error" />
              <h2 className="text-xl font-bold mb-2">Join the Chat Room</h2>
            </div>

            <p className="mb-4 text-gray-600 text-center">Connect with responders in real-time.</p>
            <button className="button-primary w-full">
              Enter Chat
            </button>

          </NavLink>
        </div>
  )
}

export default HeroCard