import React from 'react';
import Board from '../board/Board';
import 'materialize-css';
// import { Row, Col, Footer } from 'react-materialize';
import './style.css';

class Container extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            color: "#000000",
            size: "5"
        }
    }

    changeColor(params) {
        this.setState({
            color: params.target.value
        })
    }

    changeSize(params) {
        this.setState({
            size: params.target.value
        })
    }

    saveCanvas() {
        var canvasSave = document.querySelector('#board');
        const d = canvasSave.toDataURL('image/png');
        const w = window.open('about:blank', 'image from canvas');
        w.document.write("<img src='"+d+"' alt='from canvas'/>");
        console.log('Saved!');
      }



    render() {

        return (
            <div className="container">
                <nav class="navbar sticky-top bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">Collaborative Whiteboard</a>
                    </div>
                </nav>
                <div class="row tools-section">
                    <div className=" col s4 color-picker-container">
                        Select Brush Color : &nbsp; 
                        <input type="color" value={this.state.color} onChange={this.changeColor.bind(this)}/>
                    </div>

                    <div className=" col s4 brushsize-container" >
                        Select Brush Size : &nbsp; 
                        <select value={this.state.size} onChange={this.changeSize.bind(this)}>
                            <option> 5 </option>
                            <option> 10 </option>
                            <option> 15 </option>
                            <option> 20 </option>
                            <option> 25 </option>
                            <option> 30 </option>
                        </select>
                    </div>

                    <div className=" col s4 buttonBar">          
                    <button type="button" id="ResetButton" class="btn">
                     RESET         
                    </button>          

                    <button type="button" id="saveBtn" onClick={ this.saveCanvas } class="btn">
                     SAVE         
                    </button>          
                    </div>


                </div>

                <div class="row board-container">
                    <div class="board"> 
                    <Board color={this.state.color} size={this.state.size}></Board>
                    </div>
                </div>
              
                
            </div>
            
        )
    }
}

export default Container