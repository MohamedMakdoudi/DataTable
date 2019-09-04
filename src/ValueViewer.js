import React, { PureComponent } from 'react'
import { Editor } from "slate-react"
import PropTypes from 'prop-types'
import { Value } from "slate";

class ValueViewer extends PureComponent {
    render () {
        const val = Value.fromJSON(this.props.value);
        return <Editor value={val} readOnly={true} />
    }
}
  
ValueViewer.propTypes = {
row: PropTypes.number.isRequired,
col: PropTypes.number.isRequired
}

export default ValueViewer