import React from 'react';
import '../css/App.css';
import { Tag, CodeBlock, MarkdownBlock } from './blog_components';
import { motion } from "framer-motion";

class Notebook extends React.Component {
    state = {
        //file_path
        fpath: "",
        fbase_path: "",
        // Editor Theme
        ed_theme: 'darkTheme',
        text_ed_theme: 'monokai',
        //themes:
        background_theme: "black",
        background_text_theme: 'white',
        // background_input_theme: '#2F3129',
        background_input_theme: '#272822',
        background_output_theme: '#2F3129',
        loading: true,
        notebook_json: null,
        placeholder_component: "Loading....",

        // Gutter
        gutterVisible: false
    }

    validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }

    async componentDidMount() {
        if (!!this.props.file) {
            var fbase = this.props.file.split('/');
            fbase.pop();
            this.setState({
                fpath: this.props.file,
                fbase_path: fbase.join('/') + '/'
            })
            await fetch(this.props.file)
                .then((r) => r.text())
                .then(async (text) => {
                    try {
                        var notebook_json = JSON.parse(text)
                        this.setState({
                            notebook_json: notebook_json,
                            loading: false,
                            placeholder_component: 'Notebook loaded'
                        })
                    } catch (error) {
                        alert(`Oops! Unable to load json: ${error}`)
                        this.setState({
                            notebook_json: { "message": "Unable to parse .ipynb file" },
                            loading: false,
                            placeholder_component: 'Oops! We have problem opening the notebook'
                        })
                    }
                })
        }
    }

    praseSource(source) {
        var cell_content = ``
        for (var code in source) {
            cell_content += source[code]
        }
        return cell_content
    }

    parseMD(source) {
        var cell_content = ``
        for (var code in source) {
            var rgx = new RegExp(/src="(.*?)"/)
            var new_source = source[code]
            var old_source = source[code].match(rgx)
            if (!!old_source && !this.validURL(old_source[1])) {
                new_source = source[code].replace(/src="(.*?)"/, 'src="' + this.state.fbase_path + old_source[1] + '"')
            } else {
                var rgx2 = new RegExp(/!\[(.*?)\]\((.*?)[\s|)]/)
                var s2 = source[code].match(rgx2)
                if (!!s2 && !this.validURL(s2[2])) {
                    new_source = new_source.replace(s2[2], this.state.fbase_path + s2[2])
                }
            }
            // 
            cell_content += new_source
        }
        return cell_content
    }

    praseOutputs(outputs) {
        if (outputs.length === 0) {
            return ""
        }
        // Handle "data" type cells
        var stdout = ``
        var img_data = `data:image/png;base64,`

        //booleans
        var stdout_found = false
        var text_found = false
        var error_found = false
        var img_found = false

        //maxlines for each output type
        for (var outs in outputs) {
            if ("data" in outputs[outs]) {

                if ("text/plain" in outputs[outs]["data"]) {
                    for (var text in outputs[outs]['data']['text/plain']) {
                    }
                    text_found = true
                }
                if ("image/png" in outputs[outs]["data"]) {
                    img_data += outputs[outs]["data"]["image/png"]
                    img_found = true
                }
            }
            if ("name" in outputs[outs]) {
                for (text in outputs[outs]["text"]) {
                    stdout += outputs[outs]["text"][text]
                }
                stdout_found = true
            }
            // Check for errors
            if ("ename" in outputs[outs]) {
                // for (var trace in outputs[outs]["traceback"]) {
                //     errors += outputs[outs]["traceback"][trace]
                // }
                error_found = true
            }
        }

        var return_template = (
            <div>
                <div style={{
                    padding: '5px 3px',
                    display: stdout_found ? '' : 'none'
                }}>
                    <Tag color="#2db7f5"
                    >stdout</Tag><br></br>{stdout}
                    {stdout}
                        </div>
                <div style={{ padding: '5px 3px', display: text_found ? '' : 'none' }}>
                    <Tag color="#87d068"
                    >data:text/plain</Tag><br></br>
                </div>
                <div style={{ display: img_found ? '' : 'none' }}>
                    <Tag color="#87d068"
                    >data:image/png</Tag><br></br>
                    <img
                        src={img_data}
                        alt={"None"}
                        style={{
                            display: img_found ? '' : 'none',
                            width: '100%',
                            backgroundColor: 'white'
                        }} />
                </div>
                <div style={{ padding: '5px 3px', display: error_found ? '' : 'none' }}>
                    <Tag color="#f50"
                    >error</Tag><br></br>
                </div>
            </div>
        )


        return return_template
    }


    themeChanger(ev) {
        if (ev) {
            this.setState({
                // Editor Theme
                ed_theme: 'darkTheme',
                text_ed_theme: 'monokai',
                //themes:
                background_theme: "black",
                background_text_theme: 'white',
                // background_input_theme: '#2F3129',
                background_input_theme: '#272822',
                background_output_theme: '#2F3129',
            })
        }
        else {
            this.setState({
                // Editor Theme
                ed_theme: 'lightTheme',
                text_ed_theme: 'kuroir',
                //themes:
                background_theme: "white",
                background_text_theme: 'black',
                // background_input_theme: '#2F3129',
                background_input_theme: '#E8E9E8',
                background_output_theme: '#F1F1F2',
            })
        }
    }

    gutterChanger(ev) {
        if (ev) {
            this.setState({
                gutterVisible: true
            })
        }
        else {
            this.setState({
                gutterVisible: false
            })
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.loading ? <div></div> : (Object.values(this.state.notebook_json['cells']).map((item, i) => (
                        item["cell_type"] === "code" ? 
                            <AnimatedOnVisible key={i} i={i}><CodeBlock key={item} lines={item["source"]} outputs={item["outputs"]} /></AnimatedOnVisible>
                            : <AnimatedOnVisible key={i} i={i}><MarkdownBlock key={i}>{this.parseMD(item['source'])}</MarkdownBlock></AnimatedOnVisible>
                    )))
                }
            </div>
        )
    }
}

class AnimatedOnVisible extends React.Component {
    render() {
        return (
            <motion.div initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} transition={{delay: this.props.i * 0.05}}>
                {this.props.children}
            </motion.div>
        )
    }
}


export default Notebook;