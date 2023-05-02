interface Props {
  title: string
  disabled?: boolean
  onClick: () => void
}

export default function Button(props: Props) {
  const backgroundColor = props.disabled ? 'bg-gray-400' : 'bg-black'
  return (
    <button className={`rounded cursor-pointer p-5 ${backgroundColor} text-white`} onClick={props.onClick} disabled={props.disabled ?? false}>
      {props.title}
    </button>
  )
}