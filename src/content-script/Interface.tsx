import { Icon } from '@primer/octicons-react'

interface Props {
    name : string,
    onClick : () => void,
    icon : Icon,
    disabled? : boolean | false,
}

export function Button(props: Props) {
    return (
        <button className="btn btn-xs chatgpt-button" onClick={props.onClick } disabled={props.disabled} style= {{marginTop: '-0.5px' }} title={props.name} >
            <props.icon size='small' className="icon" /> {props.name}
        </button>
    )

}
