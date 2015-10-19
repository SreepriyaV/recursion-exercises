import React from 'react';
import ErrorMessage from './error_message';
import ResultMessage from './result_message';
import SelectAnswer from './select-answer';
import { execute } from '../worker';
import * as db from '../db';

const initialState = {
  result: undefined,
  error: undefined,
  msg: 'Submit answer',
  answers: null
};

export function getResult({ result, error }) {

    return result !== undefined ? <ResultMessage result={result} /> :
      (error !== undefined ? <ErrorMessage message={error} /> : null);
  }

const Test = React.createClass({

  getInitialState() {

    return initialState;
  },
  componentDidMount() {

    db.getEntries(this.props.id)
      .then((data) => { if (data === null) { throw Error('No answers!') } else { return data }; })
      .then((answers) => this.setState({ answers }))
      .catch((err) => this.setState({ answers: initialState.answers }));
  },
  _executeTest() {

    this.setState({...initialState, answers: this.state.answers}, () => {

      execute(this.props.test)
        .then((result) => this.setState({ result }))
        .catch((error) => this.setState({ error }));
    });
  },
  _submitResult(id, code) {

    return () => {

      db.createEntry(id, code);

      this.setState({ msg: 'Thanks!' },
        () => setTimeout(() => this.setState({ msg: initialState.msg }), 2000));
    };
  },
  _onAnswerSelect(event) {

    this.props.onAnswerSelect &&
      this.props.onAnswerSelect(this.state.answers[event.target.value]);
  },
  render() {

    return (

      <div className='test'>
        <button className='btn test-btn' onClick={this._executeTest}>Execute test</button>
        {this.state.answers !== null ?
          <SelectAnswer options={this.state.answers || []} defaultValue='default' id={this.props.id} onSelect={this._onAnswerSelect} /> :
          null}
        {this.state.result !== undefined && this.state.result !== false ?
          <button className='btn' onClick={this._submitResult(this.props.id, this.props.test)}>{this.state.msg}</button> :
          null}
        <div className='result'>{getResult(this.state)}</div>
      </div>
    );
  }
});

export default Test;
