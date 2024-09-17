import React, { useContext } from 'react'
import { Toaster } from 'react-hot-toast'
import VerticalNavBar from './vertical-nav'
import CustomLink, {TopNavLink} from './custom-link'
import { AppContext } from '../contexts/context'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Layout = observer((props: any) => {
  const appContext = useContext(AppContext)
  const router = useRouter()

  const doLogout = (e: any) => {
    appContext.tastytradeApi.sessionService.logout()
      .then(_result => router.push('/'))
  }

  const renderLogout = () => {
    return (
      <div className='cursor-pointer text-gray-300 hover:text-white text-sm font-medium' onClick={doLogout}>Logout</div>
    )
  }

  const renderLogin = () => <TopNavLink href = "/" title = "Login"/>
  
  return (
    <div>
      <nav className="bg-gray-900">
        <div className="mx-auto px-4 flex justify-between h-16">
          <div className="flex items-center">
            <CustomLink href = "/" title = "TastyTrade OpenAPI" css = "text-white font-bold text-xl"/>
          </div>
          <div className="flex items-center space-x-4">
            {appContext.isLoggedIn ? renderLogout() : renderLogin()}
          </div>
        </div>
      </nav>
      <Toaster
        toastOptions={{
          duration: 5000,
          position: 'bottom-right',
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
})

export default Layout