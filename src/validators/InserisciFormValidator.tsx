export function InserisciFormValidator(formId: string, title: string, icon: string, description: string){

let errors: any = {}

    if(formId==undefined || formId==""){
        errors.formId="Il campo identificativo è richiesto";
    }

    if(title==undefined || title==""){
        errors.title="Il campo titolo è richiesto";
    }

    return errors;
}