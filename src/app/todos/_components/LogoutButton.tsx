"use client"

import { authClient } from "@/lib/auth/client"
import { useRouter } from "next/navigation"
import { useState } from "react" 

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false) 

  const handleLogout = async () => {
    setLoading(true) 
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <button 
      type="submit"
      disabled={loading}  
      className="bg-blue-600 text-white py-1 px-2 text-xs rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleLogout}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  )
}
