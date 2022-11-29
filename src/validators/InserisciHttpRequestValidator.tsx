export function InserisciHttpRequestValidator(url: string, method: string, body: string){

let errors: any = {}

    if(url==undefined || url==""){
        errors.url="Il campo url è richiesto";
    }

    if(method==undefined || method==""){
        errors.method="Il campo metodo è richiesto";
    }

    if(body==undefined || body==""){
        errors.body="Il campo body è richiesto";
    }

    return errors;
}