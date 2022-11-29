import http from "../http-common";
import { GooseControlType } from "../type/GooseControlType";
import { GooseKControlType } from "../type/GooseKControlType";

const inserisciControl = (jsonBody: GooseControlType) => {
    return http.post("/control/inserisci",jsonBody);
}

const getControl = (pk: number) => {
    return http.get("/control/"+pk);
}

const getListaControlli = (formId: string) => {
    return http.get("/control/lista/"+formId);
}

const modificaControllo = (formId: string, jsonBody: GooseControlType) => {
    return http.put("/control/modifica/"+formId,jsonBody);
}

const eliminaControllo = (pk: number) => {
    return http.delete("/control/elimina/"+pk);
}

const inserisciRiga = (jsonBody: GooseKControlType) => {
    return http.post("/k-control/inserisci",jsonBody);
}

const getRighe = (pk: number) => {
    return http.get("/k-control/"+pk);
}

const eliminaRiga = (pk: number,k:string) => {
    return http.delete("/k-control/elimina/"+pk+"/"+k);
}

const gooseControlService = {
    inserisciControl,
    getControl,
    getListaControlli,
    modificaControllo,
    eliminaControllo,
    inserisciRiga,
    getRighe,
    eliminaRiga   
};
export default gooseControlService;