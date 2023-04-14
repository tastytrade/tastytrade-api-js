import React from 'react'
import Link from 'next/link'

interface Props{
  href: string
  title: string
  css?: string
}

export default function CustomLink(props:Props) {
  return (
    <Link href={props.href}>
      <a className = {props.css}>{props.title}</a>
    </Link>
  )
}

export function TopNavLink(props:Props){
  const css = "text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
  return(
    <CustomLink css = {css} {...props} />
  )
}

export function VerticalNavLink(props:Props){
  const css = "px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
  return(
    <li className = {css}>
      <CustomLink {...props} />
    </li>
  )
}
