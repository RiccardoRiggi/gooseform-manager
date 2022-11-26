import http from "../http-common";
import { GooseButtonType } from "../type/GooseButtonType";
import { GooseFormType } from "../type/GooseFormType";
import { GoosePopupType } from "../type/GoosePopupType";


const getListaComponentSpecific = (type: string) => {
    return http.get("/validation/componente/"+type);
}


const gooseValidationService = {
    getListaComponentSpecific,
    
};
export default gooseValidationService;