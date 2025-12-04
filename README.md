# Warwick CS Paper Visualization - Frontend

React + D3.js frontend for visualizing Warwick University Computer Science papers.

## 🎯 Features

### Task 1 (T1): Two Interactive Network Graphs
- ✅ **Citation Network**: Force-directed layout showing paper citation relationships
- ✅ **Collaboration Network**: Force-directed layout showing author collaborations
- ✅ Drag nodes, zoom/pan, hover tooltips
- ✅ Interactive filters and controls

### Task 2 (T2): Coordinated Dashboard
- ✅ **Timeline**: Bar chart of publications by year
- ✅ **Statistics Panel**: Overall metrics and top papers
- ✅ **Year Filtering**: Click timeline to filter statistics

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CitationNetwork.jsx      # T1: Citation network
│   │   ├── CollaborationNetwork.jsx # T1: Collaboration network
│   │   ├── Timeline.jsx             # T2: Timeline chart
│   │   ├── Dashboard.jsx            # T2: Statistics dashboard
│   │   └── NetworkGraph.jsx         # Reusable D3 component
│   ├── services/
│   │   └── api.js                   # Backend API calls
│   ├── App.jsx                      # Main app
│   ├── App.css                      # Styles
│   ├── index.js                     # Entry point
│   └── index.css                    # Global styles
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Backend API running at http://localhost:5000

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm start
```

The app will open at: http://localhost:3000

### Build for Production

```bash
# Create optimized production build
npm run build
```

## 🔌 Backend Connection

The frontend connects to the backend API at `http://localhost:5000` by default.

To use a different backend URL, create a `.env` file:

```bash
REACT_APP_API_URL=http://your-backend-url:5000
```

## 📊 Components Overview

### NetworkGraph (Reusable)
Core D3.js force-directed graph component with:
- Force simulation (link, charge, center, collision)
- Drag behavior
- Zoom/pan
- Hover tooltips
- Click handlers
- Customizable node colors, sizes, labels

**Props:**
```javascript
<NetworkGraph
  nodes={[]}           // Array of node objects with 'id'
  links={[]}           // Array of {source, target, weight?}
  width={800}
  height={600}
  nodeRadius={5}
  linkDistance={50}
  chargeStrength={-300}
  getNodeColor={fn}    // Node => color
  getNodeSize={fn}     // Node => size
  getNodeLabel={fn}    // Node => label string
  onNodeClick={fn}     // Click handler
/>
```

### CitationNetwork
Wraps NetworkGraph for citation visualization:
- **Node color**: By publication year (2020-2024)
- **Node size**: By citation count (log scale)
- **Edges**: Citation relationships
- **Filters**: Limit papers, minimum citations
- **Click**: Opens DOI link

### CollaborationNetwork
Wraps NetworkGraph for collaboration visualization:
- **Node color**: By productivity (paper count)
- **Node size**: By paper count
- **Edges**: Co-authorship with weight (collaboration strength)
- **Filters**: Limit authors, minimum collaborations

### Timeline
D3.js bar chart:
- **X-axis**: Years
- **Y-axis**: Paper count
- **Interaction**: Click bar to select year
- **Styling**: Selected year highlighted

### Dashboard
Coordinated statistics panel:
- Embeds Timeline component
- Displays overall stats (papers, citations, team size)
- Network statistics
- Top 5 cited papers
- Year filter integration

## 🎨 Styling

The app uses a modern, clean design with:
- Gradient header (purple theme)
- Card-based layouts
- Responsive grid
- Hover effects
- Smooth transitions

Colors:
- Primary: `#667eea` (purple)
- Accent: `#764ba2` (dark purple)
- Success: `#2ecc71` (green)
- Warning: `#f39c12` (orange)
- Danger: `#e74c3c` (red)

## 📱 Responsive Design

The app is responsive and works on:
- Desktop (1400px+)
- Tablet (768px-1400px)
- Mobile (< 768px)

Mobile optimizations:
- Stacked layouts
- Smaller fonts
- Touch-friendly buttons
- Horizontal scrolling for nav

## 🧪 Testing

### Manual Testing Checklist

**Citation Network:**
- [ ] Loads without errors
- [ ] Nodes are draggable
- [ ] Zoom/pan works
- [ ] Hover shows tooltip
- [ ] Click opens DOI
- [ ] Filters work
- [ ] Legend displays correctly

**Collaboration Network:**
- [ ] Loads without errors
- [ ] Nodes are draggable
- [ ] Link thickness varies by weight
- [ ] Filters work
- [ ] Stats update correctly

**Dashboard:**
- [ ] Timeline renders
- [ ] Stats cards display
- [ ] Top papers list shows
- [ ] Click timeline bar filters stats
- [ ] Clear filter works

### Browser Testing
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅

## 🔧 Customization

### Change Network Layout

Edit force parameters in `NetworkGraph.jsx`:
```javascript
.force('link', d3.forceLink(links)
  .distance(50))          // Link distance
.force('charge', d3.forceManyBody()
  .strength(-300))        // Repulsion strength
.force('center', d3.forceCenter(width / 2, height / 2))
.force('collision', d3.forceCollide().radius(10))  // Collision radius
```

### Change Color Scheme

Edit color functions in components:
```javascript
const getNodeColor = (node) => {
  // Your color logic
  return '#yourcolor';
};
```

### Add New Visualizations

1. Create new component in `src/components/`
2. Import in `App.jsx`
3. Add navigation button
4. Add to conditional rendering

## 🐛 Troubleshooting

### "Failed to fetch"
**Problem**: Cannot connect to backend
**Solution**:
- Check backend is running at http://localhost:5000
- Check CORS is enabled in backend
- Verify API_BASE_URL in `api.js`

### Nodes flying off screen
**Problem**: Force simulation not stable
**Solution**:
- Increase `chargeStrength` (more negative)
- Adjust `linkDistance`
- Add stronger `collision` force

### Slow performance
**Problem**: Too many nodes
**Solution**:
- Reduce `limit` parameter
- Implement canvas rendering for large graphs
- Add virtualization
- Use node aggregation

### Timeline not showing
**Problem**: Data format mismatch
**Solution**:
- Check API response format
- Verify `year` and `count` fields exist
- Check browser console for errors

## 📚 Dependencies

- `react`: ^18.2.0 - UI library
- `react-dom`: ^18.2.0 - React DOM rendering
- `d3`: ^7.8.5 - Data visualization
- `axios`: ^1.6.2 - HTTP client
- `react-scripts`: 5.0.1 - Build tooling

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy build/ folder to Netlify
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json:
"homepage": "https://yourusername.github.io/repo-name",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

## 📝 Code Quality

### ESLint
The project uses Create React App's ESLint configuration.

### Code Style
- Use functional components
- Use hooks (useState, useEffect)
- PropTypes for type checking (optional)
- Meaningful variable names
- Comments for complex logic

## 🎯 Next Steps (Task 3 - Optional)

Potential optimizations:
- [ ] Hierarchical edge bundling
- [ ] Community detection
- [ ] Force parameter tuning
- [ ] Canvas rendering for 500+ nodes
- [ ] Node clustering
- [ ] WebGL for extreme scale
- [ ] Server-side rendering

## 📞 Support

- Check browser console for errors
- Verify backend is running and accessible
- Check network tab in dev tools
- Review API response format

## 📄 License

MIT License
