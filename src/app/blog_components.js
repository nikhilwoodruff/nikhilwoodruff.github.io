import React from 'react';
import { Row } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import Plot from "react-plotly.js";

function CodeLine(props) {
    return (
        <p style={{lineHeight: 0.5}}>{props.children}</p>
    )
}

function Header(props) {
    return <h2 style={{fontFamily: "Merriweather"}}>{props.children}</h2>
}

function Subheader(props) {
    return <h4 style={{fontFamily: "Merriweather"}}>{props.children}</h4>
}

function Paragraph(props) {
    return <p style={{fontFamily: "Merriweather"}}>{props.children}</p>
}

function PlotlyGraph(props) {
    return props.output["data"] && props.output["data"]["application/vnd.plotly.v1+json"] ? 
    <div style={{width: "100%"}}>
        <Plot 
            data={props.output["data"]["application/vnd.plotly.v1+json"]["data"]}
            config={Object.assign({}, props.output["data"]["application/vnd.plotly.v1+json"]["config"], {"displayModeBar": false})}
            layout={Object.assign({}, props.output["data"]["application/vnd.plotly.v1+json"]["layout"], {"autosize": true})}
            useResizeHandler={true}
            style={{width: "100%"}}
        />
    </div>
    : null
}

export class CodeBlock extends React.Component {
    render() {
        return (
            <div>
                {/*<div style={{fontFamily: "Ubuntu Mono"}}>
                    {this.props.lines.map(line => <CodeLine>{line}</CodeLine>)}
        </div>*/}
                <div>
                    {this.props.outputs.map(
                        output => <PlotlyGraph output={output}/>
                    )}
                </div>
            </div>
        )
    }
}

export class MarkdownBlock extends React.Component {
    render() {
        return (
            <ReactMarkdown components={{"h1": Header, "h2": Subheader, "p": Paragraph}}>{this.props.children}</ReactMarkdown>
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