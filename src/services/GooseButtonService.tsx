import http from "../http-common";
import { GooseButtonType } from "../type/GooseButtonType";
import { GooseFormType } from "../type/GooseFormType";

const inserisciButton = (jsonBody: GooseButtonType) => {
    return http.post("/button/inserisci",jsonBody);
}

const getButton = (formId: string, type: string) => {
    return http.get("/button/"+formId+"/"+type);
}

const modificaButton = (formId: string, type: string, jsonBody: GooseButtonType) => {
    return http.put("/button/modifica/"+formId+"/"+type,jsonBody);
}

const eliminaButton = (formId: string, type: string) => {
    return http.delete("/button/elimina/"+formId+"/"+type);
}


const gooseButtonService = {
    inserisciButton,
    getButton,
    modificaButton,
    eliminaButton   
};
export default gooseButtonService;