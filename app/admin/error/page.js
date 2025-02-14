import React from 'react'

export default function Error({error}) {
  return (
  <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg">
                  <h1 className="text-3xl font-bold">Oops! Something went wrong.</h1>
                  <p className="mt-4">Error: {error}</p>
              </div>
          </div>
  )
}
