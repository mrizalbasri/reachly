import { Show, UserButton } from '@clerk/tanstack-react-start'
import { Link } from '@tanstack/react-router'

export default function HeaderUser() {
  return (
    <>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8 rounded-full border border-[#EEEEF0]',
            },
          }}
        />
      </Show>
      <Show when="signed-out">
        <div className="flex items-center gap-2">
          <Link
            to="/sign-in"
            className="px-4 py-1.5 text-xs font-medium text-[#1C1C1E] hover:text-[#7C3AED] transition-colors rounded-full focus:outline-none"
          >
            Masuk
          </Link>
          <Link
            to="/sign-up"
            className="px-4 py-1.5 text-xs font-bold glass-btn-primary text-white rounded-full transition-all focus:outline-none transform hover:scale-105"
          >
            Daftar
          </Link>
        </div>
      </Show>
    </>
  )
}
