import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../../modules/feedback/actions';
import gooseButtonService from '../../services/GooseButtonService';
import goosePopupService from '../../services/GoosePopupService';
import { GooseButtonType } from '../../type/GooseButtonType';
import { GooseFormType } from '../../type/GooseFormType';
import { GoosePopupType } from '../../type/GoosePopupType';


export default function GoosePopupPanel() {

    let params = useParams();
    let dispatch = useDispatch();

    const [popupEsistente, setPopupEsistente] = React.useState(false);

    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);

    const [popupTrovato, setPopupTrovato] = React.useState<GoosePopupType>();


    const [formId, setFormId] = React.useState(params.formId != undefined ? params.formId : "");
    const [componentId, setComponentId] = React.useState(params.componentId != undefined ? params.componentId : "");

    const [icon, setIcon] = React.useState<string>("");

    const aggiornaIcon = (event: any) => {
        setIcon(event.target.value);
    };

    const [textTooltip, setTextTooltip] = React.useState<string>("");

    const aggiornaTextTooltip = (event: any) => {
        setTextTooltip(event.target.value);
    };

    const [title, setTitle] = React.useState<string>("");

    const aggiornaTitle = (event: any) => {
        setTitle(event.target.value);
    };

    const [description, setDescription] = React.useState<string>("");

    const aggiornaDescription = (event: any) => {
        setDescription(event.target.value);
    };

    const ricerca = async () => {
        if (componentId != "") {
            ricercaComponentPopup();
        } else {
            ricercaFormPopup();
        }
    }

    const salva = async () => {
        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));


        dispatch(fetchIsLoadingAction(true));
        let jsonBody: GoosePopupType = {
            formId: formId,
            title: title,
            icon: icon,
            description: description,
            componentId: componentId != "" ? componentId : undefined,
            textTooltip: textTooltip
        };

        console.warn(jsonBody);

        if (popupEsistente) {
            await goosePopupService.modificaPopup(popupTrovato?.pk != undefined ? popupTrovato.pk : -1, jsonBody).then(response => {
                dispatch(fetchTestoSuccessAction("Salvataggio del popup avvenuto con successo"));
                ricerca();
            }).catch(e => {
                console.error(e.response);
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoDangerAction("Errore durante l'aggiornamento del popup"));
            });
        } else {
            await goosePopupService.inserisciPopup(jsonBody).then(response => {
                dispatch(fetchTestoSuccessAction("Inserimento del popup avvenuto con successo"));
                ricerca();
            }).catch(e => {
                console.error(e.response);
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoDangerAction("Errore durante l'inserimento del popup"));
            });
        }



    }

    const ricercaComponentPopup = async () => {
        await goosePopupService.getPopupById(formId, componentId).then(response => {
            console.warn(response.data);
            let formTrovato: GoosePopupType = response.data;
            setTitle(formTrovato.title);
            setIcon(formTrovato.icon);
            setTextTooltip(formTrovato.textTooltip);
            setDescription(formTrovato.description);
            setPopupTrovato(formTrovato)
            setPopupEsistente(formTrovato.pk != undefined);

            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    const ricercaFormPopup = async () => {
        await goosePopupService.getPopupByFormId(formId).then(response => {
            console.warn(response.data);
            let formTrovato: GoosePopupType = response.data;
            setTitle(formTrovato.title);
            setIcon(formTrovato.icon);
            setTextTooltip(formTrovato.textTooltip);
            setDescription(formTrovato.description);
            setPopupTrovato(formTrovato)
            setPopupEsistente(formTrovato.pk != undefined);

            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    const ricercaIniziale = async () => {
        if (!ricercaEseguita) {
            setRicercaEseguita(true);
            if (componentId != "") {
                ricercaComponentPopup();
            } else {
                ricercaFormPopup();
            }

        }
    }

    const eliminaPopup = async () => {
        dispatch(fetchIsLoadingAction(true));
        await goosePopupService.eliminaPopup(popupTrovato?.pk != undefined ? popupTrovato.pk : -1).then(response => {
            ricerca();
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    ricercaIniziale();

    return (
        <>
            <div className="card shadow mb-4">
                <div
                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-edit mr-2"></i>{popupEsistente ? "Modifica" : "Inserisci"} popup</h6>
                    <div>
                        {popupEsistente && <span className='btn btn-outline-primary mr-1' data-toggle="modal" data-target="#deletePopup" ><i className="fas fa-trash mr-2"></i>Elimina</span>}
                        <span onClick={salva} className='btn btn-primary ml-1' ><i className="fas fa-save mr-2"></i>Salva</span>
                    </div>
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <label>Titolo<strong className='text-danger'>*</strong></label>
                            <input type={"text"} onChange={aggiornaTitle} className={"form-control"} id={"title"} name={"title"} placeholder={"Inserisci il titolo"} value={title} />
                        </div>
                        <div className='col-4'>
                            <label>Icona</label>
                            <input type={"text"} onChange={aggiornaIcon} className={"form-control"} id={"icon"} name={"icon"} placeholder={"fa-solid fa-feather"} value={icon} />
                            <small className='text-muted'>Trascrivi il nome da FontAwesome</small>
                        </div>
                        <div className='col-4'>
                            <label>Tooltip</label>
                            <input type={"text"} onChange={aggiornaTextTooltip} className={"form-control"} id={"textTooltip"} name={"textTooltip"} placeholder={"Inserisci un tooltip"} value={textTooltip} />
                        </div>
                        <div className='col-12'>
                            <label>Descrizione</label>
                            <textarea onChange={aggiornaDescription} className={"form-control"} id={"description"} name={"description"} placeholder={"Inserisci una descrizione"} value={description} />
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal fade" id="deletePopup" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attenzione!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Sei sicuro di voler eliminare il popup? <br /><strong>L'operazione è irreversibile!</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Annulla</button>
                            <button data-dismiss="modal" onClick={() => eliminaPopup()} type="button" className="btn btn-primary">Elimina popup</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}