import { Container, Row, Col } from 'react-bootstrap';
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Notebook from './nbviewer';
import { motion, AnimatePresence } from "framer-motion";

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
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                    <Container>
                        <Header />
                        <Switch>
                            {
                                Object.keys(this.state.posts).map((post, i) => 
                                    <Route key={post} path={`/${post}`}>
                                        <div style={{paddingBottom: 15, marginBottom: 15}}>
                                            <Notebook file={this.state.posts[post].file} />
                                        </div>
                                    </Route>
                                )
                            }
                            <Route exact path="/">
                                <AnimatePresence>
                                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                        <TOC posts={this.state.posts}/>
                                    </motion.div>
                                </AnimatePresence>
                            </Route>
                        </Switch>
                    </Container>
                </motion.div>
            </Router>
        )
    }
}

function TOC(props) {
    const contents = Object.keys(props.posts).map((post, i) => 
        <motion.div style={{paddingBottom: 10}} initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} transition={{delay: i * 0.05}}><Link style={{ textDecoration: 'none' }} to={`/${post}`} key={post}><span style={{textDecoration: "none", color: "black", fontFamily: "Merriweather"}} >{props.posts[post].title}</span><span style={{color: "grey", fontFamily: "Merriweather"}}>  {props.posts[post].abstract}</span></Link></motion.div>
    );
    return (
        <Row>
            <Col md={6}>
                <h1 style={{fontFamily: "Merriweather", paddingBottom: 20, paddingTop: 20, fontSize: 40}}>Contents</h1>
                {contents}
            </Col>
            <Col md={3} />
            <Col md={3} style={{fontFamily: "Merriweather"}}>
                <p style={{color: "grey"}}>A collection of interesting notes, notebooks and puzzles.</p>
            </Col>
        </Row>
    );
}

class Header extends React.Component {
    render() {
        return (
            <Row style={{padding: 15, display: "flex", justifyContent: "center"}}>
                <Link style={{textDecoration: "none", color: "inherit"}} to="/"><h2 style={{fontFamily: "Merriweather"}}>Notes</h2></Link>
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