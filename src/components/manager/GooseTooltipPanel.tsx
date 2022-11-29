import React from 'react';
import { useDispatch } from 'react-redux';
import {  useParams } from 'react-router-dom';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../../modules/feedback/actions';
import gooseTooltipService from '../../services/GooseTooltipService';
import { GooseTooltipType } from '../../type/GooseTooltipType';
import { InserisciTooltipValidator } from '../../validators/InserisciTooltipValidator';


export default function GooseTooltipPanel() {

    let params = useParams();
    let dispatch = useDispatch();

    const [formErrors, setFormErrors] = React.useState(Object);


    const [tooltipEsistente, setTooltipEsistente] = React.useState(false);

    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);

    const [tooltipTrovato, setTooltipTrovato] = React.useState<GooseTooltipType>();


    const [formId, setFormId] = React.useState(params.formId != undefined ? params.formId : "");
    const [componentId, setComponentId] = React.useState(params.componentId != undefined ? params.componentId : "");

    const [icon, setIcon] = React.useState<string>("");

    const aggiornaIcon = (event: any) => {
        setIcon(event.target.value);
    };

    const [tooltip, setTooltip] = React.useState<string>("");

    const aggiornaTooltip = (event: any) => {
        setTooltip(event.target.value);
    };

    const ricerca = async () => {
        if (params.componentId != undefined) {
            ricercaComponentTooltip();
        } else {
            ricercaFormTooltip();
        }
    }

    const salva = async () => {
        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));

        let errors = InserisciTooltipValidator(icon,tooltip);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {

            dispatch(fetchIsLoadingAction(true));
            let jsonBody: GooseTooltipType = {
                formId: formId,
                icon: icon,
                componentId: componentId != "" ? componentId : undefined,
                tooltip: tooltip
            };


            if (tooltipEsistente) {
                await gooseTooltipService.modificaTooltip(tooltipTrovato?.pk != undefined ? tooltipTrovato.pk : -1, jsonBody).then(response => {
                    dispatch(fetchTestoSuccessAction("Salvataggio del tooltip avvenuto con successo"));
                    ricerca();
                }).catch(e => {
                    console.error(e.response);
                    dispatch(fetchIsLoadingAction(false));
                    dispatch(fetchTestoDangerAction("Errore durante l'aggiornamento del popup"));
                });
            } else {
                await gooseTooltipService.inserisciTooltip(jsonBody).then(response => {
                    dispatch(fetchTestoSuccessAction("Tooltip inserito con successo"));
                    ricerca();
                }).catch(e => {
                    console.error(e.response);
                    dispatch(fetchIsLoadingAction(false));
                    dispatch(fetchTestoDangerAction("Errore durante l'inserimento del popup"));
                });
            }

        } else { 
            dispatch(fetchTestoWarnAction("Verifica le informazioni inserite!"));
        }

    }

    const ricercaComponentTooltip = async () => {
        await gooseTooltipService.getTooltipById(formId, componentId).then(response => {
            let formTrovato: GooseTooltipType = response.data;
            setIcon(formTrovato.icon);
            setTooltip(formTrovato.tooltip);
            setTooltipTrovato(formTrovato)
            setTooltipEsistente(formTrovato.pk != undefined);

            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    const ricercaFormTooltip = async () => {
        await gooseTooltipService.getTooltipByFormId(formId).then(response => {
            let formTrovato: GooseTooltipType = response.data;
            setIcon(formTrovato.icon);
            setTooltip(formTrovato.tooltip);
            setTooltipTrovato(formTrovato)
            setTooltipEsistente(formTrovato.pk != undefined);
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
                ricercaComponentTooltip();
            } else {
                ricercaFormTooltip();
            }

        }
    }

    const eliminaTooltip = async () => {
        dispatch(fetchIsLoadingAction(true));
        await gooseTooltipService.eliminaTooltip(tooltipTrovato?.pk != undefined ? tooltipTrovato.pk : -1).then(response => {
            dispatch(fetchTestoSuccessAction("Tooltip eliminato con successo"));
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
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-edit mr-2"></i>{tooltipEsistente ? "Modifica" : "Inserisci"} tooltip</h6>
                    <div>
                        {tooltipEsistente && <span className='btn btn-outline-primary mr-1' data-toggle="modal" data-target="#deleteTooltip" ><i className="fas fa-trash mr-2"></i>Elimina</span>}
                        <span onClick={salva} className='btn btn-primary' ><i className="fas fa-save mr-2"></i>Salva</span>
                    </div>
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-6'>
                            <label>Icona<i className={icon}></i></label>
                            <input type={"text"} onChange={aggiornaIcon} className={"form-control"} id={"icon"} name={"icon"} placeholder={"fa-solid fa-feather"} value={icon} />
                            <small className='text-danger'>{formErrors.icon}</small>
                            <small className='text-muted'> Trascrivi il nome da FontAwesome</small>
                        </div>
                        <div className='col-6'>
                            <label>Tooltip</label>
                            <input type={"text"} onChange={aggiornaTooltip} className={"form-control"} id={"tooltip"} name={"tooltip"} placeholder={"Inserisci un tooltip"} value={tooltip} />
                            <small className='text-danger'>{formErrors.tooltip}</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="deleteTooltip" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attenzione!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Sei sicuro di voler eliminare il tooltip? <br /><strong>L'operazione è irreversibile!</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Annulla</button>
                            <button data-dismiss="modal" onClick={() => eliminaTooltip()} type="button" className="btn btn-primary">Elimina tooltip</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}