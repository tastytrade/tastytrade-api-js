
import React from 'react'
import Link from 'next/link'
import VNavStyles from "../styles/VerticalNav.module.css"


export default function VerticalNavBar() {
  
  return (
    <nav className = {VNavStyles["vertical-nav"]}>
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
  </nav>
  )
}