export function InserisciPopupValidator(title: string, icon: string, description: string, textTooltip: string){

let errors: any = {}

    if(title==undefined || title==""){
        errors.title="Il campo titolo è richiesto";
    }

    if(icon==undefined || icon==""){
        errors.icon="Il campo icona è richiesto";
    }

    if(textTooltip==undefined || textTooltip==""){
        errors.textTooltip="Il campo tooltip è richiesto";
    }

    if(description==undefined || description==""){
        errors.description="Il campo descrizione è richiesto";
    }

    return errors;
}