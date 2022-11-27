import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import gooseFormService from '../services/GooseFormService';
import remarkGfm from 'remark-gfm'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchIsLoadingAction } from '../modules/feedback/actions';
import { json } from 'stream/consumers';


export default function CodicePage() {


    let dispatch = useDispatch();
    let params = useParams();


    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);

    const[form,setForm] = React.useState<string>();

    const ricerca = async () => {
        await gooseFormService.getAnteprimaForm(params.formId!=undefined?params.formId:"").then(response => {
            console.warn(response.data);
            setForm(response.data);
            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
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
            <div className='row'>
                <div className='col-12'>
                        <pre>{form!=undefined?JSON.stringify(form,null,2):""}</pre>
                </div>
            </div>
        </Layout>
    );

}