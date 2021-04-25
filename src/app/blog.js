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
    constructor() {
        super();
        this.state = {posts: {}};
    }

    componentDidMount() {
        fetch("/notebooks/posts.json").then(res => res.json()).then(data => this.setState({posts: data["posts"]}));
    }

    render() {
        console.log(this.state)
        return (
            <Router>
                <Container>
                    <Header />
                    <Switch>
                        {
                            Object.keys(this.state.posts).map((post, i) => 
                                <Route key={post} path={`/${post}`}>
                                    <Notebook file={this.state.posts[post].file} />
                                </Route>
                            )
                        }
                        <Route exact path="/">
                            {Object.keys(this.state.posts).map((post, i) => <Link style={{textDecoration: "none", color: "inherit"}} to={`/${post}`} key={post}>{this.state.posts[post].title}</Link>)}
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
                <Link style={{textDecoration: "none", color: "inherit"}} to="/"><h2 style={{fontFamily: "Merriweather"}}>Blog</h2></Link>
                <div style={{width: "100%", borderBottom: "2px solid"}}/>
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