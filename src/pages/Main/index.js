import React from 'react';
import { Container, Form, SubmitButton } from './styles';
import { FaGithubAlt, FaPlus } from 'react-icons/fa';

function Main() {
    return (
        <Container>
            <h1>
                <FaGithubAlt />
                Repositorios
            </h1>
            <Form onSubmit={() => {}}>
                <input type="text" placeholder="Adicionar repositorios" />
                <SubmitButton disable>
                    <FaPlus color="#fff" size={14}></FaPlus>
                </SubmitButton>
            </Form>
        </Container>
    );
}

export default Main;
