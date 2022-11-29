import http from "../http-common";
import { GooseHttpRequestKv } from "../type/GooseHttpRequestKv";
import { GooseHttpRequestType } from "../type/GooseHttpRequestType";

const inserisciChiamata = (jsonBody: GooseHttpRequestType) => {
    return http.post("/http/inserisci",jsonBody);
}

const getChiamataById = (formId: string, componentId: string) => {
    return http.get("/http/"+formId+"/"+componentId);
}

const getChiamataByFormId = (formId: string, typeSpecific: string) => {
    return http.get("/http/form/"+typeSpecific+"/"+formId);
}

const modificaChiamata = (pk: number, jsonBody: GooseHttpRequestType) => {
    return http.put("/http/modifica/"+pk,jsonBody);
}

const eliminaChiamata = (pk: number) => {
    return http.delete("/http/elimina/"+pk);
}

const inserisciHeader = (jsonBody: GooseHttpRequestKv) => {
    return http.post("/kv-http/inserisci",jsonBody);
}

const getHeaders = (pk: number) => {
    return http.get("/kv-http/"+pk);
}

const eliminaHeader = (pk: number,chiave: string) => {
    return http.delete("/kv-http/elimina/"+pk+"/"+chiave);
}

const gooseHttpService = {
    inserisciChiamata,
    getChiamataById,
    getChiamataByFormId,
    modificaChiamata,
    eliminaChiamata,
    inserisciHeader,
    getHeaders,
    eliminaHeader   
};
export default gooseHttpService;