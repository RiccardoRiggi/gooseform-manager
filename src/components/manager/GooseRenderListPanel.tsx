import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchIsLoadingAction, fetchTestoDangerAction, fetchTestoSuccessAction, fetchTestoWarnAction } from '../../modules/feedback/actions';
import gooseButtonService from '../../services/GooseButtonService';
import gooseComponentService from '../../services/GooseComponentService';
import gooseControlService from '../../services/GooseControlService';
import gooseRenderService from '../../services/GooseRenderService';
import { GooseButtonType } from '../../type/GooseButtonType';
import { GooseComponentType } from '../../type/GooseComponentType';
import { GooseControlType } from '../../type/GooseControlType';
import { GooseKControlType } from '../../type/GooseKControlType';
import { GooseRenderType } from '../../type/GooseRenderType';


export default function GooseRenderListPanel() {

    let params = useParams();
    const dispatch = useDispatch();

    

    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);
    const [listaRender, setListaRender] = React.useState([]);

    const [formId, setFormId] = React.useState(params.formId != undefined ? params.formId : "");


    const [renderSelezionato, setRenderSelezionato] = React.useState<GooseRenderType>();

    const ricerca = async () => {
        await gooseRenderService.getListaRender(formId).then(response => {
            console.warn(response.data);
            setListaRender(response.data);
            dispatch(fetchIsLoadingAction(false));
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    const eliminaComponente = async (pk: number) => {
        dispatch(fetchIsLoadingAction(true));
        await gooseRenderService.eliminaRender(pk).then(response => {
            console.warn(response.data);
            ricerca();
        }).catch(e => {
            console.error(e);
            dispatch(fetchIsLoadingAction(false));
        });
    }

    const ricercaIniziale = async () => {
        if (!ricercaEseguita) {
            setRicercaEseguita(true);
            await gooseRenderService.getListaRender(formId).then(response => {
                console.warn(response.data);
                setListaRender(response.data);

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
                    <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-fw fa-gears mr-2"></i>Sono stati trovati {listaRender.length} render</h6>
                    <span><Link className='btn btn-primary' to={"/inserisci-render/" + formId} ><i className="fas fa-plus mr-2"></i>Inserisci render</Link></span>
                </div>
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Type</th>
                                <th scope="col">idA</th>
                                <th scope="col">idB</th>
                                <th scope="col">idC</th>
                                <th scope="col">Valore</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>

                            {listaRender.map((form: GooseRenderType, index: number) => <tr key={index}>
                                <th scope="row">{form.type} - {form.typeSpecific}</th>
                                <td>{form.idComponentA}</td>
                                <td>{form.idComponentB}</td>
                                <td>{form.idComponentC}</td>
                                <td>{form.value}</td>
                                <td className='text-center'>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <span onClick={() => setRenderSelezionato(form)} data-toggle="modal" data-target="#deleteRender" className='btn btn-primary ml-1'><i className="fas fa-trash "></i></span>
                                    </div>
                                </td>
                            </tr>
                            )}

                        </tbody>
                    </table>

                </div>
            </div>

            <div className="modal fade" id="deleteRender" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attenzione!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Sei sicuro di voler eliminare il controllo con identificativo <strong>{renderSelezionato?.pk}</strong>? <br /><strong>L'operazione è irreversibile!</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Annulla</button>
                            <button data-dismiss="modal" onClick={() => eliminaComponente(renderSelezionato?.pk != undefined ? renderSelezionato.pk : -1)} type="button" className="btn btn-primary">Elimina render</button>
                        </div>
                    </div>
                </div>
            </div>

            
        </>
    );

}