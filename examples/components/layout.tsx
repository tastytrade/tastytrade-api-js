import React from 'react'
import { Toaster } from 'react-hot-toast'
import VerticalNavBar from './vertical-nav'
import CustomLink, {TopNavLink} from './custom-link'

export default function Layout(props: any) {
  const css = "text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
  
  return (
    <div>
      <nav className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16">
          <div className="flex items-center">
            <CustomLink href = "/home" title = "TastyTrade OpenAPI" css = "text-white font-bold text-xl"/>
          </div>
          <div className="flex items-center space-x-4">
          <TopNavLink href = "/" title = "Quote Data"/>
          <TopNavLink href = "/account-streamer" title = "Account Data"/>
          <TopNavLink href = "/login" title = "Login"/>
          <TopNavLink href = "/accounts" title = "My Accounts"/>
          </div>
        </div>
      </nav>
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