import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import Plot from "react-plotly.js";
import { motion } from "framer-motion";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CodeBlock as Code_, dracula } from "react-code-blocks";
  

function Header(props) {
    return <h1 style={{fontFamily: "Merriweather", paddingBottom: 20, paddingTop: 20, fontSize: 40}}>{props.children}</h1>
}

function Subheader(props) {
    return <Row>
                <Col md={2} />
                <Col md={8}z>
                    <h4 style={{fontFamily: "Merriweather"}}>{props.children}</h4>
                </Col>
            </Row>
}

function Paragraph(props) {
    return (
        <Row>
            <Col md={2} />
            <Col md={8}>
                <p style={{fontFamily: "Merriweather"}}>{props.children}</p>
            </Col>
        </Row>
    )
}

function Bullet(props) {
    return (
        <Row>
            <Col md={2} />
            <Col md={8}>
                <p style={{fontFamily: "Merriweather"}}>- {props.children}</p>
            </Col>
        </Row>
    )
}

function PlotlyGraph(props) {
    return props.output["data"] && props.output["data"]["application/vnd.plotly.v1+json"] ? 
    
    <Row>
        <Col>
            <div style={{width: "100%"}}>
                <Plot 
                    data={props.output["data"]["application/vnd.plotly.v1+json"]["data"]}
                    config={Object.assign({}, props.output["data"]["application/vnd.plotly.v1+json"]["config"], {"displayModeBar": false})}
                    layout={Object.assign({}, props.output["data"]["application/vnd.plotly.v1+json"]["layout"], {"autosize": true})}
                    useResizeHandler={true}
                    style={{width: "100%", height: "100%"}}
                />
            </div>
        </Col>
    </Row>
    : null
}

export class CodeBlock extends React.Component {
    render() {
        return (
            <div>
                <Row style={{paddingBottom: 20}}>
                    <Col md={2} />
                    <Col md={8}>
                        <Code_
                            text={this.props.lines.join("")}
                            showLineNumbers={true}
                            language={"python"}
                            theme={dracula}
                            codeBlock
                        />
                        
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div style={{paddingTop: 30}}>
                            {Object.values(this.props.outputs).map(
                                (output, i) => <PlotlyGraph key={i} output={output}/>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export class MarkdownBlock extends React.Component {
    render() {
        return (
            <ReactMarkdown 
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{"h1": Header, "h2": Subheader, "p": Paragraph, "li": Bullet}}>{this.props.children}</ReactMarkdown>
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