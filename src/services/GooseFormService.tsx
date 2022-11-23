import http from "../http-common";
import { GooseFormType } from "../type/GooseFormType";

const inserisciForm = (jsonBody: GooseFormType) => {
    return http.post("/form/inserisci",jsonBody);
}

const getForm = (formId: string) => {
    return http.get("/form/"+formId);
}

const getListaForm = () => {
    return http.get("/form/");
}

const modificaForm = (formId: string, jsonBody: GooseFormType) => {
    return http.put("/form/modifica/"+formId,jsonBody);
}

const eliminaForm = (formId: string) => {
    return http.delete("/form/elimina/"+formId);
}


const gooseFormService = {
    inserisciForm,
    getForm,
    getListaForm,
    modificaForm,
    eliminaForm   
};
export default gooseFormService;