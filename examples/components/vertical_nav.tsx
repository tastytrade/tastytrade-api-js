
import React from 'react'
import Link from 'next/link'

export default function VerticalNavBar() {
  
  return (
    <div className="w-40 bg-gray-100">
      <ul>
        <li>
          <Link href = "/trade">
            Trade
          </Link>
        </li>
        <li>
          <Link href = "/home">
            Home
          </Link>
        </li>
        <li>
          <Link href = "/follow">
            Follow
          </Link>
        </li>
        <li>
          <Link href = "/portfolio">
            Portfolio
          </Link>
        </li>
        <li>
          <Link href = "/grid">
            Grid
          </Link>
        </li>
        <li>
          <Link href = "/activity">
            Activity
          </Link>
        </li>
        <li>
          <Link href = "/journal">
            Journal
          </Link>
        </li>
        <li>
          <Link href ="/tastylive">
            TastyLive
          </Link>
        </li>
      </ul>
  </div>
  )
}