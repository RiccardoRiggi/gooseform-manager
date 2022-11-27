import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import gooseFormService from '../services/GooseFormService';
import remarkGfm from 'remark-gfm'
import { useDispatch } from 'react-redux';
import gooseControlService from '../services/GooseControlService';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../modules/feedback/actions';
import { Link, useParams } from 'react-router-dom';
import { GooseKControlType } from '../type/GooseKControlType';


export default function ListaValoriControlPage() {

    const dispatch = useDispatch();
    let params = useParams();

    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);


    const [listaHeaders, setListaHeaders] = React.useState([]);

    const [valore, setValore] = React.useState<string>("");

    const aggiornaValore = (event: any) => {
        setValore(event.target.value);
    };


    const ricercaHeaders = async () => {
        dispatch(fetchIsLoadingAction(true));
        let pk: number = params.pk!=undefined?parseInt(params.pk):-1;
        await gooseControlService.getRighe(pk).then(response => {
            console.warn(response.data);
            setListaHeaders(response.data);
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
        let jsonBody: GooseKControlType = {
            pkControl: params.pk != undefined ? parseInt(params.pk) : -1,
            k: valore
        };

        console.warn(jsonBody);



        await gooseControlService.inserisciRiga(jsonBody).then(response => {
            dispatch(fetchTestoSuccessAction("Inserimento header avvenuto con successo"));
            ricercaHeaders();
        }).catch(e => {
            console.error(e.response);
            dispatch(fetchIsLoadingAction(false));
            dispatch(fetchTestoDangerAction("Errore durante l'inserimento dell'header "));
        });
    }

    const eliminaHeader = async (pk: number, k: string) => {
        await gooseControlService.eliminaRiga(pk, k).then(response => {
            dispatch(fetchTestoSuccessAction("Header cancellato con successo"));
            ricercaHeaders();
        }).catch(e => {
            console.error(e.response);
            dispatch(fetchIsLoadingAction(false));
            dispatch(fetchTestoDangerAction("Errore durante la cancellazione dell'header"));
        });
    }


    useEffect(() => {
        if (!ricercaEseguita) {
            setRicercaEseguita(true);
            ricercaHeaders();
        }
    });


    return (
        <Layout>
            <div className='row'>
                <div className='col-12'>
                    <Link to={"/scheda-form/"+params.formId} className="btn btn-primary mb-2">Indietro</Link>
                    <div className="card shadow mb-4">
                        <div
                            className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-gears mr-2"></i>Sono stati trovati {listaHeaders.length} valori</h6>
                        </div>
                        <div className="card-body">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">Valore</th>
                                        <th scope="col"></th>
                                    </tr>
                                    <tr>

                                        <th scope="col">
                                            <input type={"text"} onChange={aggiornaValore} className={"form-control"} id={"valore"} name={"valore"} placeholder={"Valore..."} value={valore} />
                                        </th>
                                        <th scope="col " className='text-center'>
                                            <span data-dismiss="modal" aria-label="Close" onClick={salvaHeader} className='btn btn-primary' ><i className="fas fa-save"></i></span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(listaHeaders) && listaHeaders.map((header: GooseKControlType) =>
                                        <tr>
                                            <th scope="row">{header.k}</th>
                                            <td className='text-center'>
                                                <span onClick={() => eliminaHeader(header?.pkControl != undefined ? header.pkControl : -1, header.k)} className='btn btn-primary' ><i className="fas fa-trash "></i></span>
                                            </td>
                                        </tr>
                                    )}


                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>







        </Layout>
    );

}