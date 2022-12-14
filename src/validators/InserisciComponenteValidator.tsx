export function InserisciComponenteValidator(id: string, type: string, label: string, widthXl: string, widthLg: string, widthMd: string, widthSm: string, width: string, requiredMark: string) {

    let errors: any = {}

    if (id == undefined || id == "") {
        errors.componentId = "Il campo identificativo è richiesto";
    }

    if (label == undefined || label == "") {
        errors.label = "Il campo label è richiesto";
    }

    if (type == undefined || type == "" || type == "Scegli...") {
        errors.type = "Il tipo è richiesto";
    }

    
    return errors;
}