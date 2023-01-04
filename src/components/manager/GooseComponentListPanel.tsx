import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../../modules/feedback/actions';
import gooseComponentService from '../../services/GooseComponentService';
import { GooseComponentType } from '../../type/GooseComponentType';


export default function GooseComponentListPanel() {

    let params = useParams();
    const dispatch = useDispatch();
    
    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);
    const [listaComponenti, setListaComponenti] = React.useState([]);

    const [formId, setFormId] = React.useState(params.formId != undefined ? params.formId : "");


    const[componenteSelezionato,setComponenteSelezionato] = React.useState<GooseComponentType>();

    const ricercaComponenti = async () => {
        await gooseComponentService.getListaComponent(formId).then(response => {
            setListaComponenti(response.data);
            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    const eliminaComponente = async (componentId: string) => {
        dispatch(fetchIsLoadingAction(true));
        await gooseComponentService.eliminaComponent(formId,componentId).then(response => {
            dispatch(fetchTestoSuccessAction("Componente eliminato con successo"));
            ricercaComponenti();
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
            dispatch(fetchTestoDangerAction("Errore durante l'eliminazione del componente"));
        });
    }

    const ricercaIniziale = async () => {
        if (!ricercaEseguita) {
            setRicercaEseguita(true);
            await gooseComponentService.getListaComponent(formId).then(response => {
                setListaComponenti(response.data);
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
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-gears mr-2"></i>Sono stati trovati {listaComponenti.length} componenti</h6>
                    <span><Link className='btn btn-primary' to={"/inserisci-componente/"+formId} ><i className="fas fa-plus mr-2"></i>Inserisci componente</Link></span>
                </div>
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Type</th>
                                <th scope="col">Label</th>
                                <th scope="col">Order</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>

                            {listaComponenti.map((form: GooseComponentType, index: number) => <tr key={index}>
                                <th scope="row">{form.id}</th>
                                <td>{form.type}</td>
                                <td>{form.label}</td>
                                <td>{form.ordination}</td>
                                <td className='text-center'><Link className='btn btn-primary' to={"/scheda-componente/" + form.formId+"/"+form.id} ><i className="fas fa-edit"></i></Link></td>
                                <td className='text-center'><span onClick={() => setComponenteSelezionato(form)} data-toggle="modal" data-target="#deleteForm" className='btn btn-primary'><i className="fas fa-trash"></i></span></td>
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
                            Sei sicuro di voler eliminare il componente con identificativo <strong>{componenteSelezionato?.id}</strong> con label <strong>{componenteSelezionato?.label}</strong>? <br /><strong>L'operazione è irreversibile!</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Annulla</button>
                            <button data-dismiss="modal" onClick={() => eliminaComponente(componenteSelezionato?.id != undefined ? componenteSelezionato.id : "")} type="button" className="btn btn-primary">Elimina componente</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}