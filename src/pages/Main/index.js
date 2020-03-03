import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Form, SubmitButton, List, Input } from './styles';
import Container from '../../components/Container';

import api from '../../services/api';

export default class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
        error: false,
    };

    componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories)
            this.setState({ repositories: JSON.parse(repositories) });
    }

    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;
        if (prevState.repositories !== repositories)
            localStorage.setItem('repositories', JSON.stringify(repositories));
    }

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value });
    };

    handleSubmit = async e => {
        e.preventDefault();
        const { newRepo, repositories } = this.state;

        this.setState({ loading: true });
        try {
            const t = repositories.find(value => value.name === newRepo);

            if (t) throw new Error('Repositório duplicado');

            const response = await api.get(`/repos/${newRepo}`);
            const data = {
                name: response.data.full_name,
            };

            this.setState({
                repositories: [...repositories, data],
                newRepo: '',
                loading: false,
                error: false,
            });
        } catch (error) {
            this.setState({
                loading: false,
                error: true,
            });
        }
    };

    render() {
        const { newRepo, loading, repositories, error } = this.state;
        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositorios
                </h1>
                <Form onSubmit={this.handleSubmit}>
                    {/* <input
                        type="text"
                        value={newRepo}
                        onChange={this.handleInputChange}
                        placeholder="Adicionar repositorios"
                    /> */}
                    <Input
                        error={error ? 1 : 0}
                        type="text"
                        value={newRepo}
                        onChange={this.handleInputChange}
                        placeholder="Adicionar repositorios"
                    />

                    <SubmitButton loading={loading ? 1 : 0}>
                        {loading ? (
                            <FaSpinner color="#FFF" size={14} />
                        ) : (
                            <FaPlus color="#fff" size={14} />
                        )}
                    </SubmitButton>
                </Form>
                <List>
                    {repositories.map(rep => (
                        <li key={rep.name}>
                            <span> {rep.name} </span>
                            <Link
                                to={`/repository/${encodeURIComponent(
                                    rep.name
                                )}`}
                            >
                                Detalhes
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
