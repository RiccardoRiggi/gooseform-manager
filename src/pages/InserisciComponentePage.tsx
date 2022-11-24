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
import gooseComponentService from '../services/GooseComponentService';


export default function InserisciComponentePage() {

    let params = useParams();

    const [formId, setFormId] = React.useState<string>(params.formId!=undefined?params.formId:"");


    const listaType = [
        "GOOSE_TEXT_AREA",
        "GOOSE_SELECT",
        "GOOSE_LINKED_SELECT",
        "GOOSE_DATA_LIST",
        "GOOSE_TEXT_FIELD",
        "GOOSE_PASSWORD_FIELD",
        "GOOSE_NUMBER_FIELD",
        "GOOSE_RADIO",
        "GOOSE_CHECKBOX",
        "GOOSE_EMAIL_FIELD",
        "GOOSE_DATE_FIELD",
        "GOOSE_DATE_TIME_FIELD",
        "GOOSE_MONTH_FIELD",
        "GOOSE_WEEK_FIELD",
        "GOOSE_TIME_FIELD",
        "GOOSE_TEL_FIELD",
        "GOOSE_URL_FIELD",
        "GOOSE_COLOR_FIELD",
        "GOOSE_RANGE_FIELD"
    ]

    let dispatch = useDispatch();
    let navigate = useNavigate();

    const [formErrors, setFormErrors] = React.useState(Object);


    const [componentId, setComponentId] = React.useState<string>("");

    const aggiornaComponentId = (event: any) => {
        setComponentId(event.target.value);
        verificaEsistenzaComponentId(formId, event.target.value);
    };

    const [componentIdEsistente, setComponentIdEsistente] = React.useState<boolean>(false);

    const verificaEsistenzaComponentId = async (formId: string, componentId: string) => {
        await gooseComponentService.getComponent(formId,componentId).then(response => {
            console.warn(response.data);
            setComponentIdEsistente(response.data.id != undefined);
        }).catch(e => {
            console.error(e);
        });
    }

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

    const inserisciForm = async () => {
        dispatch(fetchTestoDangerAction(""));
        dispatch(fetchTestoWarnAction(""));
        dispatch(fetchTestoSuccessAction(""));

        let errors = InserisciFormValidator(formId, title, icon, description);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0 && !componentIdEsistente) {

            dispatch(fetchIsLoadingAction(false));

            let jsonBody: GooseFormType = {
                formId: formId,
                title: title,
                icon: icon,
                description: description
            };

            await gooseFormService.inserisciForm(jsonBody).then(response => {
                dispatch(fetchIsLoadingAction(false));
                dispatch(fetchTestoSuccessAction("Salvataggio avvenuto con successo"));
                navigate("/scheda-form/" + formId);
            }).catch(e => {
                dispatch(fetchIsLoadingAction(false));
                console.error(e.response);
                dispatch(fetchTestoDangerAction("Errore durante l'inserimento del form"));
            });
        } else {
            dispatch(fetchTestoWarnAction("Verifica le informazioni inserite"))
        }


    }

    return (
        <Layout>
            <div className="card shadow mb-4">
                <div
                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-plus mr-2"></i>Inserisci componente per il form "{formId}"</h6>
                    <span onClick={inserisciForm} className='btn btn-primary' ><i className="fas fa-save mr-2"></i>Salva</span>

                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <label>Identificativo<strong className='text-danger'>*</strong></label>
                            <input type={"text"} onChange={aggiornaComponentId} className={componentIdEsistente ? "form-control is-invalid" : "form-control"} id={"formId"} name={"formId"} placeholder={"Inserisci il formId"} value={componentId} />
                            {componentIdEsistente && <small className='text-danger'>L'identificativo inserito non è disponibile</small>
                            }
                            <small className='text-danger'>{formErrors.componentId}</small>
                        </div>
                        <div className='col-4'>
                            <label>Titolo<strong className='text-danger'>*</strong></label>
                            <input type={"text"} onChange={aggiornaTitle} className={"form-control"} id={"title"} name={"title"} placeholder={"Inserisci il titolo"} value={title} />
                            <small className='text-danger'>{formErrors.title}</small>
                        </div>
                        <div className='col-4'>
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


        </Layout >
    );

}