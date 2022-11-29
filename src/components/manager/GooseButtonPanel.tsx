import React from 'react';
import { useDispatch} from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../../modules/feedback/actions';
import gooseButtonService from '../../services/GooseButtonService';
import { GooseButtonType } from '../../type/GooseButtonType';
import { InserisciButtonValidator } from '../../validators/InserisciButtonValidator';


export default function GooseButtonPanel(props: any) {

    let params = useParams();
    let dispatch = useDispatch();

    const [formErrors, setFormErrors] = React.useState(Object);


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

    const ricercaButton = async () => {
        await gooseButtonService.getButton(formId, type).then(response => {
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

    const salvaButton = async () => {

        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));


        let jsonBody: GooseButtonType = {
            formId: formId,
            type: type,
            title: title,
            icon: icon,
        };

        let errors = InserisciButtonValidator(title,icon);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            dispatch(fetchIsLoadingAction(true));

            if (pulsanteEsistente) {
                await gooseButtonService.modificaButton(formId, type, jsonBody).then(response => {
                    dispatch(fetchTestoSuccessAction("Salvataggio del pulsante " + type + " avvenuto con successo"));
                    ricercaButton();
                }).catch(e => {
                    console.error(e.response);
                    dispatch(fetchIsLoadingAction(false));
                    dispatch(fetchTestoDangerAction("Errore durante l'aggiornamento del pulsante " + type));
                });
            } else {
                await gooseButtonService.inserisciButton(jsonBody).then(response => {
                    dispatch(fetchTestoSuccessAction("Inserimento del pulsante " + type + " avvenuto con successo"));
                    ricercaButton();
                }).catch(e => {
                    console.error(e.response);
                    dispatch(fetchIsLoadingAction(false));
                    dispatch(fetchTestoDangerAction("Errore durante l'inserimento del pulsante " + type));
                });
            }
        }else{
            dispatch(fetchTestoWarnAction("Verifica le informazioni inserite!"));
        }


    }

    const ricercaIniziale = async () => {
        if (!ricercaEseguita) {
            setRicercaEseguita(true);
            await gooseButtonService.getButton(formId, type).then(response => {
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
                    <span onClick={salvaButton} className='btn btn-primary' ><i className="fas fa-save mr-2"></i>Salva</span>

                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-6'>
                            <label>Titolo<strong className='text-danger'>*</strong></label>
                            <input type={"text"} onChange={aggiornaTitle} className={"form-control"} id={"title"} name={"title"} placeholder={"Inserisci il titolo"} value={title} />
                            <small className='text-danger'>{formErrors.title}</small>
                        </div>
                        <div className='col-6'>
                            <label>Icona<strong className='text-danger'>*</strong> <i className={icon}></i></label>
                            <input type={"text"} onChange={aggiornaIcon} className={"form-control"} id={"icon"} name={"icon"} placeholder={"fa-solid fa-feather"} value={icon} />
                            <small className='text-danger'>{formErrors.icon}</small>
                            <small className='text-muted'> Trascrivi il nome da FontAwesome</small>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );

}