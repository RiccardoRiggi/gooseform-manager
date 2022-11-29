export function InserisciButtonValidator(title: string, icon: string){

let errors: any = {}

    if(title==undefined || title==""){
        errors.title="Il campo titolo è richiesto";
    }

    if(icon==undefined || icon==""){
        errors.icon="Il campo icona è richiesto";
    }

    return errors;
}