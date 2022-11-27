import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import gooseFormService from '../services/GooseFormService';
import remarkGfm from 'remark-gfm'
import { useDispatch } from 'react-redux';
import { fetchIsLoadingAction } from '../modules/feedback/actions';
import { GooseFormType } from '../type/GooseFormType';
import { Link } from 'react-router-dom';


export default function ListaFormPage() {

    let dispatch = useDispatch();


    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);
    const [listaForm, setListaForm] = React.useState([]);

    const[formSelezionato,setFormSelezionato] = React.useState<GooseFormType>();

    const ricerca = async () => {
        await gooseFormService.getListaForm().then(response => {
            console.warn(response.data);
            setListaForm(response.data);
            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    const eliminaForm = async (formId: string) => {
        dispatch(fetchIsLoadingAction(true));
        await gooseFormService.eliminaForm(formId).then(response => {
            console.warn(response.data);
            ricerca();
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
            <div className="card shadow mb-4">
                <div
                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-gears mr-2"></i>Sono stati trovati {listaForm.length} forms</h6>
                    <span><Link className='btn btn-primary' to={"/inserisci-form"} ><i className="fas fa-plus mr-2"></i>Inserisci form</Link></span>
                </div>
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Titolo</th>
                                <th scope="col">Icona</th>
                                <th scope="col">Descrizione</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>

                            {listaForm.map((form: GooseFormType, index: number) => <tr key={index}>
                                <th scope="row">{form.formId}</th>
                                <td>{form.title}</td>
                                <td><i className={form.icon}></i> - {form.icon}</td>
                                <td>{form.description}</td>
                                <td className='text-center'><Link className='btn btn-primary' to={"/codice/" + form.formId} ><i className="fas fa-code"></i></Link></td>
                                <td className='text-center'><Link className='btn btn-primary' to={"/scheda-form/" + form.formId} ><i className="fas fa-edit"></i></Link></td>
                                <td className='text-center'><span onClick={() => setFormSelezionato(form)} data-toggle="modal" data-target="#deleteForm" className='btn btn-primary'><i className="fas fa-trash"></i></span></td>
                            </tr>
                            )}

                        </tbody>
                    </table>

                </div>
            </div>

            <div className="modal fade" id="deleteForm" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attenzione!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Sei sicuro di voler eliminare il form con identificativo <strong>{formSelezionato?.formId}</strong> con titolo <strong>{formSelezionato?.title}</strong>? <br/><strong>L'operazione è irreversibile!</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Annulla</button>
                            <button data-dismiss="modal" onClick={() => eliminaForm(formSelezionato?.formId!=undefined?formSelezionato.formId:"")} type="button" className="btn btn-primary">Elimina form</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );

}