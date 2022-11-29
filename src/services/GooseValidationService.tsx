import http from "../http-common";


const getListaComponentSpecific = (type: string) => {
    return http.get("/validation/componente/"+type);
}

const getListaControlli = (type: string) => {
    return http.get("/validation/control/"+type);
}

const getListaRender = (type: string) => {
    return http.get("/validation/render/"+type);
}

const getSuggerimentoPlaceholder = (type: string) => {
    return http.get("/validation/placeholder/"+type);
}

const gooseValidationService = {
    getListaComponentSpecific,
    getListaControlli,
    getListaRender,
    getSuggerimentoPlaceholder
    
};
export default gooseValidationService;