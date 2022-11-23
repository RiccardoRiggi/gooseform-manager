import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import gooseFormService from '../services/GooseFormService';
import remarkGfm from 'remark-gfm'


export default function HomePage() {


    const [ricercaEseguita, setRicercaEseguita] = React.useState(false);
    const [documentazione, setDocumentazione] = React.useState(Object);

    const ricerca = async () => {
        fetch('https://raw.githubusercontent.com/RiccardoRiggi/gooseform/main/README.md')
            .then((r) => r.text())
            .then(text => {
                setDocumentazione(text);
            })
    }


    useEffect(() => {
        if (!ricercaEseguita) {
            setRicercaEseguita(true);
            ricerca();
        }
    });


    return (
        <Layout>
            <div className='row'>
                <div className='col-12'>
                    <ReactMarkdown children={documentazione} remarkPlugins={[remarkGfm]} ></ReactMarkdown>
                </div>
            </div>
        </Layout>
    );

}