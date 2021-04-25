import { Container, Row, Col } from 'react-bootstrap';
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Notebook from './nbviewer';

export class Blog extends React.Component {
    render() {
        return (
            <Router>
                <Container>
                    <Header />
                    <Switch>
                        <Route path="/post">
                            <Notebook file="/notebooks/test.ipynb"/>
                        </Route>
                        <Route exact path="/">
                            <Body />
                        </Route>
                    </Switch>
                </Container>
            </Router>
        )
    }
}

class Header extends React.Component {
    render() {
        return (
            <Row style={{padding: 15, display: "flex", justifyContent: "center"}}>
                <h2>Blog</h2>
            </Row>
        )
    }
}

class Body extends React.Component {
    render() {
        return (
            <Row>
                <h3>Body</h3>
            </Row>
        )
    }
}

export class Card extends React.Component {
    render() {
        return <div>{this.props.children}</div>
    }
}

export class Tag extends React.Component {
    render() {
        return <div>{this.props.children}</div>
    }
}