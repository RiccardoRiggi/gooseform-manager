import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../modules/feedback/actions';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gooseComponentService from '../services/GooseComponentService';
import { InserimentoControlloValidator } from '../validators/InserimentoControlloValidator';
import gooseValidationService from '../services/GooseValidationService';
import { GooseControlType } from '../type/GooseControlType';
import gooseControlService from '../services/GooseControlService';


export default function InserisciControlPage() {

    let params = useParams();

    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);


    const [formId, setFormId] = React.useState<string>(params.formId != undefined ? params.formId : "");

    const [listaComponent, setListaComponent] = React.useState<any>([]);

    let dispatch = useDispatch();
    let navigate = useNavigate();

    const [formErrors, setFormErrors] = React.useState(Object);

    const [placeHolderSuggerimento, setPlaceHolderSuggerimento] = React.useState<string>("Inserisci un valore...");

    const ricercaSuggerimentoPlaceholder = async (type: string) => {
        await gooseValidationService.getSuggerimentoPlaceholder(type).then(response => {
            console.warn(response.data);
            if (response.data.value != undefined) {
                setPlaceHolderSuggerimento(response.data.value);
            } else {
                setPlaceHolderSuggerimento("Inserisci un valore...");
            }
            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e.response);
            dispatch(fetchTestoDangerAction("Errore durante la ricerca del suggerimento di compilazione"));
            dispatch(fetchTestoWarnAction(""));
            dispatch(fetchTestoSuccessAction(""));
            setPlaceHolderSuggerimento("Inserisci un valore...");
            dispatch(fetchIsLoadingAction(false));
        });


    }

    const [idComponentA, setIdComponentA] = React.useState<string>("");

    const aggiornaIdComponentA = (event: any) => {
        setIdComponentA(event.target.value);
        for (let c = 0; c < listaComponent.length; c++) {
            console.warn(listaComponent[c]);
            if (listaComponent[c].id == event.target.value) {
                ricercaSuggerimentoPlaceholder(listaComponent[c].type);
                break;
            }
        }
    };

    const [idComponentB, setIdComponentB] = React.useState<string>("");

    const aggiornaIdComponentB = (event: any) => {
        setIdComponentB(event.target.value);
    };

    const [referenceValue, setReferenceValue] = React.useState<string>("");

    const aggiornaReferenceValue = (event: any) => {
        setReferenceValue(event.target.value);
    };

    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const aggiornaErrorMessage = (event: any) => {
        setErrorMessage(event.target.value);
    };

    const listaType = [
        "Scegli...",
        "STANDARD",
        "COMPLEX"
    ]

    const [type, setType] = React.useState<string>("");

    const aggiornaType = (event: any) => {
        setType(event.target.value);
        ricercaControlliSpecifici(event.target.value);
    };

    const [listaTypeSpecific, setListaTypeSpecific] = React.useState([]);


    const [typeSpecific, setTypeSpecific] = React.useState<string>("");

    const aggiornaTypeSpecific = (event: any) => {
        setTypeSpecific(event.target.value);
    };




    const inserisciForm = async () => {
        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));

        let errors = InserimentoControlloValidator(formId, type, typeSpecific, idComponentA, idComponentB, referenceValue, errorMessage);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {

            dispatch(fetchIsLoadingAction(false));

            let jsonBody: GooseControlType = {
                formId: formId,
                type: type,
                typeSpecific: typeSpecific,
                idComponentA: idComponentA,
                idComponentB: idComponentB != "" ? idComponentB : undefined,
                referenceValue: referenceValue,
                errorMessage: errorMessage
            };

            await gooseControlService.inserisciControl(jsonBody).then(response => {
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoSuccessAction("Controllo inserito con successo"));
                navigate("/scheda-form/" + formId);
            }).catch(e => {
                dispatch(fetchIsLoadingAction(false));
                console.error(e.response);
                dispatch(fetchTestoDangerAction("Errore durante l'inserimento del controllo"));
            });
        } else {
            dispatch(fetchTestoWarnAction("Verifica le informazioni inserite"))
        }


    }

    const ricercaControlliSpecifici = async (type: string) => {
        if (params.formId != undefined) {
            let formId = params.formId != undefined ? params.formId : "";

            await gooseValidationService.getListaControlli(type).then(response => {
                console.warn(response.data);
                setListaTypeSpecific(response.data);
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoDangerAction(""));
                dispatch(fetchTestoWarnAction(""));
                dispatch(fetchTestoSuccessAction(""));
            }).catch(e => {
                console.error(e.response);
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoDangerAction("Errore durante il recupero dei controlli specifici"));
                dispatch(fetchTestoWarnAction(""));
                dispatch(fetchTestoSuccessAction(""));
            });
        } else {
            dispatch(fetchIsLoadingAction(false));
            navigate("/scheda-form/" + formId);
        }

    }

    const ricercaComponenti = async () => {
        if (params.formId != undefined) {
            let formId = params.formId != undefined ? params.formId : "";

            await gooseComponentService.getListaComponent(formId).then(response => {
                console.warn(response.data);

                setListaComponent(response.data);

                dispatch(fetchIsLoadingAction(false));
            }).catch(e => {
                console.error(e);
                dispatch(fetchIsLoadingAction(false));
            });
        } else {
            dispatch(fetchIsLoadingAction(false));
            navigate("/scheda-form/" + formId);
        }

    }

    useEffect(() => {
        if (!ricercaEseguita) {
            dispatch(fetchIsLoadingAction(true));
            setRicercaEseguita(true);
            ricercaComponenti();
        }
    });

    return (
        <Layout>
            <Link className='btn btn-primary mb-2' to={"/scheda-form/" + formId}>Indietro</Link>

            <div className="card shadow mb-4">

                <div
                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-plus mr-2"></i>Inserisci controllo per il form "{formId}"</h6>
                    <span onClick={inserisciForm} className='btn btn-primary' ><i className="fas fa-save mr-2"></i>Salva</span>

                </div>
                <div className="card-body">
                    <div className='row'>


                        <div className='col-3'>
                            <label>Tipo</label>
                            <select className={"form-control"} id={"type"} onChange={aggiornaType} value={type}>
                                {Array.isArray(listaType) && listaType.map((val: string) =>
                                    <option value={val} >{val}</option>
                                )}
                            </select>
                            <small className='text-danger'>{formErrors.type}</small>
                        </div>

                        <div className='col-9'>
                            <label>Tipo specifico</label>
                            <select className={"form-control"} id={"type"} onChange={aggiornaTypeSpecific} value={typeSpecific}>
                                <option value={""}>Scegli...</option>
                                {Array.isArray(listaTypeSpecific) && listaTypeSpecific.map((val: any) =>
                                    <option value={val.k} >{val.k} - {val.description}</option>
                                )}
                            </select>
                            <small className='text-danger'>{formErrors.type}</small>
                        </div>

                        <div className='col-6'>
                            <label>Campo A</label>
                            <select className={"form-control"} id={"idComponentA"} onChange={aggiornaIdComponentA} value={idComponentA}>
                                <option value={""}>Scegli...</option>
                                {Array.isArray(listaComponent) && listaComponent.map((val: any) =>
                                    <option value={val.id} >{val.id} - {val.label}</option>
                                )}
                            </select>
                            <small className='text-danger'>{formErrors.type}</small>
                        </div>

                        <div className={type != "COMPLEX" ? "d-none col-6" : "col-6"}>
                            <label>Campo B</label>
                            <select className={"form-control"} id={"idComponentB"} onChange={aggiornaIdComponentB} value={idComponentB}>
                                <option value={""}>Scegli...</option>
                                {Array.isArray(listaComponent) && listaComponent.map((val: any) =>
                                    <option value={val.id} >{val.id} - {val.label}</option>
                                )}
                            </select>
                            <small className='text-danger'>{formErrors.type}</small>
                        </div>

                        <div className={type != "STANDARD" || typeSpecific == "IN" || typeSpecific == "NOT_IN" ? "d-none col-6" : "col-6"}>
                            <label>Valore di confronto</label>
                            <input type={"text"} onChange={aggiornaReferenceValue} className={"form-control"} id={"referenceValue"} name={"referenceValue"} placeholder={placeHolderSuggerimento} value={referenceValue} />
                            <small className='text-danger'>{formErrors.referenceValue}</small>
                        </div>


                        <div className='col-12'>
                            <label>Messaggio di errore<strong className='text-danger'>*</strong></label>
                            <input type={"text"} onChange={aggiornaErrorMessage} className={"form-control"} id={"errorMessage"} name={"errorMessage"} placeholder={"Inserisci un messaggio di errore"} value={errorMessage} />
                            <small className='text-danger'>{formErrors.errorMessage}</small>
                        </div>
                    </div>
                </div>
            </div>


        </Layout >
    );

}