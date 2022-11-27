import http from "../http-common";
import { GooseControlType } from "../type/GooseControlType";
import { GooseFormType } from "../type/GooseFormType";
import { GooseKControlType } from "../type/GooseKControlType";
import { GooseRenderType } from "../type/GooseRenderType";

const inserisciRender = (jsonBody: GooseRenderType) => {
    return http.post("/render/inserisci",jsonBody);
}

const getRender = (pk: number) => {
    return http.get("/render/"+pk);
}

const getListaRender = (formId: string) => {
    return http.get("/render/lista/"+formId);
}

const modificaRender = (formId: string, jsonBody: GooseRenderType) => {
    return http.put("/render/modifica/"+formId,jsonBody);
}

const eliminaRender = (pk: number) => {
    return http.delete("/render/elimina/"+pk);
}

const gooseRenderService = {
    inserisciRender,
    getRender,
    getListaRender,
    modificaRender,
    eliminaRender
};
export default gooseRenderService;