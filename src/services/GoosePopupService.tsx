import http from "../http-common";
import { GooseButtonType } from "../type/GooseButtonType";
import { GooseFormType } from "../type/GooseFormType";
import { GoosePopupType } from "../type/GoosePopupType";

const inserisciPopup = (jsonBody: GoosePopupType) => {
    return http.post("/popup/inserisci",jsonBody);
}

const getPopupById = (formId: string, componentId: string) => {
    return http.get("/popup/"+formId+"/"+componentId);
}

const getPopupByFormId = (formId: string) => {
    return http.get("/popup/"+formId);
}

const modificaPopup = (pk: number, jsonBody: GoosePopupType) => {
    return http.put("/popup/modifica/"+pk,jsonBody);
}

const eliminaPopup = (pk: number) => {
    return http.delete("/popup/elimina/"+pk);
}


const goosePopupService = {
    inserisciPopup,
    getPopupByFormId,
    getPopupById,
    modificaPopup,
    eliminaPopup   
};
export default goosePopupService;