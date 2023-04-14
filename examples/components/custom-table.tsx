import React from 'react'

interface Props{
    tableInformation: object
}

export default function CustomTable(props:Props) {
  return (
    <div>
    <table className="min-w-full divide-y divide-gray-200">
    <thead>
    <tr className="bg-gray-50">
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
    </tr>
    </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {Object.entries(props.tableInformation).map(([key, value], index) => (
            <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap">{key}</td>
            <td className="px-6 py-4 whitespace-nowrap">{value.toString()}</td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
  )
}
