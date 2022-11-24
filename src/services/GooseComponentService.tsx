import http from "../http-common";
import { GooseComponentSpecificType } from "../type/GooseComponentSpecificType";
import { GooseFormType } from "../type/GooseFormType";
import { GooseKVComponentType } from "../type/GooseKVComponentType";

const inserisciComponente = (jsonBody: GooseFormType) => {
    return http.post("/component/inserisci",jsonBody);
}

const getComponent = (formId: string, componentId: string) => {
    return http.get("/component/"+formId+"/"+componentId);
}

const getListaComponent = (formId: string) => {
    return http.get("/component/"+formId);
}

const modificaComponent = (formId: string, componentId: string, jsonBody: GooseFormType) => {
    return http.put("/component/modifica/"+formId+"/"+componentId,jsonBody);
}

const eliminaComponent = (formId: string, componentId: string) => {
    return http.delete("/component/elimina/"+formId+"/"+componentId);
}

const inserisciComponenteSpecific = (jsonBody: GooseComponentSpecificType) => {
    return http.post("/component-specific/inserisci",jsonBody);
}

const getListaComponentSpecific = (formId: string, componentId: string) => {
    return http.get("/component-specific/"+formId+"/"+componentId);
}

const eliminaComponentSpecific = (formId: string, componentId: string, nomeAttributo: string) => {
    return http.delete("/component-specific/elimina/"+formId+"/"+componentId+"/"+nomeAttributo);
}

const inserisciComponenteKv = (jsonBody: GooseKVComponentType) => {
    return http.post("/kv-component/inserisci",jsonBody);
}

const getListaComponentKv = (formId: string, componentId: string) => {
    return http.get("/kv-component/"+formId+"/"+componentId);
}

const eliminaComponentKv = (formId: string, componentId: string, nomeAttributo: string) => {
    return http.delete("/kv-component/elimina/"+formId+"/"+componentId+"/"+nomeAttributo);
}

const gooseComponentService = {
    inserisciComponente,
    getComponent,
    getListaComponent,
    modificaComponent,
    eliminaComponent,
    inserisciComponenteSpecific,
    getListaComponentSpecific,
    eliminaComponentSpecific,
    inserisciComponenteKv,
    getListaComponentKv,
    eliminaComponentKv
    
};
export default gooseComponentService;