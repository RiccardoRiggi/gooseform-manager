import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../../modules/feedback/actions';
import gooseButtonService from '../../services/GooseButtonService';
import { GooseButtonType } from '../../type/GooseButtonType';


export default function GooseButtonPanel(props: any) {

    let params = useParams();
    let dispatch = useDispatch();

    const [pulsanteEsistente, setPulsanteEsistente] = React.useState(false);

    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);


    const [type, setType] = React.useState(props.type);
    const [formId, setFormId] = React.useState(params.formId != undefined ? params.formId : "");

    const [title, setTitle] = React.useState<string>("");

    const aggiornaTitle = (event: any) => {
        setTitle(event.target.value);
    };

    const [icon, setIcon] = React.useState<string>("");

    const aggiornaIcon = (event: any) => {
        setIcon(event.target.value);
    };

    const ricerca = async () => {
        await gooseButtonService.getButton(formId, type).then(response => {
            console.warn(response.data);
            let formTrovato: GooseButtonType = response.data;
            setTitle(formTrovato.title);
            setIcon(formTrovato.icon);
            setPulsanteEsistente(response.data.formId != undefined);

            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    const salva = async () => {
        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));

        dispatch(fetchIsLoadingAction(true));

        dispatch(fetchIsLoadingAction(true));
        let jsonBody: GooseButtonType = {
            formId: formId,
            type: type,
            title: title,
            icon: icon,
        };

        console.warn(jsonBody);

        if (pulsanteEsistente) {
            await gooseButtonService.modificaButton(formId,type,jsonBody).then(response => {
                dispatch(fetchTestoSuccessAction("Salvataggio del pulsante "+type+" avvenuto con successo"));
                ricerca();
            }).catch(e => {
                console.error(e.response);
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoDangerAction("Errore durante l'aggiornamento del pulsante "+type));
            });
        } else {
            await gooseButtonService.inserisciButton(jsonBody).then(response => {
                dispatch(fetchTestoSuccessAction("Inserimento del pulsante "+type+" avvenuto con successo"));
                ricerca();
            }).catch(e => {
                console.error(e.response);
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoDangerAction("Errore durante l'inserimento del pulsante "+type));
            });
        }
        


    }

    const ricercaIniziale = async () => {
        if (!ricercaEseguita) {
            setRicercaEseguita(true);
            await gooseButtonService.getButton(formId, type).then(response => {
                console.warn(response.data);
                let formTrovato: GooseButtonType = response.data;
                setTitle(formTrovato.title);
                setIcon(formTrovato.icon);
                setPulsanteEsistente(response.data.formId != undefined);

                dispatch(fetchIsLoadingAction(false));
            }).catch(e => {
                console.error(e);
                dispatch(fetchIsLoadingAction(false));
            });
        }
    }

    ricercaIniziale();

    return (
        <>
            <div className="card shadow mb-4">
                <div
                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-edit mr-2"></i>{pulsanteEsistente ? "Modifica" : "Inserisci"} pulsante {type}</h6>
                    <span onClick={salva} className='btn btn-primary' ><i className="fas fa-save mr-2"></i>Salva</span>

                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-6'>
                            <label>Titolo<strong className='text-danger'>*</strong></label>
                            <input type={"text"} onChange={aggiornaTitle} className={"form-control"} id={"title"} name={"title"} placeholder={"Inserisci il titolo"} value={title} />
                        </div>
                        <div className='col-6'>
                            <label>Icona <i className={icon}></i></label>
                            <input type={"text"} onChange={aggiornaIcon} className={"form-control"} id={"icon"} name={"icon"} placeholder={"fa-solid fa-feather"} value={icon} />
                            <small className='text-muted'>Trascrivi il nome da FontAwesome</small>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );

}