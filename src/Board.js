import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients
          .filter((client) => !client.status || client.status === 'backlog')
          .sort((a, b) => a.priority - b.priority),
        inProgress: clients
          .filter((client) => client.status && client.status === 'in-progress')
          .sort((a, b) => a.priority - b.priority),
        complete: clients
          .filter((client) => client.status && client.status === 'complete')
          .sort((a, b) => a.priority - b.priority),
      },
    };
    this.drake = Dragula();
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }

  // async getClient() {
  //   const response = await fetch('http://localhost:3001/api/v1/clients');
  //   const data = await response.json();
  //   return data;
  // }

  getClients() {
    return [
      [
        '1',
        'Stark, White and Abbott',
        'Cloned Optimal Architecture',
        'in-progress',
      ],
      [
        '2',
        'Wiza LLC',
        'Exclusive Bandwidth-Monitored Implementation',
        'complete',
      ],
      [
        '3',
        'Nolan LLC',
        'Vision-Oriented 4Thgeneration Graphicaluserinterface',
        'backlog',
      ],
      [
        '4',
        'Thompson PLC',
        'Streamlined Regional Knowledgeuser',
        'in-progress',
      ],
      [
        '5',
        'Walker-Williamson',
        'Team-Oriented 6Thgeneration Matrix',
        'in-progress',
      ],
      ['6', 'Boehm and Sons', 'Automated Systematic Paradigm', 'backlog'],
      [
        '7',
        'Runolfsson, Hegmann and Block',
        'Integrated Transitional Strategy',
        'backlog',
      ],
      ['8', 'Schumm-Labadie', 'Operative Heuristic Challenge', 'backlog'],
      [
        '9',
        'Kohler Group',
        'Re-Contextualized Multi-Tasking Attitude',
        'backlog',
      ],
      ['10', 'Romaguera Inc', 'Managed Foreground Toolset', 'backlog'],
      ['11', 'Reilly-King', 'Future-Proofed Interactive Toolset', 'complete'],
      [
        '12',
        'Emard, Champlin and Runolfsdottir',
        'Devolved Needs-Based Capability',
        'backlog',
      ],
      [
        '13',
        'Fritsch, Cronin and Wolff',
        'Open-Source 3Rdgeneration Website',
        'complete',
      ],
      [
        '14',
        'Borer LLC',
        'Profit-Focused Incremental Orchestration',
        'backlog',
      ],
      [
        '15',
        'Emmerich-Ankunding',
        'User-Centric Stable Extranet',
        'in-progress',
      ],
      [
        '16',
        'Willms-Abbott',
        'Progressive Bandwidth-Monitored Access',
        'in-progress',
      ],
      ['17', 'Brekke PLC', 'Intuitive User-Facing Customerloyalty', 'complete'],
      [
        '18',
        'Bins, Toy and Klocko',
        'Integrated Assymetric Software',
        'backlog',
      ],
      [
        '19',
        'Hodkiewicz-Hayes',
        'Programmable Systematic Securedline',
        'backlog',
      ],
      ['20', 'Murphy, Lang and Ferry', 'Organized Explicit Access', 'backlog'],
    ].map((companyDetails) => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }

  putClient(id, status, sibling) {
    if (sibling) {
      const siblingId = sibling.getAttribute('data-id');
      const clients = [
        ...this.state.clients.backlog,
        ...this.state.clients.inProgress,
        ...this.state.clients.complete,
      ];
      const priority = clients.findIndex((c) => c.id === siblingId);
      fetch(`http://localhost:3001/api/v1/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          priority,
        }),
      });
    } else {
      let priority;
      if (status === 'backlog') {
        priority = this.state.clients.backlog.length;
      } else if (status === 'in-progress') {
        priority = this.state.clients.inProgress.length;
      } else {
        priority = this.state.clients.complete.length;
      }
      fetch(`http://localhost:3001/api/v1/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          priority,
        }),
      });
    }
  }

  componentDidMount() {
    document.querySelectorAll('.Swimlane-dragColumn').forEach((container) => {
      this.drake.containers.push(container);
    });

    this.drake.on('drop', (el, target, source, sibling) => {
      el.classList.remove('Card-grey');
      el.classList.remove('Card-green');
      el.classList.remove('Card-blue');
      const clients = this.getClients();
      clients.forEach((client) => {
        if (client.id === el.getAttribute('data-id')) {
          switch (this.drake.containers.findIndex((c) => c === target)) {
            case 0:
              el.classList.add('Card-grey');
              client.status = 'backlog';
              this.putClient(client.id, 'backlog', sibling);
              break;

            case 1:
              el.classList.add('Card-blue');
              client.status = 'in-progress';
              this.putClient(client.id, 'in-progress', sibling);
              break;

            case 2:
              el.classList.add('Card-green');
              client.status = 'complete';
              this.putClient(client.id, 'complete', sibling);
              break;

            default:
              break;
          }
        }
      });
    });

    fetch('http://localhost:3001/api/v1/clients')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // update state with API data
        this.setState({
          clients: {
            backlog: data
              .filter((client) => !client.status || client.status === 'backlog')
              .sort((a, b) => a.priority - b.priority),
            inProgress: data
              .filter(
                (client) => client.status && client.status === 'in-progress'
              )
              .sort((a, b) => a.priority - b.priority),
            complete: data
              .filter((client) => client.status && client.status === 'complete')
              .sort((a, b) => a.priority - b.priority),
          },
        });
      });
  }
  renderSwimlane(name, clients, ref) {
    return <Swimlane name={name} clients={clients} dragulaRef={ref} />;
  }

  render() {
    return (
      <div className='Board'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-4'>
              {this.renderSwimlane(
                'Backlog',
                this.state.clients.backlog,
                this.swimlanes.backlog
              )}
            </div>
            <div className='col-md-4'>
              {this.renderSwimlane(
                'In Progress',
                this.state.clients.inProgress,
                this.swimlanes.inProgress
              )}
            </div>
            <div className='col-md-4'>
              {this.renderSwimlane(
                'Complete',
                this.state.clients.complete,
                this.swimlanes.complete
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}