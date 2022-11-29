import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import gooseFormService from '../services/GooseFormService';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../modules/feedback/actions';


export default function CodicePage() {


    let dispatch = useDispatch();
    let params = useParams();


    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);

    const [form, setForm] = React.useState<string>();

    const ricerca = async () => {
        await gooseFormService.getAnteprimaForm(params.formId != undefined ? params.formId : "").then(response => {
            console.warn(response.data);
            setForm(response.data);
            dispatch(fetchIsLoadingAction(false));
            dispatch(fetchTestoSuccessAction("Codice JSON del form generato con successo"));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
            dispatch(fetchTestoDangerAction("Errore durante la generazione del codice JSON del form"));
        });
    }

    useEffect(() => {
        if (!ricercaEseguita) {
            dispatch(fetchTestoDangerAction(""));
            dispatch(fetchTestoWarnAction(""));
            dispatch(fetchTestoSuccessAction(""));
            dispatch(fetchIsLoadingAction(true));
            setRicercaEseguita(true);
            ricerca();
        }
    });

   


    return (
        <Layout>
            <div className='row'>
                <div className='col-12'>
                    <Link className='btn btn-primary mb-2' to={"/lista-form/"}>Indietro</Link>
                    <pre id='codice'>{form != undefined ? JSON.stringify(form, null, 2) : ""}</pre>
                </div>
            </div>
        </Layout>
    );

}