import React from 'react';
import fetch from 'isomorphic-fetch';
import { API_HOST } from 'config';
import { fromNow } from 'utility';
import Table from 'components/Table';

function jsonResponse(response) {
  return response.json();
}

const columns = [
  { displayName: 'key', field: 'key' },
  { displayName: 'value', field: 'value' },
];

const tableStyle = { flexGrow: 1, overflowX: 'auto', boxSizing: 'border-box', padding: '15px' };

class Status extends React.Component
{
  componentWillMount() {
    this.setState({
      loading: false,
      result: {},
    });
    fetch(`${API_HOST}/api/status`).then(jsonResponse).then(json => this.setState({ loading: false, result: json }));
  }
  render() {
    return (<div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      <Table
        style={tableStyle}
        data={Object.keys(this.state.result)
        .filter(key => typeof (this.state.result[key]) !== 'object')
        .map(key => ({ key, value: this.state.result[key] }))}
        columns={columns}
      />
      <Table
        style={tableStyle}
        data={Object.keys(this.state.result.health || {})
        .map(key => ({ key, value: `${this.state.result.health[key].metric}/${this.state.result.health[key].threshold}` }))}
        columns={columns}
      />
      <Table
        style={tableStyle}
        data={(this.state.result.last_added || [])
        .map(match => ({ key: match.match_id, value: fromNow(match.start_time + match.duration) }))}
        columns={columns}
      />
      <Table
        style={tableStyle}
        data={(this.state.result.last_parsed || [])
        .map(match => ({ key: match.match_id, value: fromNow(match.start_time + match.duration) }))}
        columns={columns}
      />
      <Table
        style={tableStyle}
        data={(this.state.result.retriever || [])
        .map(row => ({ key: row.hostname, value: row.count }))}
        columns={columns}
      />
      <Table
        style={tableStyle}
        data={Object.keys(this.state.result.queue || {})
        .map(key => ({ key, value: JSON.stringify(this.state.result.queue[key]) }))}
        columns={columns}
      />
      <Table
        style={tableStyle}
        data={Object.keys(this.state.result.load_times || {})
        .filter(key => Number(key) >= 1000)
        .map(key => ({ key, value: JSON.stringify(this.state.result.load_times[key]) }))}
        columns={columns}
      />
    </div>);
  }
}

export default Status;
