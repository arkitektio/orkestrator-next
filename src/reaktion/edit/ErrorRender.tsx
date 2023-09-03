import { SolvedError, ValidationError } from "../validation/types"

export const SolvedErrorRender = ({error}: {error: SolvedError}) => {

    return <div className="p-1 text-xs" >
    {error.message} {error.path}
 </div>

}

export const RemainingErrorRender = ({error, onClick}: {error: ValidationError, onClick: (error: ValidationError) => void}) => {

    return <div className="p-1 text-xs" onClick={() => onClick(error)}>
    {error.message} {error.path}
 </div>

}