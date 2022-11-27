import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../../modules/feedback/actions';
import gooseButtonService from '../../services/GooseButtonService';
import gooseHttpService from '../../services/GooseHttpService';
import goosePopupService from '../../services/GoosePopupService';
import { GooseButtonType } from '../../type/GooseButtonType';
import { GooseFormType } from '../../type/GooseFormType';
import { GooseHttpRequestKv } from '../../type/GooseHttpRequestKv';
import { GooseHttpRequestType } from '../../type/GooseHttpRequestType';
import { GooseKeyValue } from '../../type/GooseKeyValue';
import { GoosePopupType } from '../../type/GoosePopupType';


export default function GooseHttpRequestPanel(props: any) {

    let params = useParams();
    let dispatch = useDispatch();

    const [chiamataEsistente, setChiamataEsistente] = React.useState(false);

    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);

    const [chiamataTrovata, setChiamataTrovata] = React.useState<GooseHttpRequestType>();
    const [listaHeaders, setListaHeaders] = React.useState([]);

    const [pk, setPk] = React.useState<number>();


    const [type, setType] = React.useState(props.type);
    const [formId, setFormId] = React.useState(params.formId != undefined ? params.formId : "");
    const [componentId, setComponentId] = React.useState(params.componentId != undefined ? params.componentId : "");

    const [url, setUrl] = React.useState<string>("");

    const aggiornaUrl = (event: any) => {
        setUrl(event.target.value);
    };

    const [method, setMethod] = React.useState<string>("");

    const aggiornaMethod = (event: any) => {
        setMethod(event.target.value);
    };

    const [body, setBody] = React.useState<string>("");

    const aggiornaBody = (event: any) => {
        setBody(event.target.value);
    };

    const [chiave, setChiave] = React.useState<string>("");

    const aggiornaChiave = (event: any) => {
        setChiave(event.target.value);
    };

    const [valore, setValore] = React.useState<string>("");

    const aggiornaValore = (event: any) => {
        setValore(event.target.value);
    };



    const ricerca = async () => {
        if (componentId != "") {
            ricercaComponentChiamata();
        } else {
            ricercaFormChiamata();
        }
    }

    const salva = async () => {
        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));


        dispatch(fetchIsLoadingAction(true));
        let jsonBody: GooseHttpRequestType = {
            formId: formId,
            componentId: componentId != "" ? componentId : undefined,
            url: url,
            method: method,
            body: body,
            typeSpecific: type
        };

        console.warn(jsonBody);

        console.error(chiamataTrovata?.pk);

        if (chiamataEsistente) {
            await gooseHttpService.modificaChiamata(chiamataTrovata?.pk != undefined ? chiamataTrovata.pk : -1, jsonBody).then(response => {
                dispatch(fetchTestoSuccessAction("Salvataggio dell'endpoin " + type + " avvenuto con successo"));
                ricerca();
            }).catch(e => {
                console.error(e.response);
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoDangerAction("Errore durante l'aggiornamento dell'endpoint " + type));
            });
        } else {
            await gooseHttpService.inserisciChiamata(jsonBody).then(response => {
                dispatch(fetchTestoSuccessAction("Inserimento dell'endpoint " + type + " avvenuto con successo"));
                ricerca();
            }).catch(e => {
                console.error(e.response);
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoDangerAction("Errore durante l'inserimento dell'endpoint " + type));
            });
        }



    }

    const ricercaComponentChiamata = async () => {
        await gooseHttpService.getChiamataById(params.formId != undefined ? params.formId : "", params.componentId != undefined ? params.componentId : "").then(response => {
            console.warn(response.data);
            let formTrovato: GooseHttpRequestType = response.data;
            setUrl(formTrovato.url);
            setMethod(formTrovato.method);
            setBody(formTrovato.body);
            setChiamataTrovata(formTrovato);
            setPk(formTrovato.pk);
            setChiamataEsistente(formTrovato.pk != undefined);
            if (formTrovato.pk != undefined) {
                ricercaHeaders(formTrovato.pk)
            }
            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    const ricercaFormChiamata = async () => {
        await gooseHttpService.getChiamataByFormId(params.formId != undefined ? params.formId : "", type).then(response => {
            console.warn(response.data);
            let formTrovato: GooseHttpRequestType = response.data;
            setUrl(formTrovato.url);
            setMethod(formTrovato.method);
            setBody(formTrovato.body);
            setChiamataTrovata(formTrovato);
            setPk(formTrovato.pk);
            setChiamataEsistente(formTrovato.pk != undefined);
            if (formTrovato.pk != undefined) {
                ricercaHeaders(formTrovato.pk)
            }
            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    const ricercaHeaders = async (pk: number) => {
        dispatch(fetchIsLoadingAction(true));
        await gooseHttpService.getHeaders(pk).then(response => {
            console.warn(response.data);
            setListaHeaders(response.data);
            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    const ricercaIniziale = async () => {
        if (!ricercaEseguita) {
            setRicercaEseguita(true);
            if (params.componentId != undefined) {
                console.warn("RICERCA HTTP - COMPONENTID")
                ricercaComponentChiamata();
            } else {
                console.warn("RICERCA HTTP - FORMID")
                ricercaFormChiamata();
            }

        }
    }

    ricercaIniziale();

    const listaMethod: any = [
        {
            key: "",
            value: "Scegli..."
        }, {
            key: "GET",
            value: "GET"
        },
        {
            key: "POST",
            value: "POST"
        },
        {
            key: "PUT",
            value: "PUT"
        },
        {
            key: "DELETE",
            value: "DELETE"
        },
        {
            key: "PATCH",
            value: "PATCH"
        }
    ];

    const salvaHeader = async () => {
        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));


        dispatch(fetchIsLoadingAction(true));
        let jsonBody: GooseHttpRequestKv = {
            k: chiave,
            v: valore,
            pkHttp: chiamataTrovata?.pk != undefined ? chiamataTrovata.pk : -1
        };

        console.warn(jsonBody);



        await gooseHttpService.inserisciHeader(jsonBody).then(response => {
            dispatch(fetchTestoSuccessAction("Inserimento header avvenuto con successo"));
            ricerca();
        }).catch(e => {
            console.error(e.response);
            dispatch(fetchIsLoadingAction(false));
            dispatch(fetchTestoDangerAction("Errore durante l'inserimento dell'header "));
        });
    }

    const eliminaHeader = async (header: GooseHttpRequestKv) => {
        await gooseHttpService.eliminaHeader(header.pkHttp, header.k).then(response => {
            dispatch(fetchTestoSuccessAction("Header cancellato con successo"));
            ricercaHeaders(header.pkHttp);
        }).catch(e => {
            console.error(e.response);
            dispatch(fetchIsLoadingAction(false));
            dispatch(fetchTestoDangerAction("Errore durante la cancellazione dell'header"));
        });
    }

    const eliminaChiamata = async () => {
        dispatch(fetchIsLoadingAction(true));
        let pkTmp = pk!=undefined?pk:-1;
        await gooseHttpService.eliminaChiamata(pkTmp).then(response => {
            ricerca();
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    return (
        <>
            <div className="card shadow mb-4">
                <div
                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-edit mr-2"></i>{chiamataEsistente ? "Modifica" : "Inserisci"} endpoint {type}</h6>
                    <div>
                        {chiamataEsistente && <span className='btn btn-outline-primary mr-1' data-toggle="modal" data-target={"#deleteChiamata"+type} ><i className="fas fa-trash mr-2"></i>Elimina</span>}
                        <span onClick={salva} className='btn btn-primary' ><i className="fas fa-save mr-2"></i>Salva</span>
                    </div>
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-8'>
                            <label>Url<strong className='text-danger'>*</strong></label>
                            <input type={"text"} onChange={aggiornaUrl} className={"form-control"} id={"url"} name={"url"} placeholder={"Inserisci un url"} value={url} />
                        </div>
                        <div className='col-4'>
                            <label>Icona</label>

                            <select className={"form-control"} id={"method"} onChange={aggiornaMethod} value={method}>
                                {Array.isArray(listaMethod) && listaMethod.map((val: GooseKeyValue) =>
                                    <option value={val.key} >{val.value}</option>
                                )}
                            </select>
                        </div>
                        <div className='col-12'>
                            <label>Body</label>
                            <textarea onChange={aggiornaBody} className={"form-control"} id={"body"} name={"body"} placeholder={"Inserisci un body"} value={body} />
                        </div>


                    </div>
                    {chiamataEsistente &&
                        <div className='row pt-3'>
                            <div className='col-12'>
                                <label>Headers</label>
                                <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">Chiave</th>
                                            <th scope="col">Valore</th>
                                            <th scope="col"></th>
                                        </tr>
                                        <tr>
                                            <th scope="col">
                                                <input type={"text"} onChange={aggiornaChiave} className={"form-control"} id={"chiave"} name={"chiave"} placeholder={"Chiave..."} value={chiave} />
                                            </th>
                                            <th scope="col">
                                                <input type={"text"} onChange={aggiornaValore} className={"form-control"} id={"valore"} name={"valore"} placeholder={"Valore..."} value={valore} />
                                            </th>
                                            <th scope="col " className='text-center'>
                                                <span onClick={salvaHeader} className='btn btn-primary' ><i className="fas fa-save"></i></span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(listaHeaders) && listaHeaders.map((header: GooseHttpRequestKv) =>
                                            <tr>
                                                <th scope="row">{header.k}</th>
                                                <td>{header.v}</td>
                                                <td className='text-center'>
                                                    <span onClick={() => eliminaHeader(header)} className='btn btn-primary' ><i className="fas fa-trash "></i></span>
                                                </td>
                                            </tr>
                                        )}


                                    </tbody>
                                </table>
                            </div>


                        </div>
                    }
                </div>
            </div>


            <div className="modal fade" id={"deleteChiamata"+type} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attenzione!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Sei sicuro di voler eliminare l'endpoint? <br /><strong>L'operazione è irreversibile!</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Annulla</button>
                            <button data-dismiss="modal" onClick={() => eliminaChiamata()} type="button" className="btn btn-primary">Elimina endpoint</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}


