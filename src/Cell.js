import React from "react";
import "react-datasheet/lib/react-datasheet.css";

class Cell extends React.PureComponent {
    render() {
      const {
        cell,
        row,
        col,
        attributesRenderer,
        className,
        style,
        onMouseDown,
        onMouseOver,
        onDoubleClick,
        onContextMenu
      } = this.props;
  
      const { colSpan, rowSpan } = cell;
      const attributes = attributesRenderer
        ? attributesRenderer(cell, row, col)
        : {};
  
      const cellstyle = cell.style;
      //console.log(cellstyle);
  
      const style2 = {
        ...style,
        ...cellstyle
      };
  
      if (colSpan === 0 || rowSpan === 0) {
        return null;
      }
  
      return (
        <td
          className={className}
          onMouseDown={onMouseDown}
          onMouseOver={onMouseOver}
          onDoubleClick={onDoubleClick}
          onTouchEnd={onDoubleClick}
          onContextMenu={onContextMenu}
          colSpan={colSpan}
          rowSpan={rowSpan}
          style={style2}
          {...attributes}
        >
          {this.props.children}
        </td>
      );
    }
  }
  
  Cell.defaultProps = {
    selected: false,
    editing: false,
    updated: false,
    attributesRenderer: () => {}
  };

  export default Cell;