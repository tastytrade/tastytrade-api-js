import React from 'react'
import _ from 'lodash'

interface Props{
    rows: any[]
    renderItem: (item: any, index: number) => JSX.Element
}

export default function CustomTable(props:Props) {
  const renderRow = (item: any, index: number) => {
    <div key={index}>
      {props.renderItem(item, index)}
    </div>
  }

  return (
    <>
      {props.rows.map(renderRow)}
    </>
  )
}

interface ObjectPropertiesTable {
  item: object
}

export function ObjectPropertiesTable(props: ObjectPropertiesTable) {
  const keys = Object.keys(props.item)
  const renderRow = (key: string, index: number) => {
    return (
      <div className='flex flex-row'>
        <div>{key}</div>
        <div className='ml-5'>{_.get(props.item, key)}</div>
      </div>
    )
  }

  return (
    <CustomTable rows={keys}  renderItem={renderRow} />
  )
}