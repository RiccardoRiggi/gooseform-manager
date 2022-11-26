import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../../modules/feedback/actions';
import gooseButtonService from '../../services/GooseButtonService';
import gooseComponentService from '../../services/GooseComponentService';
import gooseHttpService from '../../services/GooseHttpService';
import goosePopupService from '../../services/GoosePopupService';
import { GooseButtonType } from '../../type/GooseButtonType';
import { GooseFormType } from '../../type/GooseFormType';
import { GooseHttpRequestKv } from '../../type/GooseHttpRequestKv';
import { GooseHttpRequestType } from '../../type/GooseHttpRequestType';
import { GooseKeyValue } from '../../type/GooseKeyValue';
import { GooseKVComponent } from '../../type/GooseKVComponent';
import { GoosePopupType } from '../../type/GoosePopupType';


export default function GooseKeyValuePanel() {

    let params = useParams();
    let dispatch = useDispatch();

    const [chiamataEsistente, setChiamataEsistente] = React.useState(false);

    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);

    const [chiamataTrovata, setChiamataTrovata] = React.useState<GooseHttpRequestType>();
    const [listaHeaders, setListaHeaders] = React.useState([]);


    const [formId, setFormId] = React.useState(params.formId != undefined ? params.formId : "");
    const [componentId, setComponentId] = React.useState(params.componentId != undefined ? params.componentId : "");

    const [chiave, setChiave] = React.useState<string>("");

    const aggiornaChiave = (event: any) => {
        setChiave(event.target.value);
    };

    const [valore, setValore] = React.useState<string>("");

    const aggiornaValore = (event: any) => {
        setValore(event.target.value);
    };

    const ricercaHeaders = async () => {
        dispatch(fetchIsLoadingAction(true));
        await gooseComponentService.getListaComponentKv(params.formId != undefined ? params.formId : "", params.componentId != undefined ? params.componentId : "").then(response => {
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
            ricercaHeaders();
        }
    }

    ricercaIniziale();



    const salvaHeader = async () => {
        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));


        dispatch(fetchIsLoadingAction(true));
        let jsonBody: GooseKVComponent = {
            formId: formId,
            componentId: componentId,
            k: chiave,
            v: valore,
        };

        console.warn(jsonBody);



        await gooseComponentService.inserisciComponenteKv(jsonBody).then(response => {
            dispatch(fetchTestoSuccessAction("Inserimento header avvenuto con successo"));
            ricercaHeaders();
        }).catch(e => {
            console.error(e.response);
            dispatch(fetchIsLoadingAction(false));
            dispatch(fetchTestoDangerAction("Errore durante l'inserimento dell'header "));
        });
    }

    const eliminaHeader = async (oggetto: GooseKVComponent) => {
        await gooseComponentService.eliminaComponentKv(formId,componentId,oggetto.k).then(response => {
            dispatch(fetchTestoSuccessAction("Header cancellato con successo"));
            ricercaHeaders();
        }).catch(e => {
            console.error(e.response);
            dispatch(fetchIsLoadingAction(false));
            dispatch(fetchTestoDangerAction("Errore durante la cancellazione dell'header"));
        });
    }

    return (
        <>
            <div className="card shadow mb-4">
                <div
                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-list mr-2"></i>Lista valori</h6>

                </div>
                <div className="card-body">

                    <div className='row pt-3'>
                        <div className='col-12'>
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
                                    {Array.isArray(listaHeaders) && listaHeaders.map((header: GooseKVComponent) =>
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

                </div>
            </div>
        </>
    );

}


