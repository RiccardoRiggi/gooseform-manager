import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import gooseFormService from '../services/GooseFormService';
import remarkGfm from 'remark-gfm'
import { useDispatch } from 'react-redux';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../modules/feedback/actions';
import { GooseFormType } from '../type/GooseFormType';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InserisciFormValidator } from '../validators/InserisciFormValidator';
import GooseButtonPanel from '../components/manager/GooseButtonPanel';
import GoosePopupPanel from '../components/manager/GoosePopupPanel';


export default function SchedaFormPage() {

    let dispatch = useDispatch();
    let navigate = useNavigate();
    let params = useParams();

    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);

    const [formErrors,setFormErrors] = React.useState(Object);

    const [formIdEsistente, setFormIdEsistente] = React.useState<boolean>(false);

    const [title, setTitle] = React.useState<string>("");

    const aggiornaTitle = (event: any) => {
        setTitle(event.target.value);
    };

    const [icon, setIcon] = React.useState<string>("");

    const aggiornaIcon = (event: any) => {
        setIcon(event.target.value);
    };

    const [description, setDescription] = React.useState<string>("");

    const aggiornaDescription = (event: any) => {
        setDescription(event.target.value);
    };

    const aggiornaForm = async () => {
        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));

        let errors = InserisciFormValidator(params.formId!=undefined?params.formId:"",title,icon,description);
        setFormErrors(errors);

        if(Object.keys(errors).length===0 && !formIdEsistente){
            dispatch(fetchIsLoadingAction(true));
            let jsonBody: GooseFormType = {
                title: title,
                icon: icon,
                description: description
            };

            await gooseFormService.modificaForm(params.formId!=undefined?params.formId:"",jsonBody).then(response => {
                setFormIdEsistente(response.data.formId != undefined);
                dispatch(fetchTestoSuccessAction("Salvataggio avvenuto con successo"));
                ricerca();

            }).catch(e => {
                console.error(e.response);
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoDangerAction("Errore durante l'aggiornamento del form"));
            });
        }else{
            dispatch(fetchTestoWarnAction("Verifica le informazioni inserite"))
        }

        
    }

    const ricerca = async () => {
        if(params.formId!=undefined){
            let formId = params.formId!=undefined?params.formId:"";
            await gooseFormService.getForm(formId).then(response => {
                console.warn(response.data);
                let formTrovato: GooseFormType = response.data;
                setTitle(formTrovato.title);
                setIcon(formTrovato.icon);
                setDescription(formTrovato.description);
                
                dispatch(fetchIsLoadingAction(false));
            }).catch(e => {
                console.error(e);
                dispatch(fetchIsLoadingAction(false));
            });
        }else{
            dispatch(fetchIsLoadingAction(false));
            navigate("/lista-forms");
        }
        
    }

    useEffect(() => {
        if (!ricercaEseguita) {
            dispatch(fetchIsLoadingAction(true));
            setRicercaEseguita(true);
            ricerca();
        }
    });

    return (
        <Layout>
            <div className="card shadow mb-4">
                <div
                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-edit mr-2"></i>Modifica form</h6>
                    <span onClick={aggiornaForm} className='btn btn-primary' ><i className="fas fa-save mr-2"></i>Salva</span>

                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-6'>
                            <label>Titolo<strong className='text-danger'>*</strong></label>
                            <input type={"text"} onChange={aggiornaTitle} className={"form-control"} id={"title"} name={"title"} placeholder={"Inserisci il titolo"} value={title} />
                            <small className='text-danger'>{formErrors.title}</small>
                        </div>
                        <div className='col-6'>
                            <label>Icona</label>
                            <input type={"text"} onChange={aggiornaIcon} className={"form-control"} id={"icon"} name={"icon"} placeholder={"fa-solid fa-feather"} value={icon} />
                            <small className='text-muted'>Trascrivi il nome da FontAwesome</small>
                            <small className='text-danger'>{formErrors.icon}</small>
                        </div>
                        <div className='col-12'>
                            <label>Descrizione</label>
                            <textarea onChange={aggiornaDescription} className={"form-control"} id={"description"} name={"description"} placeholder={"Inserisci la descrizione"} value={description} />
                            <small className='text-danger'>{formErrors.description}</small>
                        </div>
                    </div>
                </div>
            </div>

            <GooseButtonPanel type={"RESET"} />
            
            <GooseButtonPanel type={"SEND"} />

            <GoosePopupPanel />

        </Layout >
    );

}