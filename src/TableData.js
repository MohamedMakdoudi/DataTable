import { isImmutable } from "immutable"
import React from "react"
import ReactDataSheet from "react-datasheet"
import "react-datasheet/lib/react-datasheet.css"
import Cell from "./Cell"
import { Editor } from "slate-react"
import { Value } from "slate"
import ValueViewer from './ValueViewer'


const initialValue = {
    document: {
      nodes: [
        {
          object: "block",
          type: "paragraph",
          nodes: [
            {
              object: "text",
              text: "Le Lorem Ipsum texte employé."
            }
          ]
        }
      ]
    }
  };




class TableData extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          colorCell: "#ffffff",
          borderStyle: "solid",
          fontSize : 16,
          selection: null,
          savedSelection : null,
          grid: [
            [
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} }
            ],
            [
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} }
            ],
            [
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} }
            ],
            [
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} }
            ],
            [
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} },
              { value: initialValue, style: {width: "200px", height: "100px"} }
            ]
          ],
          indexCellSelected: null
        };

        document.addEventListener('mousedown', this.pageClick)
      }

      componentWillUnmount () {
        document.removeEventListener ('mousedown', this.pageClick)
      }

      pageClick = (event) => {
         if (event.target.className !== "tableAction") {
            this.setState({selection:null})
         }
      }

      getIndex = () => {
        return {
          indexStartRow : this.state.savedSelection.start.i,
          indexStartCol : this.state.savedSelection.start.j,
          indexEndRow : this.state.savedSelection.end.i,
          indexEndCol : this.state.savedSelection.end.j
        }
      }

      indexSwapping = () => {
        const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
        let savedSelection = this.state.savedSelection
        let start = this.state.savedSelection.start
        let end = this.state.savedSelection.end
        if((indexStartRow > indexEndRow) && (indexStartCol > indexEndCol)){
          savedSelection.start = savedSelection.end
          savedSelection.end = start
        }else if((indexStartRow > indexEndRow) && (indexStartCol <= indexEndCol)){
          let temp = savedSelection.start.i
          savedSelection.start.i = end.i
          savedSelection.end.i = temp
        }else if((indexStartRow <= indexEndRow) && (indexStartCol > indexEndCol)){
          let temp = savedSelection.start.j
          savedSelection.start.j = end.j
          savedSelection.end.j = temp
        }
        this.setState({ savedSelection })
      }

      mergeColonnes = (indexStartCol, indexEndCol, indexStartRow) => {
        const grid = this.state.grid
        let sommeCol = 0;
        for(let j = indexStartCol+1; j <= indexEndCol; j++){
          if(grid[indexStartRow][j]=== undefined){
            sommeCol--
            continue
          }
          if(grid[indexStartRow][j].hasOwnProperty("colSpan")){
            sommeCol += parseInt(grid[indexStartRow][j].colSpan)
          }
          delete grid[indexStartRow][j]
        }
        if(grid[indexStartRow][indexStartCol].hasOwnProperty("colSpan")){
          sommeCol += grid[indexStartRow][indexStartCol].colSpan
        }
        if(sommeCol !== 0){
          grid[indexStartRow][indexStartCol].colSpan = (indexEndCol-indexStartCol) + sommeCol
        }else{
          grid[indexStartRow][indexStartCol].colSpan = (indexEndCol-indexStartCol) + 1
        }
        this.setState({grid})
      }

      mergeLignes = (indexStartRow, indexEndRow, indexStartCol) => {
        const grid = this.state.grid
        let sommeRow = 0;
        for(let i = indexStartRow+1; i <= indexEndRow; i++){
          if(grid[i][indexStartCol]=== undefined){
            sommeRow--
            continue
          }
          if(grid[i][indexStartCol].hasOwnProperty("rowSpan")){
            sommeRow += parseInt(grid[i][indexStartCol].rowSpan)
          }
          delete grid[i][indexStartCol]
        }
        if(grid[indexStartRow][indexStartCol].hasOwnProperty("rowSpan")){
          sommeRow += grid[indexStartRow][indexStartCol].rowSpan
        }
        if(sommeRow !== 0){
          grid[indexStartRow][indexStartCol].rowSpan = (indexEndRow-indexStartRow) + sommeRow
        }else{
          grid[indexStartRow][indexStartCol].rowSpan = (indexEndRow-indexStartRow) + 1
        }
        this.setState({grid})
      }

      handleMerge = () => {
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
          if((indexStartRow === indexEndRow) && (indexStartCol === indexEndCol)){
            console.log("Cette fonctionnalite s'applique pas sur une seul cellule")
          }else if((indexStartRow !== indexEndRow) && (indexStartCol !== indexEndCol)){
            for(let i = indexStartRow; i <= indexEndRow; i++){
              for(let j = indexStartCol; j <= indexEndCol; j++){
                this.mergeColonnes(indexStartCol, j, i)
              }
              this.mergeLignes(indexStartRow, i, indexStartCol)
            }
          }else if((indexStartRow !== indexEndRow) && (indexStartCol === indexEndCol)){
            this.mergeLignes(indexStartRow, indexEndRow, indexStartCol)
          }else {
            this.mergeColonnes(indexStartCol, indexEndCol, indexStartRow)
          }
        }
      }

      handleUnmerge = () => {
        
         if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol} = this.getIndex()
          const grid = this.state.grid
          let colspan, rowspan, style
          if(grid[indexStartRow][indexStartCol].hasOwnProperty("colSpan")){
            colspan = parseInt(grid[indexStartRow][indexStartCol].colSpan)
          }
          if(grid[indexStartRow][indexStartCol].hasOwnProperty("rowSpan")){
            rowspan = parseInt(grid[indexStartRow][indexStartCol].rowSpan)
          }
          if(grid[indexStartRow][indexStartCol].hasOwnProperty("style")){
            style = grid[indexStartRow][indexStartCol].style
          }
          if((rowspan !==  undefined) && (colspan !==  undefined)){
            for(let i = 0; i < rowspan; i++){
              for(let j = 0; j < colspan; j++){
                grid[indexStartRow+i][indexStartCol+j]={"value": grid[indexStartRow][indexStartCol].value, "style": style}
              }
            }
          }else if(rowspan !==  undefined){
            for(let i = 0; i < rowspan; i++){
              grid[indexStartRow+i][indexStartCol]={"value": grid[indexStartRow][indexStartCol].value, "style": style}
            }
          }else{
            for(let j = 0; j < colspan; j++){
              grid[indexStartRow][indexStartCol+j]={"value": grid[indexStartRow][indexStartCol].value, "style": style}
            }
          }
          this.setState({grid})
        }
      }

      handleAddBorderArround = () => {
        if (this.state.selection) {
            this.setState({selection: this.state.savedSelection})
            this.indexSwapping()
            const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
            const grid = this.state.grid
            for(let i = indexStartRow; i <= indexEndRow; i++){
              for(let j = indexStartCol; j <= indexEndCol; j++){
                let style = {}
                if(grid[i][j]=== undefined){
                  continue
                }
                if(grid[i][j].hasOwnProperty("style")){
                    style = grid[i][j]["style"]
                }
                if((i===indexStartRow) && (i === indexEndRow) && (j===indexStartCol) && (j === indexEndCol)){
                  this.handleAddBorderTop()
                  this.handleAddBorderRight()
                  this.handleAddBorderLeft()
                  this.handleAddBorderBottom()
                  continue
                }
                if((i===indexStartRow) && (j===indexStartCol)){
                    this.handleAddBorderTop()
                    this.handleAddBorderLeft()
                    continue
                }
                if((i===indexStartRow) && (j===indexEndCol)){
                    this.handleAddBorderRight()
                }
                if((i===indexStartRow) && (j!==indexStartCol) && (j!==indexEndCol)){
                    this.handleAddBorderTop()
                }
                if((i === indexEndRow) && (j === indexStartCol)){
                    this.handleAddBorderBottom()
                    this.handleAddBorderRight()
                }
                if((i === indexEndRow) && (j === indexEndCol)){
                    this.handleAddBorderBottom()
                    this.handleAddBorderRight()
                }
                if((i === indexEndRow) && (j !== indexStartCol) && (j !== indexEndCol)){
                  this.handleAddBorderBottom()
                }
                if((i === indexStartRow) && (j === indexStartCol) && (j === indexEndCol)){
                  this.handleAddBorderBottom()
                }
                grid[i][j]["style"] = style
              }
            }
            this.setState({grid})
          }
      }

      handleAddBorderIn = () => {
        if (this.state.selection) {
            this.setState({selection: this.state.savedSelection})
            this.handleAddBorderVertical()
            this.handleAddBorderHorizontal()
          }
      }

      handleAddBorderVertical = () => {
        if (this.state.selection) {
            this.setState({selection: this.state.savedSelection})
            this.indexSwapping()
            const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
            const grid = this.state.grid
            for(let i = indexStartRow; i <= indexEndRow; i++){
              for(let j = indexStartCol+1; j <= indexEndCol; j++){
                if(grid[i][j]=== undefined){
                  continue
                }
                if(grid[i][j].hasOwnProperty("style")){
                  grid[i][j]["style"].borderLeft = "3px " + this.state.borderStyle
                }else{
                  grid[i][j]["style"] = {borderLeft : "3px " + this.state.borderStyle}
                }
              }
            }
          this.setState({grid})
        }
      }

      handleAddBorderHorizontal = () => {
        if (this.state.selection) {
            this.setState({selection: this.state.savedSelection})
            this.indexSwapping()
            const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
            const grid = this.state.grid
            for(let i = indexStartRow+1; i <= indexEndRow; i++){
              for(let j = indexStartCol; j <= indexEndCol; j++){
                if(grid[indexEndRow][j]=== undefined){
                  continue
                }
                if(grid[i][j].hasOwnProperty("style")){
                  grid[i][j]["style"].borderTop = "3px " + this.state.borderStyle
                }else{
                  grid[i][j]["style"] = {borderTop : "3px " + this.state.borderStyle}
                }
              }
            }
            this.setState({grid})
          }
      }

      handleCancelStyle = () => {
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
          const grid = this.state.grid
          for(let i = indexStartRow; i <= indexEndRow; i++){
            for(let j = indexStartCol; j <= indexEndCol; j++){
              delete grid[i][j].style
            }
          }
          this.setState({grid})
        }
      }

      handleAddBorderTop = () => {
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndCol} = this.getIndex()
          const grid = this.state.grid
            for(let j = indexStartCol; j <= indexEndCol; j++){
              if(grid[indexStartRow][j]=== undefined){
                continue
              }
              if(grid[indexStartRow][j].hasOwnProperty("style")){
                grid[indexStartRow][j]["style"].borderTop = "3px " + this.state.borderStyle
              }else{
                grid[indexStartRow][j]["style"] = {borderTop : "3px " + this.state.borderStyle}
              }
            }
          this.setState({grid})
        }
      }

      handleAddBorderRight = () => {
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexEndRow, indexEndCol} = this.getIndex()
          const grid = this.state.grid
          for(let i = indexStartRow; i <= indexEndRow; i++){
              if(grid[i][indexEndCol]=== undefined){
                continue
              }
              if(grid[i][indexEndCol].hasOwnProperty("style")){
                grid[i][indexEndCol]["style"].borderRight = "3px " + this.state.borderStyle
              }else{
                grid[i][indexEndCol]["style"] = {borderRight : "3px " + this.state.borderStyle}
              }
          }
          this.setState({grid})
        }
      }

      handleAddBorderBottom = () => {
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
          const grid = this.state.grid
            for(let j = indexStartCol; j <= indexEndCol; j++){
              if(grid[indexEndRow][j]=== undefined){
                continue
              }
              if(grid[indexEndRow][j].hasOwnProperty("style")){
                grid[indexEndRow][j]["style"].borderBottom = "3px " + this.state.borderStyle
              }else{
                grid[indexEndRow][j]["style"] = {borderBottom : "3px " + this.state.borderStyle}
              }
            }
          this.setState({grid})
        }
      }

      handleAddBorderLeft = () => {
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndRow} = this.getIndex()
          const grid = this.state.grid
          for(let i = indexStartRow; i <= indexEndRow; i++){
              if(grid[i][indexStartCol]=== undefined){
                continue
              }
              if(grid[i][indexStartCol].hasOwnProperty("style")){
                grid[i][indexStartCol]["style"].borderLeft = "3px " + this.state.borderStyle
              }else{
                grid[i][indexStartCol]["style"] = {borderLeft : "3px " + this.state.borderStyle}
              }
          }
          this.setState({grid})
        }
      }
      
      handleAddMarginTop = (event) => {
        if (this.state.selection) {
            this.setState({selection: this.state.savedSelection})
            this.indexSwapping()
            const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
            const grid = this.state.grid
            for(let i = indexStartRow; i <= indexEndRow; i++){
              for(let j = indexStartCol; j <= indexEndCol; j++){
                if(grid[i][j]=== undefined){
                  continue
                }
                if(grid[i][j].hasOwnProperty("style")){
                  grid[i][j].style.paddingTop = event.target.value + "px"
                }else{
                  grid[i][j]["style"] = {paddingTop : event.target.value + "px"}
                }
              }
            }
            this.setState({grid})
          }
      }

      handleAddMarginBottom = (event) => {
        console.log(event.target.value)
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
          const grid = this.state.grid
          for(let i = indexStartRow; i <= indexEndRow; i++){
            for(let j = indexStartCol; j <= indexEndCol; j++){
              if(grid[i][j]=== undefined){
                continue
              }
              if(grid[i][j].hasOwnProperty("style")){
                grid[i][j].style.paddingBottom = event.target.value + "px"
              }else{
                grid[i][j]["style"] = {paddingBottom : event.target.value + "px"}
              }
            }
          }
          this.setState({grid})
        }
      }

      handleAddMarginLeft = (event) => {
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
          const grid = this.state.grid
          for(let i = indexStartRow; i <= indexEndRow; i++){
            for(let j = indexStartCol; j <= indexEndCol; j++){
              if(grid[i][j]=== undefined){
                continue
              }
              if(grid[i][j].hasOwnProperty("style")){
                grid[i][j].style.paddingLeft = event.target.value +"px"
              }else{
                grid[i][j].style = {paddingLeft : event.target.value +"px"}
              }
            }
          }
          this.setState({grid})
        }
      }

      handleAddMarginRight = (event) => {
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
          const grid = this.state.grid
          for(let i = indexStartRow; i <= indexEndRow; i++){
            for(let j = indexStartCol; j <= indexEndCol; j++){
              if(grid[i][j]=== undefined){
                continue
              }
              if(grid[i][j].hasOwnProperty("style")){
                grid[i][j].style.paddingRight = event.target.value + "px"
              }else{
                grid[i][j].style = {paddingRight : event.target.value + "px"}
              }
            }
          }
          this.setState({grid})
        }
      }

      handleAddRow = () => {
          const row = []
          for(let i=0; i<this.state.grid[0].length; i++){
              row.push({value: ""})
          }
          const grid = this.state.grid
          grid.push(row)
          this.setState({ grid })
      }

      handleAddColoumn = () => {
        const grid = this.state.grid
        for(let i=0; i<this.state.grid.length; i++){
            grid[i].push({style:{width: "100px"}, value: ""})
        }
        this.setState({ grid })
      }

      handleRemoveColoumn = () => {
          if (this.state.selection) {
            this.setState({selection: this.state.savedSelection})
            this.indexSwapping()
            const {indexStartCol, indexEndCol} = this.getIndex()
            const grid = this.state.grid
            for(let i = 0; i < grid.length; i++){
              for(let j = indexEndCol; j >= indexStartCol; j--){
                if(grid[i][j]=== undefined){
                  continue
                }
                //delete grid[i][indexStartCol]
                grid[i].splice(j,1)
              }
            }
            this.setState({grid})
          }
      }

      handleRemoveRow = () => {
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexEndRow } = this.getIndex()
          const grid = this.state.grid
          for(let i = indexEndRow; i >= indexStartRow ; i--){
            while(grid[i].length > 0){
              if(grid[i][0]=== undefined){
                continue
              }
              grid[i].splice(0,1)
            }
            grid.splice(i, 1)
          }
          this.setState({grid})
        }
      }

      handleChangeBorder = (event) =>{
          let borderStyle = event.target.value
          if(borderStyle === "none"){
            borderStyle = ""
          }
          this.setState({ borderStyle }, ()=>{ console.log(borderStyle)})
      }

      handleChangeColor = (event) => {
        console.log(event)
          this.setState({colorCell: event.target.value})
          if (this.state.selection) {
            this.setState({selection: this.state.savedSelection})
            this.indexSwapping()
            const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
            const grid = this.state.grid
            let style = null
            for(let i = indexStartRow; i <= indexEndRow; i++){
              for(let j = indexStartCol; j <= indexEndCol; j++){
                if(grid[i][j]=== undefined){
                  continue
                }
                if(grid[i][j].hasOwnProperty("style")){
                  style = grid[i][j]["style"]
                  style.backgroundColor = event.target.value
                }else{
                  style = {backgroundColor : event.target.value}
                }
                grid[i][j]["style"] = style
              }
            }
            this.setState({grid})
          }
      }

      handleChangeFontSize = (event) =>{
        const fontSize= parseInt(event.target.value)
        this.setState({ fontSize }, () => {
          if (this.state.selection) {
            this.setState({selection: this.state.savedSelection})
            this.indexSwapping()
            const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
            const grid = this.state.grid
            for(let i = indexStartRow; i <= indexEndRow; i++){
              for(let j = indexStartCol; j <= indexEndCol; j++){
                if(grid[i][indexEndCol]=== undefined){
                  continue
                }
                if(grid[i][j].hasOwnProperty("style")){
                    grid[i][j]["style"].fontSize=  fontSize+"px"
                }else{
                  grid[i][j]["style"] = {fontSize:  fontSize+"px"}
                }
              }
            }
            this.setState({grid})
          }
        })
      }

      handleAlignTop = () => {
        console.log("top")
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
          const grid = this.state.grid
          for(let i = indexStartRow; i <= indexEndRow; i++){
            for(let j = indexStartCol; j <= indexEndCol; j++){
              if(grid[i][j]=== undefined){
                continue
              }
              if(grid[i][j].hasOwnProperty("style")){
                grid[i][j]["style"].verticalAlign = "top"
              }else{
                grid[i][j]["style"] = {verticalAlign : "top"}
              }
            }
          }
          this.setState({grid})
        }
      }

      handleAlignBottom = () => {
        console.log("bottom")
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
          const grid = this.state.grid
          for(let i = indexStartRow; i <= indexEndRow; i++){
            for(let j = indexStartCol; j <= indexEndCol; j++){
              if(grid[i][j]=== undefined){
                continue
              }
              if(grid[i][j].hasOwnProperty("style")){
                grid[i][j]["style"].verticalAlign = "bottom"
              }else{
                grid[i][j]["style"] = {verticalAlign : "bottom"}
              }
            }
          }
          this.setState({grid})
        }
      }

      handleAlignLeft = () => {
        console.log("Left")
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
          const grid = this.state.grid
          for(let i = indexStartRow; i <= indexEndRow; i++){
            for(let j = indexStartCol; j <= indexEndCol; j++){
              if(grid[i][j]=== undefined){
                continue
              }
              if(grid[i][j].hasOwnProperty("style")){
                grid[i][j]["style"].textAlign = "left"
              }else{
                grid[i][j]["style"] = {textAlign : "left"}
              }
            }
          }
          this.setState({grid})
        }
      }

      handleAlignRight = () =>{
        console.log("right")
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
          const grid = this.state.grid
          for(let i = indexStartRow; i <= indexEndRow; i++){
            for(let j = indexStartCol; j <= indexEndCol; j++){
              if(grid[i][j]=== undefined){
                continue
              }
              if(grid[i][j].hasOwnProperty("style")){
                grid[i][j]["style"].textAlign = "right"
              }else{
                grid[i][j]["style"] = {textAlign : "right"}
              }
            }
          }
          this.setState({grid})
        }
      }

      handleVerticalCenter = () => {
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
          const grid = this.state.grid
          for(let i = indexStartRow; i <= indexEndRow; i++){
            for(let j = indexStartCol; j <= indexEndCol; j++){
              if(grid[i][j]=== undefined){
                continue
              }
              if(grid[i][j].hasOwnProperty("style")){
                grid[i][j]["style"].verticalAlign = "middle"
              }else{
                grid[i][j]["style"] = {verticalAlign : "middle"}
              }
            }
          }
          this.setState({grid})
        }
      }

      handleHorizontalCenter = () => {
        if (this.state.selection) {
          this.setState({selection: this.state.savedSelection})
          this.indexSwapping()
          const {indexStartRow, indexStartCol, indexEndRow, indexEndCol} = this.getIndex()
          const grid = this.state.grid
          for(let i = indexStartRow; i <= indexEndRow; i++){
            for(let j = indexStartCol; j <= indexEndCol; j++){
              if(grid[i][j]=== undefined){
                continue
              }
              if(grid[i][j].hasOwnProperty("style")){
                grid[i][j]["style"].textAlign= "center";
              }else{
                grid[i][j]["style"] = {textAlign: "center"}
              }
            }
          }
          this.setState({grid})
        }
      }

      handleSelect = (selection) => { 
        this.setState({savedSelection:selection, selection});
      }
    
      render() {  
        return (
          <div>
            <button className="tableAction" onClick={this.handleAddColoumn}>add coloumn</button>
            <button className="tableAction" onClick={this.handleAddRow}>add row</button>
            <button className="tableAction" onClick={this.handleRemoveColoumn}>remove coloumn</button>
            <button className="tableAction" onClick={this.handleRemoveRow}>remove row</button><br/>

            <button className="tableAction" onClick={this.handleAlignTop}>Align Top</button>
            <button className="tableAction" onClick={this.handleAlignBottom}>Align Bottom</button>
            <button className="tableAction" onClick={this.handleAlignLeft}>Align Left</button>
            <button className="tableAction" onClick={this.handleAlignRight}>Align Right</button>
            <button className="tableAction" onClick={this.handleVerticalCenter}>Vertical center</button>
            <button className="tableAction" onClick={this.handleHorizontalCenter}>horizontal center</button><br/>

            <input  className="tableAction" type="number" min="0" onChange={this.handleAddMarginTop} /><br/>
            <input  className="tableAction" type="number" min="0" onChange={this.handleAddMarginLeft} />
            <label> Margin </label>
            <input  className="tableAction" type="number" min="0" onChange={this.handleAddMarginRight} /><br/>
            <input  className="tableAction" type="number" min="0" onChange={this.handleAddMarginBottom} /><br/>

            <button className="tableAction" onClick={this.handleAddBorderTop}>add Border Top</button>
            <button className="tableAction" onClick={this.handleAddBorderRight}>add Border Right</button>
            <button className="tableAction" onClick={this.handleAddBorderBottom}>add Border Bottom</button>
            <button className="tableAction" onClick={this.handleAddBorderLeft}>add Border Lfet</button><br/>

            <button className="tableAction" onClick={this.handleAddBorderArround}>add Border Contour</button>
            <button className="tableAction" onClick={this.handleAddBorderIn}>add Border +</button>
            <button className="tableAction" onClick={this.handleAddBorderVertical}>add Border vertical</button>
            <button className="tableAction" onClick={this.handleAddBorderHorizontal}>add Border horizontal</button><br/>
            
            <button className="tableAction" onClick={this.handleCancelStyle}>Cancel Style</button>
            <button className="tableAction" onClick={this.handleMerge}>Merge Cell</button>
            <button className="tableAction" onClick={this.handleUnmerge}>Unmerge Cell</button><br/><br/>

            <select className="tableAction" onChange={this.handleChangeBorder}>
                <option value="none">none</option>
                <option value="hidden">hidden</option>
                <option value="dotted">dotted</option>
                <option value="dashed">dashed</option>
                <option value="solid">solid</option>
                <option value="double">double</option>
                <option value="groove">groove</option>
                <option value="ridge">ridge</option>
                <option value="inset">inset</option>
                <option value="outset">outset</option>
            </select>

            <input className="tableAction" type="color" value={this.state.colorCell} onChange={this.handleChangeColor} />

            <select className="tableAction" onChange={this.handleChangeFontSize} value={this.state.fontSize}>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="14">14</option>
                <option value="16">16</option>
                <option value="18">18</option>
                <option value="24">24</option>
                <option value="36">36</option>
            </select>

            <div >
                <div style={{width:"100%"}}>
            <ReactDataSheet
              data={this.state.grid}
              valueRenderer={cell => cell.value}
              dataRenderer={cell => {
                return JSON.stringify(cell.value);
              }}
              valueViewer={ValueViewer}
              dataEditor={props => {
                let val = "";
                if (!isImmutable(props.value)) {
                  val = Value.fromJSON(props.cell.value);
                } else {
                  val = props.value;
                }
                //console.log(val);
                return (
                  <div>
                    <Editor
                      value={val}
                      onChange={({ value }) => {
                        //console.log("icicici");
                        return props.onChange(value);
                      }}
                      autoFocus={true}
                    />
                  </div>
                );
              }}
              parsePaste={str => {
                //console.log(str);
                return str
                  .split(/\r\n|\n|\r/)
                  .map(row => row.split("\t").map(val => JSON.parse(val)));
              }}
              cellRenderer={Cell}
              attributesRenderer={cell => {
                return { color: cell.color };
              }}
              onCellsChanged={changes => {
                const grid = this.state.grid.map(row => [...row]);
                changes.forEach(({ cell, row, col, value }) => {
                  grid[row][col] = { ...grid[row][col], value };
                });
                //console.log(grid);
                this.setState({ grid });
              }}
              selected= { this.state.selection }
              onSelect = { this.handleSelect }
            />
            </div>
            </div>
          </div>
        );
      }
}

export default TableData;
