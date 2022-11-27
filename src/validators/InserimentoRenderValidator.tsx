export function InserimentoRenderValidator(formId: string, type: string, typeSpecific: string, idComponentA: string, idComponentB: string, idComponentC: string, value: string ) {

    let errors: any = {}

    if (type == undefined || type == "" || type == "Scegli...") {
        errors.type = "Il tipo è richiesto";
    }


    return errors;
}