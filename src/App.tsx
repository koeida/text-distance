import React from 'react';
import './App.css';
const {distance, closest} = require('fastest-levenshtein')
const {sampleInput} = require('./sample-input.tsx');

function getPairs(l: any[]): object[][] {
  const pairs:object[][] = [];
  for(let x = 0; x < l.length; x++) {
    for(let y = 0; y < l.length; y++) {
      if (x !== y) {
        pairs.push([l[x], l[y]]);
      }
    }
  }
  return pairs;
}

function calculateAllDistances(s:string[]):void {
  const linePairs = getPairs(s); 
}

interface IProps {
}

interface IState {
  originalText: string;
}

class App extends React.Component<IProps, IState> {
  constructor(props:IProps) {
    super(props);
    this.state = {
      originalText: sampleInput(),
    };
  }
  handleChange = (e:any):void => {
    this.setState({
      originalText: e.target.value,
    });
  }

  handleSubmit = (e:any):void => {
    e.preventDefault();
    const pairs = getPairs(this.state["originalText"].split("\n"));
    console.log(pairs[0]);
    console.log(distance(pairs[0][0], pairs[0][1]));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Line Similarity Checker</h1>
        </header>
        <form>
          <label htmlFor="input">Input Text</label>
          <textarea onChange={this.handleChange} id="input" rows={30} cols={50} value={this.state["originalText"]}/>
          <button id="input-button" onClick={this.handleSubmit}>Submit</button>
        </form>
      </div>
    );
  }
}

export default App;
