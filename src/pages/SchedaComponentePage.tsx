import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../modules/feedback/actions';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gooseComponentService from '../services/GooseComponentService';
import { InserisciComponenteValidator } from '../validators/InserisciComponenteValidator';
import { GooseComponentType } from '../type/GooseComponentType';
import gooseValidationService from '../services/GooseValidationService';
import GooseHttpRequestPanel from '../components/manager/GooseHttpRequestPanel';
import GooseKeyValuePanel from '../components/manager/GooseKeyValuePanel';
import GooseTooltipPanel from '../components/manager/GooseTooltipPanel';
import GoosePopupPanel from '../components/manager/GoosePopupPanel';
import GooseComponentSpecificPanel from '../components/manager/GooseComponentSpecificPanel';


export default function SchedaComponentePage() {

    let params = useParams();

    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);

    const [formId, setFormId] = React.useState<string>(params.formId != undefined ? params.formId : "");
    const [componentId, setComponentId] = React.useState<string>(params.componentId != undefined ? params.componentId : "");

    const [listaPossibiliAttributiSpecifici,setListaPossibiliAttributiSpecifici] = React.useState([]);

    const listaType = [
        "Scegli...",
        "GOOSE_TEXT_AREA",
        "GOOSE_SELECT",
        "GOOSE_LINKED_SELECT",
        "GOOSE_DATA_LIST",
        "GOOSE_TEXT_FIELD",
        "GOOSE_PASSWORD_FIELD",
        "GOOSE_NUMBER_FIELD",
        "GOOSE_RADIO",
        "GOOSE_CHECKBOX",
        "GOOSE_EMAIL_FIELD",
        "GOOSE_DATE_FIELD",
        "GOOSE_DATE_TIME_FIELD",
        "GOOSE_MONTH_FIELD",
        "GOOSE_WEEK_FIELD",
        "GOOSE_TIME_FIELD",
        "GOOSE_TEL_FIELD",
        "GOOSE_URL_FIELD",
        "GOOSE_COLOR_FIELD",
        "GOOSE_RANGE_FIELD"
    ]

    const listaColBootstrap = [
        "12", "6", "4", "3", "2", "1"
    ]

    const listaSiNo = [
        "NO", "SI"
    ]

    const listaPadding = [
        "0", "1", "2", "3", "4", "5"
    ]

    let dispatch = useDispatch();
    let navigate = useNavigate();

    const [formErrors, setFormErrors] = React.useState(Object);


    const [chiamataHttpSupportata, setChiamataHttpSupportata] = React.useState(false);
    const [valuesSupportati, setValuesSupportati] = React.useState(false);


    const [componentIdEsistente, setComponentIdEsistente] = React.useState<boolean>(false);

    const recuperaListaPossibiliAttributiSpecifici = async (type: string) => {
        await gooseValidationService.getListaComponentSpecific(type).then(response => {

            for(let c=0;c<response.data.length;c++){
                console.warn(response.data[c]);
                if(response.data[c].k=="values"){
                    setValuesSupportati(true);
                }
                if(response.data[c].k=="dynamicValues"){
                    setChiamataHttpSupportata(true);
                }
            }
            setListaPossibiliAttributiSpecifici(response.data);
        }).catch(e => {
            console.error(e);
        });
    }

    const [label, setLabel] = React.useState<string>("");

    const aggiornaLabel = (event: any) => {
        setLabel(event.target.value);
    };

    const [type, setType] = React.useState<string>("");

    const aggiornaType = (event: any) => {
        setType(event.target.value);
    };

    const [width, setWidth] = React.useState<string>("");

    const aggiornaWidth = (event: any) => {
        setWidth(event.target.value);
    };

    const [widthSm, setWidthSm] = React.useState<string>("");

    const aggiornaWidthSm = (event: any) => {
        setWidthSm(event.target.value);
    };

    const [widthMd, setWidthMd] = React.useState<string>("");

    const aggiornaWidthMd = (event: any) => {
        setWidthMd(event.target.value);
    };

    const [widthLg, setWidthLg] = React.useState<string>("");

    const aggiornaWidthLg = (event: any) => {
        setWidthLg(event.target.value);
    };

    const [widthXl, setWidthXl] = React.useState<string>("");

    const aggiornaWidthXl = (event: any) => {
        setWidthXl(event.target.value);
    };

    const [requiredMark, setRequiredMark] = React.useState<string>("");

    const aggiornaRequiredMark = (event: any) => {
        setRequiredMark(event.target.value);
    };

    const [ordination, setOrdination] = React.useState<number>(1);

    const aggiornaOrdination = (event: any) => {
        setOrdination(event.target.value);
    };

    const [paddingBottom, setPaddingBottom] = React.useState<string>("0");

    const aggiornaPaddingBottom = (event: any) => {
        setPaddingBottom(event.target.value);
    };

    const [paddingLeft, setPaddingLeft] = React.useState<string>("0");

    const aggiornaPaddingLeft = (event: any) => {
        setPaddingLeft(event.target.value);
    };

    const [paddingRight, setPaddingRight] = React.useState<string>("0");

    const aggiornaPaddingRight = (event: any) => {
        setPaddingRight(event.target.value);
    };

    const [paddingTop, setPaddingTop] = React.useState<string>("0");

    const aggiornaPaddingTop = (event: any) => {
        setPaddingTop(event.target.value);
    };

    const modificaForm = async () => {
        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));

        let errors = InserisciComponenteValidator(formId, type, label, widthXl, widthLg, widthMd, widthSm, width, requiredMark);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0 && !componentIdEsistente) {

            dispatch(fetchIsLoadingAction(false));

            let jsonBody: GooseComponentType = {
                formId: formId,
                id: componentId,
                type: type,
                label: label,
                widthXl: widthXl,
                widthLg: widthLg,
                widthMd: widthMd,
                widthSm: widthMd,
                width: width,
                requiredMark: requiredMark == "SI",
                ordination: ordination,
                paddingBottom: paddingBottom,
                paddingLeft: paddingLeft,
                paddingRight: paddingRight,
                paddingTop: paddingTop
            };

            await gooseComponentService.modificaComponent(formId, componentId, jsonBody).then(response => {
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoSuccessAction("Componente modificato con successo"));
                navigate("/scheda-componente/" + formId + "/" + componentId);
            }).catch(e => {
                dispatch(fetchIsLoadingAction(false));
                console.error(e.response);
                dispatch(fetchTestoDangerAction("Errore durante l'inserimento del form"));
            });
        } else {
            dispatch(fetchTestoWarnAction("Verifica le informazioni inserite!"))
        }


    }


    const ricerca = async () => {
        if (params.formId != undefined && params.componentId != undefined) {
            let formId = params.formId != undefined ? params.formId : "";
            let componentId = params.componentId != undefined ? params.componentId : "";

            await gooseComponentService.getComponent(formId,componentId).then(response => {
                console.warn(response.data);
                let formTrovato: GooseComponentType = response.data;
                setLabel(formTrovato.label);
                setType(formTrovato.type)
                setWidth(formTrovato.width);
                setWidthSm(formTrovato.widthSm);
                setWidthMd(formTrovato.widthMd);
                setWidthLg(formTrovato.widthLg);
                setWidthXl(formTrovato.widthXl);
                setRequiredMark(formTrovato.requiredMark==true?"SI":"NO");
                recuperaListaPossibiliAttributiSpecifici(formTrovato.type);
                setOrdination(formTrovato.ordination);
                setPaddingBottom( formTrovato.paddingBottom)
                setPaddingLeft( formTrovato.paddingLeft)
                setPaddingRight( formTrovato.paddingRight)
                setPaddingTop( formTrovato.paddingTop)

                dispatch(fetchIsLoadingAction(false));
            }).catch(e => {
                console.error(e);
                dispatch(fetchIsLoadingAction(false));
            });
        } else {
            dispatch(fetchIsLoadingAction(false));
            navigate("/scheda-form/"+formId);
        }

    }

    useEffect(() => {
        if (!ricercaEseguita) {
            dispatch(fetchIsLoadingAction(true));
            setRicercaEseguita(true);
            ricerca();
        }
    });

    return (
        <Layout>
            <Link className='btn btn-primary' to={"/scheda-form/"+formId}>Indietro</Link>
            <div className="card shadow mb-4 mt-2">
                <div
                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-edit mr-2"></i>Modifica componente "{componentId}" per il form "{formId}"</h6>
                    <span onClick={modificaForm} className='btn btn-primary' ><i className="fas fa-save mr-2"></i>Salva</span>

                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-5'>
                            <label>Label<strong className='text-danger'>*</strong></label>
                            <input type={"text"} onChange={aggiornaLabel} className={"form-control"} id={"label"} name={"label"} placeholder={"Inserisci una label"} value={label} />
                            <small className='text-danger'>{formErrors.label}</small>
                        </div>
                        <div className='col-5'>
                            <label>Tipo</label>

                            <select disabled className={"form-control"} id={"type"} onChange={aggiornaType} value={type}>
                                {Array.isArray(listaType) && listaType.map((val: string) =>
                                    <option value={val} >{val}</option>
                                )}
                            </select>
                            <small className='text-danger'>{formErrors.type}</small>
                        </div>

                        <div className='col-2'>
                            <label>Ordine<strong className='text-danger'>*</strong></label>
                            <input type={"number"} onChange={aggiornaOrdination} className={"form-control"} id={"ordination"} name={"ordination"} placeholder={"Inserisci un numero..."} value={ordination} />
                            <small className='text-danger'>{formErrors.ordination}</small>
                        </div>

                        <div className='col-2'>
                            <label>Width</label>
                            <select className={"form-control"} id={"width"} onChange={aggiornaWidth} value={width}>
                                {Array.isArray(listaColBootstrap) && listaColBootstrap.map((val: string) =>
                                    <option value={val} >{val}</option>
                                )}
                            </select>
                        </div>

                        <div className='col-2'>
                            <label>Width Sm</label>
                            <select className={"form-control"} id={"widthSm"} onChange={aggiornaWidthSm} value={widthSm}>
                                {Array.isArray(listaColBootstrap) && listaColBootstrap.map((val: string) =>
                                    <option value={val} >{val}</option>
                                )}
                            </select>
                        </div>

                        <div className='col-2'>
                            <label>Width Md</label>
                            <select className={"form-control"} id={"widthMd"} onChange={aggiornaWidthMd} value={widthMd}>
                                {Array.isArray(listaColBootstrap) && listaColBootstrap.map((val: string) =>
                                    <option value={val} >{val}</option>
                                )}
                            </select>
                        </div>

                        <div className='col-2'>
                            <label>Width Lg</label>
                            <select className={"form-control"} id={"widthLg"} onChange={aggiornaWidthLg} value={widthLg}>
                                {Array.isArray(listaColBootstrap) && listaColBootstrap.map((val: string) =>
                                    <option value={val} >{val}</option>
                                )}
                            </select>
                        </div>

                        <div className='col-2'>
                            <label>Width Xl</label>
                            <select className={"form-control"} id={"widthXl"} onChange={aggiornaWidthXl} value={widthXl}>
                                {Array.isArray(listaColBootstrap) && listaColBootstrap.map((val: string) =>
                                    <option value={val} >{val}</option>
                                )}
                            </select>
                        </div>

                        <div className='col-2'>
                            <label>Required Mark</label>
                            <select className={"form-control"} id={"requiredMark"} onChange={aggiornaRequiredMark} value={requiredMark}>
                                {Array.isArray(listaSiNo) && listaSiNo.map((val: string) =>
                                    <option value={val} >{val}</option>
                                )}
                            </select>
                        </div>

                        <div className='col-3'>
                            <label>Padding Bottom</label>
                            <select className={"form-control"} id={"paddingBottom"} onChange={aggiornaPaddingBottom} value={paddingBottom}>
                                {Array.isArray(listaPadding) && listaPadding.map((val: string) =>
                                    <option value={val} >{val}</option>
                                )}
                            </select>
                        </div>

                        <div className='col-3'>
                            <label>Padding Left</label>
                            <select className={"form-control"} id={"paddingLeft"} onChange={aggiornaPaddingLeft} value={paddingLeft}>
                                {Array.isArray(listaPadding) && listaPadding.map((val: string) =>
                                    <option value={val} >{val}</option>
                                )}
                            </select>
                        </div>

                        <div className='col-3'>
                            <label>Padding Right</label>
                            <select className={"form-control"} id={"paddingRight"} onChange={aggiornaPaddingRight} value={paddingRight}>
                                {Array.isArray(listaPadding) && listaPadding.map((val: string) =>
                                    <option value={val} >{val}</option>
                                )}
                            </select>
                        </div>

                        <div className='col-3'>
                            <label>Padding Top</label>
                            <select className={"form-control"} id={"paddingTop"} onChange={aggiornaPaddingTop} value={paddingTop}>
                                {Array.isArray(listaPadding) && listaPadding.map((val: string) =>
                                    <option value={val} >{val}</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            </div>


            {chiamataHttpSupportata && <GooseHttpRequestPanel type={"DATA"} />}

            {valuesSupportati && <GooseKeyValuePanel />}

            <GooseTooltipPanel />

            <GoosePopupPanel />

            {type != "" && <GooseComponentSpecificPanel type={type} /> }

        </Layout >
    );

}