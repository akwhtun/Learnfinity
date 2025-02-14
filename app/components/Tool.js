import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Tool({children}) {
    
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-violet-900 text-white">
           
    <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-violet-900"></div>
   
  <Navbar />

  <main className="flex-grow w-full max-w-6xl mt-16 z-10">
    {children}
  </main>

  <Footer />
</div>
  )
}
