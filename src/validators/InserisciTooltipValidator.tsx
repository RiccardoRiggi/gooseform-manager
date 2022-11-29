export function InserisciTooltipValidator(icon: string, tooltip: string){

let errors: any = {}

    
    if(icon==undefined || icon==""){
        errors.icon="Il campo icona è richiesto";
    }

    if(tooltip==undefined || tooltip==""){
        errors.tooltip="Il campo tooltip è richiesto";
    }



    return errors;
}