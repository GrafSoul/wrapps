import React, { useState, useEffect } from 'react';
import newId from './utils/newid';
import { DragDropContext } from 'react-beautiful-dnd';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

import classes from './app.module.scss';

import Layout from './hoc/Layout/Layout';
import AddForm from './components/AddForm/AddForm';
import ErrorMessages from './components/ErrorMessages/ErrorMessages';
import Footer from './components/Footer/Footer';
import Services from './components/Services/Services';
import InputSearch from './components/InputSearch/InputSearch';
import SearchServices from './components/SearchServices/SearchServices';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const parser = new DOMParser();

function App() {
    const [services, setServices] = useState([]);
    const [link, setLink] = useState('');
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [isError, setIsError] = useState('');
    const [modal, setModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [removeId, setRemoveId] = useState('');
    const [status, setStatus] = useState(false);
    const [search, setSearch] = useState('');
    const [isSearch, setIsSearch] = useState(false);

    useEffect(() => {
        const getServices = JSON.parse(localStorage.getItem('services'));
        if (getServices === null) {
            localStorage.setItem('services', JSON.stringify([]));
        } else {
            const newServices = getServices.map((item) => {
                return { ...item, active: false };
            });
            localStorage.setItem('services', JSON.stringify(newServices));
            setServices(newServices);
        }
    }, []);

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const items = reorder(
            services,
            result.source.index,
            result.destination.index,
        );

        setServices(items);
        localStorage.setItem('services', JSON.stringify(items));
    };

    ipcRenderer.on('removeWin', (event, id) => {
        setStatus(!status);
        updateServices(id);
    });

    const updateServices = (id) => {
        const stateServices = services;
        let objIndex = stateServices.findIndex((service) => service.id === id);

        if (objIndex >= 0 && stateServices[objIndex].active !== false) {
            stateServices[objIndex].active = false;
            setServices(stateServices);
            localStorage.setItem('services', JSON.stringify(stateServices));
        }
    };

    const handleNewLinkUrl = (event) => {
        setLink(event.target.value);

        if (event.target.validity.valid) {
            setIsActiveBtn(true);
        } else {
            setIsActiveBtn(false);
        }
    };

    const handleSearchTitle = (event) => {
        setSearch(event.target.value);
    };

    const handleNewLinkForm = (event) => {
        event.preventDefault();

        // const proxyurl = 'https://cors-anywhere.herokuapp.com/';
        const inspectServices = services.find((service) => {
            let currentLink = link;
            if (currentLink[currentLink.length - 1] === '/')
                currentLink = currentLink.slice(0, -1);
            return service.link === currentLink;
        });
        if (!inspectServices) {
            const resultParseContent = fetch(link)
                .then((response) => response.text())
                .then(parseResponse)
                .then(findTitle)
                .then((title) => storeLink(title, link))
                .then(clearForm)
                .catch((error) => handleError(error, link));
            return resultParseContent;
        } else {
            const errorLink = { message: 'Service is listed' };
            clearForm();
            handleError(errorLink, link);
            return null;
        }
    };

    const parseResponse = (text) => {
        return parser.parseFromString(text, 'text/html');
    };

    const findTitle = (nodes) => {
        return nodes.querySelector('title').innerText;
    };

    const storeLink = (title, url) => {
        const id = newId();
        const currentServices = services;
        let currentLink = url;

        if (currentLink[currentLink.length - 1] === '/')
            currentLink = currentLink.slice(0, -1);

        currentServices.unshift({
            id: id,
            title: title,
            link: currentLink,
            active: false,
        });
        setStatus(false);
        setServices(currentServices);
        localStorage.setItem('services', JSON.stringify(currentServices));
    };

    const clearForm = () => {
        setLink('');
        setIsActiveBtn(false);
    };

    const handleError = (error, url) => {
        setIsError(
            `There was an issue adding "${url}": ${error.message}`.trim(),
        );
        setTimeout(() => setIsError(''), 5000);
    };

    const handelModalStorage = () => {
        setModalMessage('all services');
        toggleModal();
    };

    const handelModalService = (link, id) => {
        setModalMessage(link);
        setRemoveId(id);
        toggleModal();
    };

    const removeContent = (id) => {
        if (id !== '') {
            const currentServices = services.filter(
                (service) => id !== service.id,
            );
            setServices(currentServices);
            localStorage.setItem('services', JSON.stringify(currentServices));
            setModalMessage('');
            setRemoveId('');
            toggleModal();
        } else {
            localStorage.clear();
            setServices([]);
            setModalMessage('');
            toggleModal();
        }
    };

    const toggleModal = () => {
        setModal(!modal);
    };

    const toggleIsSearch = () => {
        setIsSearch(!isSearch);
    };

    const linksSection = (title, url, id) => {
        const newServices = services;

        let objIndex = newServices.findIndex((service) => service.link === url);

        if (
            newServices[objIndex].active === false &&
            newServices[objIndex].id === id
        ) {
            newServices[objIndex].active = true;
            setStatus(!status);
            setServices(newServices);
            localStorage.setItem('services', JSON.stringify(newServices));
            ipcRenderer.send('openWindow', title, url, id);
        } else {
            newServices[objIndex].active = false;
            setStatus(!status);
            setServices(newServices);
            localStorage.setItem('services', JSON.stringify(newServices));
            ipcRenderer.send('closeWindow', id);
        }
    };

    const reverseServices = () => {
        const reversServices = services.reverse();
        setServices(reversServices);
        localStorage.setItem('services', JSON.stringify(reversServices));
        setStatus(!status);
    };

    const sortServicesDown = () => {
        const reversServices = services.slice(0);
        reversServices.sort(function (a, b) {
            let x = a.title.toLowerCase();
            let y = b.title.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        setServices(reversServices);
        localStorage.setItem('services', JSON.stringify(reversServices));
        setStatus(!status);
    };

    const sortServicesUp = () => {
        const reversServices = services.slice(0);
        reversServices.sort(function (a, b) {
            let x = a.title.toLowerCase();
            let y = b.title.toLowerCase();
            return x < y ? 1 : x > y ? -1 : 0;
        });
        setServices(reversServices);
        localStorage.setItem('services', JSON.stringify(reversServices));
        setStatus(!status);
    };

    return (
        <Layout>
            <div className={classes.content}>
                {isSearch && (
                    <>
                        <InputSearch handleSearchTitle={handleSearchTitle} />

                        <DragDropContext onDragEnd={onDragEnd}>
                            <SearchServices
                                status={status}
                                search={search}
                                services={services}
                                modalService={handelModalService}
                                linksSection={linksSection}
                            />
                        </DragDropContext>
                    </>
                )}

                {!isSearch && (
                    <>
                        <ErrorMessages
                            isError={isError}
                            setIsError={setIsError}
                        />

                        <AddForm
                            link={link}
                            isActiveBtn={isActiveBtn}
                            handleNewLinkUrl={handleNewLinkUrl}
                            handleNewLinkForm={handleNewLinkForm}
                        />

                        <DragDropContext onDragEnd={onDragEnd}>
                            <Services
                                status={status}
                                services={services}
                                modalService={handelModalService}
                                linksSection={linksSection}
                            />
                        </DragDropContext>
                    </>
                )}

                <Footer
                    isSearch={isSearch}
                    isActiveBtn={services.length === 0 ? false : true}
                    toggleIsSearch={toggleIsSearch}
                    reverseServices={reverseServices}
                    sortServicesUp={sortServicesUp}
                    sortServicesDown={sortServicesDown}
                    modalStorage={handelModalStorage}
                />

                <Modal isOpen={modal} toggle={toggleModal}>
                    <ModalBody>
                        Do you want to delete
                        <br /> {modalMessage}?
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            size="sm"
                            onClick={() => removeContent(removeId)}
                        >
                            Delete
                        </Button>{' '}
                        <Button
                            color="secondary"
                            size="sm"
                            onClick={toggleModal}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </Layout>
    );
}

export default App;
