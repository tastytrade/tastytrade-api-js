import React from 'react'
import { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import VerticalNavBar from './vertical-nav'

export default function Layout(props: any) {
  return (
    <div>
      <div className="navBar">
        <Link href="/">Quote Data</Link>
        <Link href="/account-streamer">Account Data</Link>
        <Link href = "/login">Login</Link>
        <Link href = "/accounts">My Accounts</Link>
      </div>
      <Toaster
        toastOptions={{
          duration: 5000,
          success: {
            duration: 10000
          }
        }}
      />
      <div className='flex flex-row'>
        <VerticalNavBar />
        <div className='flex-1 w-full bg-white overflow-y-auto px-20 py-14'>
          {props.children}
        </div>
      </div>
    </div>
  )
}