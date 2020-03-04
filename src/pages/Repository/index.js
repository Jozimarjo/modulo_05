import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import Container from '../../components/Container';

import { Loading, Owner, IssueList, PageActions } from './styles';

// import { Container } from './styles';

export default class Repository extends Component {
    // eslint-disable-next-line react/static-property-placement
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                repository: PropTypes.string,
            }),
        }).isRequired,
    };

    state = {
        repository: {},
        issues: [],
        loading: true,
        issuesParams: 'open',
        page: 1,
    };

    async componentDidMount() {
        const { match } = this.props;

        const repoName = decodeURIComponent(match.params.repository);

        // const response = await api.get(`/repos/${repoName}`);
        // const issues = await api.get(`/repos/${repoName}/issues`);

        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                params: {
                    state: 'open',
                    per_page: 5,
                },
            }),
        ]);
        this.setState({
            repository: repository.data,
            issues: issues.data,
            loading: false,
        });
    }

    handleSelectChange = async e => {
        this.setState({
            loading: true,
        });
        const { match } = this.props;
        const a = e.target.value;
        const repoName = decodeURIComponent(match.params.repository);

        const issues = await api.get(`/repos/${repoName}/issues`, {
            params: {
                state: e.target.value,
                per_page: 5,
            },
        });

        this.setState({
            issues: issues.data,
            loading: false,
            issuesParams: a,
        });
    };

    handlePage = async e => {
        const { page } = this.state;

        this.setState({
            page: e === 'back' ? page - 1 : page + 1,
            loading: true,
        });
        const { match } = this.props;
        const { issuesParams } = this.state;
        const repoName = decodeURIComponent(match.params.repository);

        const issues = await api.get(`/repos/${repoName}/issues`, {
            params: {
                state: issuesParams,
                per_page: 5,
                page: e === 'back' ? page - 1 : page + 1,
            },
        });
        this.setState({
            issues: issues.data,
            loading: false,
        });
    };

    render() {
        const { repository, issues, loading, issuesParams, page } = this.state;
        if (loading) {
            return <Loading> Carregando</Loading>;
        }
        return (
            <Container>
                <Owner>
                    <Link to="/"> Voltar aos repositorios</Link>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />
                    <h1> {repository.name} </h1>
                    <p> {repository.description} </p>
                </Owner>

                <IssueList>
                    <select
                        id="issueFilter"
                        value={issuesParams}
                        onChange={this.handleSelectChange}
                    >
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                    {issues.map(issue => (
                        <li key={String(issue.id)}>
                            <img
                                src={issue.user.avatar_url}
                                alt={issue.user.login}
                            />
                            <div>
                                <strong>
                                    <a href={issue.html_url}>{issue.title}</a>
                                    {issue.labels.map(label => (
                                        <span key={String(label.id)}>
                                            {label.name}
                                        </span>
                                    ))}
                                </strong>
                                <p> {issue.user.login}</p>
                            </div>
                        </li>
                    ))}
                </IssueList>
                <PageActions>
                    <button
                        type="button"
                        disabled={page < 2}
                        onClick={() => this.handlePage('back')}
                    >
                        Anterior
                    </button>
                    <span>Página {page}</span>
                    <button
                        type="button"
                        onClick={() => this.handlePage('next')}
                    >
                        Próximo
                    </button>
                </PageActions>
            </Container>
        );
    }
}
