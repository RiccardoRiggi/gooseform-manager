import React from 'react';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../modules/feedback/actions';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gooseComponentService from '../services/GooseComponentService';
import { InserisciComponenteValidator } from '../validators/InserisciComponenteValidator';
import { GooseComponentType } from '../type/GooseComponentType';


export default function InserisciComponentePage() {

    let params = useParams();

    const [formId, setFormId] = React.useState<string>(params.formId != undefined ? params.formId : "");


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

    let dispatch = useDispatch();
    let navigate = useNavigate();

    const [formErrors, setFormErrors] = React.useState(Object);


    const [componentId, setComponentId] = React.useState<string>("");

    const aggiornaComponentId = (event: any) => {
        setComponentId(event.target.value);
        verificaEsistenzaComponentId(formId, event.target.value);
    };

    const [componentIdEsistente, setComponentIdEsistente] = React.useState<boolean>(false);

    const verificaEsistenzaComponentId = async (formId: string, componentId: string) => {
        await gooseComponentService.getComponent(formId, componentId).then(response => {
            setComponentIdEsistente(response.data.id != undefined);
        }).catch(e => {
            console.error(e.response);
            dispatch(fetchTestoDangerAction("Errore durante la verifica dell'esistenza di un altro componente con lo stesso identificativo"));
            dispatch(fetchTestoWarnAction(""));
            dispatch(fetchTestoSuccessAction(""));
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

    const [width, setWidth] = React.useState<string>("12");

    const aggiornaWidth = (event: any) => {
        setWidth(event.target.value);
    };

    const [widthSm, setWidthSm] = React.useState<string>("12");

    const aggiornaWidthSm = (event: any) => {
        setWidthSm(event.target.value);
    };

    const [widthMd, setWidthMd] = React.useState<string>("12");

    const aggiornaWidthMd = (event: any) => {
        setWidthMd(event.target.value);
    };

    const [widthLg, setWidthLg] = React.useState<string>("12");

    const aggiornaWidthLg = (event: any) => {
        setWidthLg(event.target.value);
    };

    const [widthXl, setWidthXl] = React.useState<string>("12");

    const aggiornaWidthXl = (event: any) => {
        setWidthXl(event.target.value);
    };

    const [requiredMark, setRequiredMark] = React.useState<string>("NO");

    const aggiornaRequiredMark = (event: any) => {
        setRequiredMark(event.target.value);
    };

    const [ordination, setOrdination] = React.useState<number>(1);

    const aggiornaOrdination = (event: any) => {
        setOrdination(event.target.value);
    };

    const inserisciForm = async () => {
        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));

        let errors = InserisciComponenteValidator(componentId, type, label, widthXl, widthLg, widthMd, widthSm, width, requiredMark);
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
                ordination: ordination
            };

            await gooseComponentService.inserisciComponente(jsonBody).then(response => {
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoSuccessAction("Componente inserito con successo"));
                navigate("/scheda-componente/" + formId + "/" + componentId);
            }).catch(e => {
                dispatch(fetchIsLoadingAction(false));
                console.error(e.response);
                dispatch(fetchTestoDangerAction("Errore durante l'inserimento del componente"));
            });
        } else {
            dispatch(fetchTestoWarnAction("Verifica le informazioni inserite"))
        }


    }

    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);


    const ricercaIniziale = async () => {
        if (!ricercaEseguita) {
            setRicercaEseguita(true);
            await gooseComponentService.getListaComponent(formId).then(response => {
                setOrdination(response.data.length + 1);
            }).catch(e => {
                console.error(e);
            });
        }
    }

    ricercaIniziale();

    return (
        <Layout>
            <Link className='btn btn-primary mb-2' to={"/scheda-form/" + formId}>Indietro</Link>

            <div className="card shadow mb-4">
                <div
                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-plus mr-2"></i>Inserisci componente per il form "{formId}"</h6>
                    <span onClick={inserisciForm} className='btn btn-primary' ><i className="fas fa-save mr-2"></i>Salva</span>

                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-3'>
                            <label>Identificativo<strong className='text-danger'>*</strong></label>
                            <input type={"text"} onChange={aggiornaComponentId} className={componentIdEsistente ? "form-control is-invalid" : "form-control"} id={"formId"} name={"formId"} placeholder={"Inserisci il componentId"} value={componentId} />
                            {componentIdEsistente && <small className='text-danger'>L'identificativo inserito non è disponibile</small>
                            }
                            <small className='text-danger'>{formErrors.componentId}</small>
                        </div>
                        <div className='col-3'>
                            <label>Label<strong className='text-danger'>*</strong></label>
                            <input type={"text"} onChange={aggiornaLabel} className={"form-control"} id={"label"} name={"label"} placeholder={"Inserisci una label"} value={label} />
                            <small className='text-danger'>{formErrors.label}</small>
                        </div>
                        <div className='col-4'>
                            <label>Tipo<strong className='text-danger'>*</strong></label>

                            <select className={"form-control"} id={"type"} onChange={aggiornaType} value={type}>
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

                    </div>
                </div>
            </div>


        </Layout >
    );

}