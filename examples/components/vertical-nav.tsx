
import React from 'react'
import { VerticalNavLink } from './custom-link'

export default function VerticalNavBar() {
  
  return (
    <nav className="w-40 bg-gray-100 flex flex-col h-full justify-center">
      <ul className="space-y-2">
        <VerticalNavLink href = "/portfolio" title = "Portfolio"/>
        <VerticalNavLink href = "/balances" title = "Balances"/>
        <VerticalNavLink href = "/orders" title = "Orders"/>
        <VerticalNavLink href = "/transactions" title = "Transactions"/>
        <VerticalNavLink href = "/account-status" title = "Account Status"/>
        <VerticalNavLink href = "/symbol-search" title = "Symbol Search"/>
        <VerticalNavLink href = "/quote-streamer" title = "Quote Data"/>
        <VerticalNavLink href = "/account-streamer" title = "Account Data"/>
        <VerticalNavLink href = "/charts" title = "Charts"/>
      </ul>
  </nav>
  )
}
