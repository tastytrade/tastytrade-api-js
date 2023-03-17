import React from 'react'
import { Toaster } from 'react-hot-toast'
import Link from 'next/link'

export default function Layout(props: any) {
  return (
    <div>
      <div className="navBar">
        <Link href="/">Quote Data</Link>
        <Link href="/account-streamer">Account Data</Link>
        <Link href = "/login">Login</Link>
      </div>
      <Toaster
        toastOptions={{
          duration: 5000,
          success: {
            duration: 10000
          }
        }}
      />
      {props.children}
    </div>
  )
}