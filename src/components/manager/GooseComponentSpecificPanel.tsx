import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../../modules/feedback/actions';
import gooseButtonService from '../../services/GooseButtonService';
import gooseComponentService from '../../services/GooseComponentService';
import gooseHttpService from '../../services/GooseHttpService';
import goosePopupService from '../../services/GoosePopupService';
import gooseValidationService from '../../services/GooseValidationService';
import { GooseButtonType } from '../../type/GooseButtonType';
import { GooseComponentSpecificType } from '../../type/GooseComponentSpecificType';
import { GooseFormType } from '../../type/GooseFormType';
import { GooseHttpRequestKv } from '../../type/GooseHttpRequestKv';
import { GooseHttpRequestType } from '../../type/GooseHttpRequestType';
import { GooseKeyValue } from '../../type/GooseKeyValue';
import { GooseKVComponent } from '../../type/GooseKVComponent';
import { GoosePopupType } from '../../type/GoosePopupType';


export default function GooseComponentSpecificPanel(props: any) {

    let params = useParams();
    let dispatch = useDispatch();


    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);

    const [attributoDuplicato, setAttributoDuplicato] = React.useState(false);


    const [listaAttributi, setListaAttributi] = React.useState<any[]>([]);

    const [listaPossibiliAttributiSpecifici, setListaPossibiliAttributiSpecifici] = React.useState<any[]>([]);

    const [chiaveSelezionata, setChiaveSelezionata] = React.useState<any>({});

    const [formId, setFormId] = React.useState(params.formId != undefined ? params.formId : "");
    const [componentId, setComponentId] = React.useState(params.componentId != undefined ? params.componentId : "");

    const [chiave, setChiave] = React.useState<string>("");

    const aggiornaChiave = (event: any) => {
        setAttributoDuplicato(false);
        setValore("");
        setChiave(event.target.value);
        for (let c = 0; c < listaAttributi.length; c++) {

            if (listaAttributi[c].nomeAttributo == event.target.value) {
                setAttributoDuplicato(true);
            }
        }

        for (let c = 0; c < listaPossibiliAttributiSpecifici.length; c++) {

            if (listaPossibiliAttributiSpecifici[c].k == event.target.value) {
                console.info(listaPossibiliAttributiSpecifici[c]);
                setChiaveSelezionata(listaPossibiliAttributiSpecifici[c]);
            }
        }

    };

    const [valore, setValore] = React.useState<string>("");

    const aggiornaValore = (event: any) => {
        setValore(event.target.value);
    };

    const ricercaHeaders = async () => {
        dispatch(fetchIsLoadingAction(true));
        await gooseComponentService.getListaComponentSpecific(params.formId != undefined ? params.formId : "", params.componentId != undefined ? params.componentId : "").then(response => {
            console.warn(response.data);
            setListaAttributi(response.data);
            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }





    const salvaHeader = async () => {
        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));


        dispatch(fetchIsLoadingAction(true));
        let jsonBody: GooseComponentSpecificType = {
            formId: formId,
            id: componentId,
            nomeAttributo: chiave,
            valoreAttributo: valore,
        };

        console.error(jsonBody);



        await gooseComponentService.inserisciComponenteSpecific(jsonBody).then(response => {
            dispatch(fetchTestoSuccessAction("Inserimento attributo aggiuntivo avvenuto con successo"));
            ricercaHeaders();
        }).catch(e => {
            console.error(e.response);
            dispatch(fetchIsLoadingAction(false));
            dispatch(fetchTestoDangerAction("Errore durante l'inserimento dell'attributo aggiuntivo"));
        });
    }

    const eliminaHeader = async (oggetto: GooseComponentSpecificType) => {
        await gooseComponentService.eliminaComponentSpecific(formId, componentId, oggetto.nomeAttributo).then(response => {
            dispatch(fetchTestoSuccessAction("Attributo aggiuntivo cancellato con successo"));
            ricercaHeaders();
        }).catch(e => {
            console.error(e.response);
            dispatch(fetchIsLoadingAction(false));
            dispatch(fetchTestoDangerAction("Errore durante la cancellazione dell'attributo aggiuntivo"));
        });
    }



    const recuperaListaPossibiliAttributiSpecifici = async (type: string) => {

        console.error("TYPE: " + type);

        await gooseValidationService.getListaComponentSpecific(type).then(response => {

            let listaTmp: any = [];
            let tmp = {
                type: type,
                k: "Scegli...",
                v: ""
            }
            listaTmp.push(tmp);

            for (let c = 0; c < response.data.length; c++) {
                console.warn(response.data[c]);
                if (response.data[c].k != "values" && response.data[c].k != "dynamicValues") {
                    listaTmp.push(response.data[c])
                }
            }
            setListaPossibiliAttributiSpecifici(listaTmp);
        }).catch(e => {
            console.error(e);
        });
    }

    const ricercaIniziale = async () => {
        if (!ricercaEseguita) {
            setRicercaEseguita(true);
            ricercaHeaders();
            recuperaListaPossibiliAttributiSpecifici(props.type);
        }
    }

    ricercaIniziale();

    return (
        <>
            <div className="card shadow mb-4">
                <div
                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-list mr-2"></i>Attributi aggiuntivi</h6>

                </div>
                <div className="card-body">

                    <div className='row pt-3'>
                        <div className='col-12'>
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">Nome attributo</th>
                                        <th scope="col">Valore</th>
                                        <th scope="col"></th>
                                    </tr>
                                    <tr>
                                        <th scope="col">
                                            <select className={attributoDuplicato ? "form-control is-invalid" : "form-control"} id={"chiave"} onChange={aggiornaChiave} value={chiave}>
                                                {Array.isArray(listaPossibiliAttributiSpecifici) && listaPossibiliAttributiSpecifici.map((val: any) =>
                                                    <option value={val.k} >{val.k}</option>
                                                )}
                                            </select>
                                            {attributoDuplicato && <small className='text-danger'>Attirbuto già inserito</small>
                                            }
                                        </th>
                                        <th scope="col">

                                            {chiaveSelezionata.v == "String" &&
                                                <input type={"text"} onChange={aggiornaValore} className={"form-control"} id={"valore"} name={"valore"} placeholder={"Inserisci un valore..."} value={valore} />
                                            }

                                            {chiaveSelezionata.v == "Number" && <input type={"number"} onChange={aggiornaValore} className={"form-control"} id={"valore"} name={"valore"} placeholder={"Inserisci un numero..."} value={valore} />
                                            }

                                            {chiaveSelezionata.v == "Boolean" &&
                                                <select className={"form-control"} id={"valore"} onChange={aggiornaValore} value={valore}>
                                                    <option value={"FALSE"} >{"FALSE"}</option>
                                                    <option value={"TRUE"} >{"TRUE"}</option>
                                                </select>}
                                        </th>
                                        <th scope="col " className={attributoDuplicato || valore == "" ? 'text-center d-none' : 'text-center'}>
                                            <span onClick={salvaHeader} className='btn btn-primary' ><i className="fas fa-save"></i></span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(listaAttributi) && listaAttributi.map((header: GooseComponentSpecificType) =>
                                        <tr>
                                            <th scope="row">{header.nomeAttributo}</th>
                                            <td>{header.valoreAttributo}</td>
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


