import cytoscape from 'cytoscape';
import dagre from 'dagre';
import cytoscapeDagre from 'cytoscape-dagre';

// Register the dagre layout
cytoscape.use(cytoscapeDagre);

// Sample data structure for the AI Maturity Model
const data = {
    nodes: [
        { data: { id: 'ethical', label: 'Ethical AI' } },
        { data: { id: 'responsible', label: 'Responsible AI' } },
        { data: { id: 'transparent', label: 'Transparent AI' } },
        { data: { id: 'fair', label: 'Fair AI' } },
        { data: { id: 'secure', label: 'Secure AI' } }
    ],
    edges: [
        { data: { source: 'ethical', target: 'responsible' } },
        { data: { source: 'responsible', target: 'transparent' } },
        { data: { source: 'transparent', target: 'fair' } },
        { data: { source: 'fair', target: 'secure' } }
    ]
};

// Initialize Cytoscape
const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: data,
    style: [
        {
            selector: 'node',
            style: {
                'background-color': '#666',
                'label': 'data(label)',
                'text-valign': 'center',
                'text-halign': 'center',
                'text-wrap': 'wrap',
                'text-max-width': '80px',
                'color': '#fff',
                'font-size': '12px',
                'padding': '10px'
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 2,
                'line-color': '#999',
                'target-arrow-color': '#999',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier'
            }
        }
    ],
    layout: {
        name: 'dagre',
        rankDir: 'TB',
        padding: 50,
        spacingFactor: 1.5
    }
});

// Add zoom controls
cy.on('tap', 'node', function(evt) {
    const node = evt.target;
    console.log('Node clicked:', node.data('label'));
});

// Add some basic interaction
cy.on('mouseover', 'node', function(evt) {
    const node = evt.target;
    node.style('background-color', '#4CAF50');
});

cy.on('mouseout', 'node', function(evt) {
    const node = evt.target;
    node.style('background-color', '#666');
}); 