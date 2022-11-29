import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../../modules/feedback/actions';
import goosePopupService from '../../services/GoosePopupService';
import { GoosePopupType } from '../../type/GoosePopupType';
import { InserisciPopupValidator } from '../../validators/InserisciPopupValidator';


export default function GoosePopupPanel() {

    let params = useParams();
    let dispatch = useDispatch();

    const [formErrors, setFormErrors] = React.useState(Object);

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

        let errors = InserisciPopupValidator(title, icon, description, textTooltip);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {

            dispatch(fetchIsLoadingAction(true));
            let jsonBody: GoosePopupType = {
                formId: formId,
                title: title,
                icon: icon,
                description: description,
                componentId: componentId != "" ? componentId : undefined,
                textTooltip: textTooltip
            };


            if (popupEsistente) {
                await goosePopupService.modificaPopup(popupTrovato?.pk != undefined ? popupTrovato.pk : -1, jsonBody).then(response => {
                    dispatch(fetchTestoSuccessAction("Popup modificato con successo"));
                    ricerca();
                }).catch(e => {
                    console.error(e.response);
                    dispatch(fetchIsLoadingAction(false));
                    dispatch(fetchTestoDangerAction("Errore durante l'aggiornamento del popup"));
                });
            } else {
                await goosePopupService.inserisciPopup(jsonBody).then(response => {
                    dispatch(fetchTestoSuccessAction("Popup inserito con successo"));
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

    const ricercaComponentPopup = async () => {
        await goosePopupService.getPopupById(formId, componentId).then(response => {
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
            dispatch(fetchTestoSuccessAction("Popup eliminato con successo"));
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
                            <small className='text-danger'>{formErrors.title}</small>
                        </div>
                        <div className='col-4'>
                            <label>Icona <i className={icon}></i></label>
                            <input type={"text"} onChange={aggiornaIcon} className={"form-control"} id={"icon"} name={"icon"} placeholder={"fa-solid fa-feather"} value={icon} />
                            <small className='text-danger'>{formErrors.icon}</small>
                            <small className='text-muted'> Trascrivi il nome da FontAwesome</small>
                        </div>
                        <div className='col-4'>
                            <label>Tooltip</label>
                            <input type={"text"} onChange={aggiornaTextTooltip} className={"form-control"} id={"textTooltip"} name={"textTooltip"} placeholder={"Inserisci un tooltip"} value={textTooltip} />
                            <small className='text-danger'>{formErrors.textTooltip}</small>
                        </div>
                        <div className='col-12'>
                            <label>Descrizione</label>
                            <textarea onChange={aggiornaDescription} className={"form-control"} id={"description"} name={"description"} placeholder={"Inserisci una descrizione"} value={description} />
                            <small className='text-danger'>{formErrors.description}</small>
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