interface Props {
    className: string
    disabled?: boolean;
    required?: boolean
    onKeyUp: any
  }
  
  export default function Input(props: Props) {
    return <input type='text' className={props.className} disabled={props.disabled ?? false} required={props.required ?? true} onKeyUp={props.onKeyUp}/>
   //TODOs: Add Custom Errors responses.
  }
  