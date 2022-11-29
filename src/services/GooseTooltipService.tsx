import http from "../http-common";
import { GooseTooltipType } from "../type/GooseTooltipType";

const inserisciTooltip = (jsonBody: GooseTooltipType) => {
    return http.post("/tooltip/inserisci",jsonBody);
}

const getTooltipById = (formId: string, componentId: string) => {
    return http.get("/tooltip/"+formId+"/"+componentId);
}

const getTooltipByFormId = (formId: string) => {
    return http.get("/tooltip/"+formId);
}

const modificaTooltip = (pk: number, jsonBody: GooseTooltipType) => {
    return http.put("/tooltip/modifica/"+pk,jsonBody);
}

const eliminaTooltip = (pk: number) => {
    return http.delete("/tooltip/elimina/"+pk);
}


const gooseTooltipService = {
    inserisciTooltip,
    getTooltipByFormId,
    getTooltipById,
    modificaTooltip,
    eliminaTooltip   
};
export default gooseTooltipService;