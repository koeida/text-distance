import React from 'react';
import './App.css';
const {values, reverse, sortBy, prop, groupBy, addIndex, pipe, filter, map} = require('ramda');
const {distance} = require('fastest-levenshtein')
const {sampleInput} = require('./sample-input.tsx');

const MIN_DISTANCE = 5;
const mapIndexed = addIndex(map);
interface IProps {
}

interface IState {
  originalText: string;
  output: LineInfo[][];
}

class LineInfo {
  constructor(
    public line1: Line,
    public line2: Line,
    public distance: number,
  ){};
}

function getPairs<A>(l:A[]): [A, A][] {
  const result:[A, A][] = []
  for(let x = 0; x < l.length; x++) {
    for(let y = 0; y < l.length; y++) {
      if (x !== y) {
        result.push([l[x], l[y]]);
      }
    }
  }
  return result;
}
console.assert(getPairs([1,2,3]).length === 6);

type Line = [string, number];

function lineDistance(pair: [Line, Line]): LineInfo {
  const [l1, l2] = pair;    
  const [[v1, i1], [v2, i2]] = [l1, l2];
  const d = distance(v1, v2);
  return new LineInfo(l1,l2,d);
}
const ltest1:Line = ["hello", 0];
const ltest2:Line = ["heyllo", 1];
const testLInfo = lineDistance([ltest1, ltest2]);
console.assert(testLInfo.distance === 1);

function calculateAllDistances(s:string[]): LineInfo[][] {
  return pipe(
    mapIndexed((lineText:string, lineNumber:number) => [lineText, lineNumber]),
    getPairs,
    map(lineDistance),
    filter((lineInfo:LineInfo) => lineInfo.distance <= MIN_DISTANCE),
    groupBy((li:LineInfo) => li.line1[1]),
    values
  )(s);
}

function OutputDisplay(props:any):any {
  const lines = map((line: LineInfo[]) => {
    const lineNumber:number = line[0].line1[1];
    const originalLine = line[0].line1[0];
    const subLines = sortBy(prop("distance"), line);
    const subLinesJsx = map((line: LineInfo) => (<li key={line.line2[1]}>{line.line2[0]} ({line.distance})</li>), subLines);
    return (<li key={lineNumber}>{originalLine}<ul>{subLinesJsx}</ul></li>);
  }, props["data"]);
  return (
    <ul>
    {lines}
    </ul>
  );
}

class App extends React.Component<IProps, IState> {
  constructor(props:IProps) {
    super(props);
    this.state = {
      originalText: sampleInput(),
      output: [],
    };
  }
  handleChange = (e:any):void => {
    this.setState({
      originalText: e.target.value,
    });
  }

  handleSubmit = (e:any):void => {
    e.preventDefault();
    const output = calculateAllDistances(this.state["originalText"].split("\n")); 
    this.setState({
      output: output
    });
  }

  render() {
    const lines = this.state.output[1];
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
        <div>
          <OutputDisplay data={this.state.output} />
        </div>
      </div>
    );
  }
}

export default App;
