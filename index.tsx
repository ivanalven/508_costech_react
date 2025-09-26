import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const navItems = [
    { name: 'Dashboard', icon: 'dashboard', href: '#' },
    { name: 'Calculadoras', icon: 'calculate', href: '#' },
    { name: 'Coste Laboral', icon: 'engineering', href: '#' },
    { name: 'Materiales', icon: 'schema', href: '#' },
    { name: 'Energía', icon: 'bolt', href: '#' },
    { name: 'Informes', icon: 'lab_profile', href: '#' },
];

const bottomNavItems = [
    { name: 'Ajustes', icon: 'settings', href: '#' },
    { name: 'Ayuda', icon: 'help_outline', href: '#' },
];

const dashboardKpis = [
  {
    groupTitle: 'Indicadores Globales',
    items: [
        { title: 'Cambio EUR/USD', value: '1.085', trend: 'down', trendValue: '-0.015', icon: 'currency_exchange', iconClass: 'exchange' },
        { title: 'Informes Disponibles', value: '5', trend: 'up', trendValue: '+1', icon: 'summarize', iconClass: 'reports' }
    ]
  },
  {
    groupTitle: 'Precios de Materiales (Mercado UE)',
    items: [
      { title: 'Acero AISI304', value: '€2250/t', trend: 'up', trendValue: '+1.5%', icon: 'inventory_2', iconClass: 'material' },
      { title: 'Mineral de Hierro', value: '€118/t', trend: 'down', trendValue: '-0.8%', icon: 'public', iconClass: 'material' },
      { title: 'Chatarra', value: '€420/t', trend: 'up', trendValue: '+2.1%', icon: 'recycling', iconClass: 'material' },
      { title: 'Manganeso', value: '€1500/t', trend: 'up', trendValue: '+0.5%', icon: 'lens_blur', iconClass: 'material' },
      { title: 'Electricidad', value: '€0.14/kWh', trend: 'down', trendValue: '-0.5%', icon: 'electric_bolt', iconClass: 'energy' },
      { title: 'Emisiones CO2', value: '€85/t', trend: 'up', trendValue: '+3.0%', icon: 'eco', iconClass: 'energy' },
    ]
  }
];

const materialsData = {
    id: 'materiales',
    name: 'Materiales',
    children: [
        {
            id: 'aceros',
            name: 'Aceros',
            children: [
                { id: 'aceros-carbono', name: 'Aceros al Carbono', children: [] },
                {
                    id: 'aceros-inoxidables',
                    name: 'Aceros Inoxidables',
                    children: [
                        {
                            id: 'austeniticos',
                            name: 'Austeníticos (Serie 200 y 300)',
                            children: [
                                { id: 'serie-200', name: 'Serie 200', children: [] },
                                {
                                    id: 'serie-300',
                                    name: 'Serie 300',
                                    children: [
                                        { id: 'aisi-301', name: 'AISI 301', children: [] },
                                        { id: 'aisi-302', name: 'AISI 302', children: [] },
                                        { id: 'aisi-303', name: 'AISI 303', children: [] },
                                        {
                                            id: 'aisi-304',
                                            name: 'AISI 304',
                                            composition: [
                                                { element: 'C', value: '≤ 0.08%' },
                                                { element: 'Mn', value: '≤ 2.00%' },
                                                { element: 'Si', value: '≤ 1.00%' },
                                                { element: 'Cr', value: '18.0–20.0%' },
                                                { element: 'Ni', value: '8.0–10.5%' },
                                                { element: 'P', value: '≤ 0.045%' },
                                                { element: 'S', value: '≤ 0.030%' },
                                                { element: 'Fe', value: 'Balance' },
                                            ],
                                            children: []
                                        },
                                        { id: 'aisi-304l', name: 'AISI 304L', children: [] },
                                        { id: 'aisi-316', name: 'AISI 316', children: [] },
                                        { id: 'aisi-316l', name: 'AISI 316L', children: [] },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

const spainLaborData = [
    { region: 'Galicia', engineerSale: 38.50, operatorSale: 28.00, engineerCost: 32.08, operatorCost: 23.33 },
    { region: 'Asturias', engineerSale: 39.00, operatorSale: 28.50, engineerCost: 32.50, operatorCost: 23.75 },
    { region: 'País Vasco', engineerSale: 42.00, operatorSale: 30.50, engineerCost: 35.00, operatorCost: 25.42 },
    { region: 'Madrid', engineerSale: 45.00, operatorSale: 32.00, engineerCost: 37.50, operatorCost: 26.67 },
    { region: 'Valencia', engineerSale: 37.80, operatorSale: 27.50, engineerCost: 31.50, operatorCost: 22.92 },
    { region: 'Sevilla', engineerSale: 36.60, operatorSale: 26.80, engineerCost: 30.50, operatorCost: 22.33 },
    { region: 'España (Promedio)', engineerSale: 39.80, operatorSale: 28.80, engineerCost: 33.17, operatorCost: 24.00, isAverage: true },
];

const priceCalculationData = [
    { category: 'Ingeniero', agreement: 'Convenio Metal (Pontevedra)', directCost: 23.76, structuralCost: 9.41, totalCost: 33.17, salePrice: 39.80 },
    { category: 'Operario', agreement: 'Convenio Metal (Pontevedra)', directCost: 17.78, structuralCost: 6.22, totalCost: 24.00, salePrice: 28.80 },
];

const internationalLaborData = [
    { country: 'España', engineerCost: '€33.17', operatorCost: '€24.00', source: 'Convenio Metal (Promedio)' },
    { country: 'Francia', engineerCost: '€45.50', operatorCost: '€32.80', source: 'Syntec' },
    { country: 'Italia', engineerCost: '€38.20', operatorCost: '€28.10', source: 'Contratto Metalmeccanici' },
    { country: 'Alemania', engineerCost: '€55.00', operatorCost: '€38.50', source: 'IG Metall' },
    { country: 'Turquía', engineerCost: '€15.80', operatorCost: '€9.50', source: 'Estimaciones sectoriales' },
    { country: 'EE.UU.', engineerCost: '$65.00', operatorCost: '$45.00', source: 'BLS Data (promedio)' },
    { country: 'México', engineerCost: '$18.00', operatorCost: '$10.00', source: 'Estimaciones industriales' },
    { country: 'India', engineerCost: '$12.50', operatorCost: '$7.00', source: 'Estimaciones sectoriales' },
    { country: 'China', engineerCost: '$22.00', operatorCost: '$15.00', source: 'Estimaciones regionales' },
];

const spainProjectionData = [
    { year: 2021, cost: 31.50 },
    { year: 2022, cost: 32.10 },
    { year: 2023, cost: 33.17 },
    { year: 2024, cost: 34.20, projected: true },
    { year: 2025, cost: 35.15, projected: true },
];

const findMaterialPath = (node, id, path = []) => {
    if (node.id === id) {
        return [...path, node];
    }
    if (node.children) {
        for (const child of node.children) {
            const foundPath = findMaterialPath(child, id, [...path, node]);
            if (foundPath) {
                return foundPath;
            }
        }
    }
    return null;
};

const generateMockMarketPriceData = () => {
    const markets = {
        eu: { base: 2200, volatility: 150 },
        usa: { base: 2400, volatility: 180 },
        china: { base: 2000, volatility: 200 },
        russia: { base: 1900, volatility: 250 },
    };
    const marketData = {};

    Object.keys(markets).forEach(marketKey => {
        const marketConfig = markets[marketKey];
        const data = [];
        const now = new Date();
        let price = marketConfig.base;
        // 24 months of historical data
        for (let i = 24; i > 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            price += (Math.random() - 0.45) * marketConfig.volatility;
            price = Math.max(marketConfig.base * 0.7, price);
            data.push({ date, price: parseFloat(price.toFixed(2)) });
        }
        // Current month
        const currentDate = new Date(now.getFullYear(), now.getMonth(), 1);
        price += (Math.random() - 0.45) * marketConfig.volatility;
        data.push({ date: currentDate, price: parseFloat(price.toFixed(2)) });
        // 4 months of projected data
        let lastPrice = price;
        for (let i = 1; i <= 4; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
            lastPrice += (Math.random() - 0.4) * (marketConfig.volatility * 0.8);
            data.push({ date, price: parseFloat(lastPrice.toFixed(2)), projected: true });
        }
        marketData[marketKey] = data;
    });
    return marketData;
};

const Sidebar = ({ activePage, setActivePage }) => (
    <aside className="sidebar">
        <div className="sidebar-header">
            <div className="sidebar-logo-text">COSTECH</div>
        </div>
        <nav className="sidebar-nav">
            <ul>
                {navItems.map(item => (
                    <li key={item.name}>
                        <a
                            href={item.href}
                            className={activePage === item.name ? 'active' : ''}
                            onClick={(e) => {
                                e.preventDefault();
                                setActivePage(item.name);
                            }}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="nav-item-text">{item.name}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
        <nav className="sidebar-nav nav-section-bottom">
            <ul>
                {bottomNavItems.map(item => (
                    <li key={item.name}>
                        <a href={item.href}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="nav-item-text">{item.name}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    </aside>
);

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="user-profile" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
                <div className="user-avatar">
                    <span className="material-symbols-outlined">person</span>
                </div>
                <div className={`user-menu ${menuOpen ? 'open' : ''}`}>
                    <ul>
                        <li>
                            <a href="#">
                                <span className="material-symbols-outlined">account_circle</span>
                                Editar Perfil
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="material-symbols-outlined">logout</span>
                                Cerrar Sesión
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

const KpiCard = ({ title, value, trend, trendValue, icon, iconClass }) => (
    <div className="kpi-card">
        <div className="kpi-header">
            <span className="kpi-title">{title}</span>
            <div className={`kpi-icon ${iconClass}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
        </div>
        <div className="kpi-body">
            <div className="kpi-value">{value}</div>
            <div className={`kpi-trend ${trend}`}>
                <span className="material-symbols-outlined">
                    {trend === 'up' ? 'trending_up' : 'trending_down'}
                </span>
                <span>{trendValue}</span>
            </div>
        </div>
    </div>
);

const DashboardContent = () => (
    <>
        <h1 className="page-title">Dashboard</h1>
        {dashboardKpis.map((group, index) => (
            <div key={index}>
                <h2 className="kpi-group-title">{group.groupTitle}</h2>
                <div className="kpi-grid">
                    {group.items.map(kpi => (
                        <KpiCard
                            key={kpi.title}
                            {...kpi}
                        />
                    ))}
                </div>
            </div>
        ))}
    </>
);

const TreeNode = ({ node, level = 0, defaultOpenLevels = 4, onNodeClick }) => {
    const hasChildren = node.children && node.children.length > 0;
    const [isOpen, setIsOpen] = useState(level < defaultOpenLevels);
    const isTerminal = !hasChildren && node.id !== 'materiales';

    const handleToggle = (e) => {
        e.stopPropagation();
        if (hasChildren) {
            setIsOpen(!isOpen);
        } else if (isTerminal) {
            onNodeClick(node.id);
        }
    };
    
    return (
        <li className="tree-node">
            <div
                className={`tree-node-content ${hasChildren ? 'expandable' : ''} ${isTerminal ? 'clickable' : ''}`}
                onClick={handleToggle}
            >
                {hasChildren ? (
                    <span className="material-symbols-outlined toggle-icon">
                        {isOpen ? 'arrow_drop_down' : 'arrow_right'}
                    </span>
                ) : (
                    <span className="toggle-icon-placeholder"></span>
                )}
                <span className="tree-node-name">{node.name}</span>
            </div>

            {isOpen && hasChildren && (
                <ul className="tree-node-children">
                    {node.children.map(child => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            defaultOpenLevels={defaultOpenLevels}
                            onNodeClick={onNodeClick}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

const MaterialsContent = ({ onMaterialSelect }) => (
    <div className="materials-content-container">
        <h1 className="page-title">Materiales</h1>
        <div className="materials-tree-card">
            <ul className="materials-tree">
                <TreeNode node={materialsData} defaultOpenLevels={4} onNodeClick={onMaterialSelect} />
            </ul>
        </div>
    </div>
);

const Breadcrumbs = ({ path, onNavigate }) => (
    <nav className="breadcrumbs">
        {path.map((node, index) => (
            <span key={node.id} className="breadcrumb-item">
                {index > 0 && <span className="material-symbols-outlined">chevron_right</span>}
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(node.id === path[path.length -1].id ? null : node.id)}}>
                    {node.name === 'Materiales' ? 'Volver al listado' : node.name}
                </a>
            </span>
        ))}
    </nav>
);

const PriceChart = ({ data, selectedMarket, onMarketChange }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [dateRange, setDateRange] = useState('1Y');

    const markets = [
        { key: 'eu', name: 'UE' },
        { key: 'usa', name: 'EEUU' },
        { key: 'china', name: 'China' },
        { key: 'russia', name: 'Rusia' },
    ];

    const dateRanges = [
        { key: '6M', name: '6M' },
        { key: '1Y', name: '1A' },
        { key: 'ALL', name: 'Todo' },
    ];


    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const getFilteredData = () => {
                const historicalPoints = data.filter(d => !d.projected);
                const projectedPoints = data.filter(d => d.projected);

                if (dateRange === 'ALL' || !data || data.length === 0) {
                    return data || [];
                }

                let monthsToShow;
                switch (dateRange) {
                    case '6M': monthsToShow = 6; break;
                    case '1Y': monthsToShow = 12; break;
                    default: monthsToShow = historicalPoints.length;
                }
                
                const relevantHistorical = historicalPoints.slice(-monthsToShow);
                return [...relevantHistorical, ...projectedPoints];
            };

            const chartData = getFilteredData();
            if (chartData.length === 0) return;

            const ctx = chartRef.current.getContext('2d');
            const labels = chartData.map(d => d.date.toLocaleString('es-ES', { month: 'short', year: '2-digit' }));
            const historicalData = chartData.filter(d => !d.projected).map(d => d.price);
            const projectedData = chartData.map(d => d.projected ? d.price : null);

            // To connect the last historical point with the first projected point
            const lastHistoricalIndex = historicalData.length - 1;
            const lastHistoricalPoint = chartData[lastHistoricalIndex];

            if (lastHistoricalPoint) {
                 projectedData[lastHistoricalIndex] = lastHistoricalPoint.price;
            }


            chartInstance.current = new (window as any).Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Precio Histórico (€/ton)',
                            data: historicalData,
                            borderColor: '#0D47A1',
                            backgroundColor: 'rgba(13, 71, 161, 0.1)',
                            fill: false,
                            tension: 0.3,
                        },
                        {
                            label: 'Proyección (€/ton)',
                            data: projectedData,
                            borderColor: '#FFC107',
                            backgroundColor: 'rgba(255, 193, 7, 0.1)',
                            borderDash: [5, 5],
                            fill: false,
                            tension: 0.3,
                        },
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: value => `€${value}`
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    }
                }
            });
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, dateRange]);

    return (
        <div className="price-chart-container card">
            <div className="card-header">
                <h3>Evolución de Precio</h3>
                <div className="chart-filters">
                    <div className="date-range-selector">
                        {dateRanges.map(range => (
                            <button
                                key={range.key}
                                className={dateRange === range.key ? 'active' : ''}
                                onClick={() => setDateRange(range.key)}
                            >
                                {range.name}
                            </button>
                        ))}
                    </div>
                    <div className="market-selector">
                         {markets.map(market => (
                            <button
                                key={market.key}
                                className={selectedMarket === market.key ? 'active' : ''}
                                onClick={() => onMarketChange(market.key)}
                            >
                                {market.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="chart-wrapper">
                <canvas ref={chartRef}></canvas>
            </div>
            <div className="chart-footer">
                <div className="analyst-note">
                    <span className="material-symbols-outlined">campaign</span>
                    <div>
                        <p><strong>Comentario del analista:</strong> Se espera una ligera tendencia alcista en los próximos meses debido a la creciente demanda en el sector automotriz y la recuperación económica post-pandemia.</p>
                    </div>
                </div>
                <div className="chart-disclaimers">
                    <p><strong>Fuente de la proyección:</strong> Metalytics AI Forecast. </p>
                    <p><strong>Rango de incertidumbre:</strong> Las proyecciones son estimaciones y no garantías de precios futuros. El mercado puede variar por factores imprevistos.</p>
                    <p><strong>Eventos futuros relevantes:</strong> Posibles nuevas tarifas al comercio internacional podrían impactar los precios a partir del próximo trimestre.</p>
                </div>
            </div>
        </div>
    );
};


const CompositionTable = ({ composition }) => (
    <div className="composition-table-container card">
        <div className="card-header">
            <h3>Composición Química</h3>
        </div>
        <table className="info-table">
            <thead>
                <tr>
                    <th>Elemento</th>
                    <th>Porcentaje</th>
                </tr>
            </thead>
            <tbody>
                {composition.map(item => (
                    <tr key={item.element}>
                        <td>{item.element}</td>
                        <td>{item.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const MarketPriceComparisonTable = ({ data }) => {
    const markets = ['eu', 'usa', 'china', 'russia'];
    const marketNames = { eu: 'UE', usa: 'EEUU', china: 'China', russia: 'Rusia' };

    const allHistoricalData: Record<string, any[]> = {};
    markets.forEach(m => {
        if (data?.[m]) {
            allHistoricalData[m] = data[m].filter(d => !d.projected);
        }
    });

    const recentData = [];
    if (allHistoricalData.eu && allHistoricalData.eu.length > 0) {
        const numPoints = allHistoricalData.eu.length;
        for (let i = Math.max(0, numPoints - 12); i < numPoints; i++) {
            const row = {
                date: allHistoricalData.eu[i].date,
                prices: {} as Record<string, number | undefined>
            };
            markets.forEach(m => {
                row.prices[m] = allHistoricalData[m]?.[i]?.price;
            });
            recentData.push(row);
        }
        recentData.reverse();
    }

    return (
        <div className="price-table-container card">
            <div className="card-header">
                <h3>Comparativa de Precios por Mercado</h3>
            </div>
            <div className="price-table-wrapper">
                <table className="info-table wide-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            {markets.map(m => <th key={m}>Precio (€/t, {marketNames[m]})</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {recentData.map((item: any) => (
                            <tr key={item.date.toISOString()}>
                                <td>{item.date.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</td>
                                {markets.map(m => <td key={m}>{item.prices[m]?.toFixed(2) || '-'}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const MaterialDetail = ({ materialId, onBack }) => {
    const materialPath = findMaterialPath(materialsData, materialId);
    const [marketPriceData] = useState(() => generateMockMarketPriceData());
    const [selectedMarket, setSelectedMarket] = useState('eu');

    if (!materialPath) return <div>Material no encontrado</div>;
    const material = materialPath[materialPath.length - 1];
    
    return(
        <div className="material-detail-page">
            <Breadcrumbs path={materialPath} onNavigate={onBack} />
            <h1 className="page-title">{material.name}</h1>
            <div className="material-detail-layout">
                <div className="main-panel">
                    <PriceChart 
                        data={marketPriceData[selectedMarket]}
                        selectedMarket={selectedMarket}
                        onMarketChange={setSelectedMarket}
                    />
                    <MarketPriceComparisonTable data={marketPriceData} />
                </div>
                <div className="side-panel">
                    <CompositionTable composition={material.composition || []} />
                </div>
            </div>
        </div>
    );
};

const RegionalCostTable = () => (
    <div className="card">
        <div className="card-header">
            <h3>Coste Laboral por Región</h3>
        </div>
        <table className="info-table">
            <thead>
                <tr>
                    <th>Región</th>
                    <th>Ingeniero (€/h)</th>
                    <th>Operario (€/h)</th>
                    <th>Coste Empresa Ing. (€/h)</th>
                    <th>Coste Empresa Op. (€/h)</th>
                </tr>
            </thead>
            <tbody>
                {spainLaborData.map(item => (
                    <tr key={item.region} className={item.isAverage ? 'average-row' : ''}>
                        <td>{item.region}</td>
                        <td>{item.engineerSale.toFixed(2)}</td>
                        <td>{item.operatorSale.toFixed(2)}</td>
                        <td>{item.engineerCost.toFixed(2)}</td>
                        <td>{item.operatorCost.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const CompanyCostChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new (window as any).Chart(ctx, {
                type: 'bar',
                data: {
                    labels: spainLaborData.filter(d => !d.isAverage).map(d => d.region),
                    datasets: [
                        {
                            label: 'Coste Empresa Ingeniero (€/h)',
                            data: spainLaborData.filter(d => !d.isAverage).map(d => d.engineerCost),
                            backgroundColor: 'rgba(13, 71, 161, 0.8)',
                            borderColor: '#0D47A1',
                            borderWidth: 1
                        },
                        {
                            label: 'Coste Empresa Operario (€/h)',
                            data: spainLaborData.filter(d => !d.isAverage).map(d => d.operatorCost),
                            backgroundColor: 'rgba(25, 118, 210, 0.7)',
                            borderColor: '#1976D2',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, ticks: { callback: value => `€${value}` } }
                    },
                    plugins: { legend: { position: 'top' } }
                }
            });
        }
        return () => { chartInstance.current?.destroy(); };
    }, []);

    return <canvas ref={chartRef}></canvas>;
};

const ProjectionChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) chartInstance.current.destroy();

            const ctx = chartRef.current.getContext('2d');
            const labels = spainProjectionData.map(d => d.year);
            const historicalData = spainProjectionData.filter(d => !d.projected).map(d => d.cost);
            const projectedData = spainProjectionData.map(d => d.projected ? d.cost : null);
            const lastHistorical = spainProjectionData[historicalData.length - 1];
            if(lastHistorical) projectedData[historicalData.length - 1] = lastHistorical.cost;

            chartInstance.current = new (window as any).Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        { label: 'Coste Histórico (€/h)', data: historicalData, borderColor: '#0D47A1', tension: 0.1 },
                        { label: 'Proyección Coste (€/h)', data: projectedData, borderColor: '#FFC107', borderDash: [5, 5], tension: 0.1 }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: { y: { beginAtZero: false, ticks: { callback: value => `€${value}` } } },
                    plugins: { legend: { position: 'top' } }
                }
            });
        }
        return () => { chartInstance.current?.destroy(); };
    }, []);

    return <canvas ref={chartRef}></canvas>;
};


const SalePriceCalculationTable = () => (
    <div className="card">
        <div className="card-header">
            <h3>Cálculo del Precio de Venta por Hora (España Promedio)</h3>
        </div>
        <table className="info-table">
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Convenio Base</th>
                    <th>Coste Directo (€/h, 1.35x)</th>
                    <th>Coste Estructural (€/h)</th>
                    <th>Coste Total Empresa (€/h)</th>
                    <th>Precio Venta (€/h, +20%)</th>
                </tr>
            </thead>
            <tbody>
                {priceCalculationData.map(item => (
                    <tr key={item.category}>
                        <td>{item.category}</td>
                        <td>{item.agreement}</td>
                        <td>{item.directCost.toFixed(2)}</td>
                        <td>{item.structuralCost.toFixed(2)}</td>
                        <td><strong>{item.totalCost.toFixed(2)}</strong></td>
                        <td><strong>{item.salePrice.toFixed(2)}</strong></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const InternationalCostTable = () => (
     <div className="card">
        <div className="card-header">
            <h3>Comparativa de Coste Laboral Internacional</h3>
        </div>
        <div className="price-table-wrapper">
            <table className="info-table wide-table">
                <thead>
                    <tr>
                        <th>País</th>
                        <th>Coste Ingeniero (Moneda Local/h)</th>
                        <th>Coste Operario (Moneda Local/h)</th>
                        <th>Fuente / Comentario</th>
                    </tr>
                </thead>
                <tbody>
                    {internationalLaborData.map(item => (
                        <tr key={item.country}>
                            <td>{item.country}</td>
                            <td>{item.engineerCost}</td>
                            <td>{item.operatorCost}</td>
                            <td>{item.source}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


const SpainLaborCostView = () => (
    <div className="labor-cost-view">
        <RegionalCostTable />
        <div className="charts-grid">
            <div className="card">
                <div className="card-header"><h3>Coste Empresa por Región</h3></div>
                <div className="chart-wrapper"><CompanyCostChart /></div>
            </div>
             <div className="card">
                <div className="card-header"><h3>Proyección Coste Empresa (España)</h3></div>
                <div className="chart-wrapper"><ProjectionChart /></div>
            </div>
        </div>
        <SalePriceCalculationTable />
    </div>
);

const InternationalLaborCostView = () => (
    <div className="labor-cost-view">
        <InternationalCostTable />
    </div>
);

const LaborCostContent = () => {
    const [activeTab, setActiveTab] = useState('spain');

    return (
        <div className="labor-cost-content">
            <h1 className="page-title">Coste Laboral</h1>
            <div className="tab-switcher">
                <button 
                    onClick={() => setActiveTab('spain')} 
                    className={activeTab === 'spain' ? 'active' : ''}
                >
                    Costes Laborales España
                </button>
                <button 
                    onClick={() => setActiveTab('international')} 
                    className={activeTab === 'international' ? 'active' : ''}
                >
                    Costes Laborales Internacionales
                </button>
            </div>
            {activeTab === 'spain' ? <SpainLaborCostView /> : <InternationalLaborCostView />}
        </div>
    );
};

const PlaceholderContent = ({ pageTitle }) => (
    <div className="placeholder-container">
        <h1 className="page-title">{pageTitle}</h1>
        <p>El contenido para esta sección estará disponible próximamente.</p>
    </div>
);

const MainContent = ({ activePage, setActivePage }) => {
    const [selectedMaterialId, setSelectedMaterialId] = useState('aisi-304');

    const handleMaterialSelect = (materialId) => {
        setSelectedMaterialId(materialId);
    };

    const handleBreadcrumbNav = () => {
        setSelectedMaterialId(null);
    }
    
    useEffect(() => {
        if (activePage === 'Materiales') {
             setSelectedMaterialId(selectedMaterialId || 'aisi-304');
        } else {
             setSelectedMaterialId(null);
        }
    }, [activePage]);


    const renderContent = () => {
        if (activePage === 'Dashboard') {
            return <DashboardContent />;
        }
        if (activePage === 'Coste Laboral') {
            return <LaborCostContent />;
        }
        if (activePage === 'Materiales') {
            if (selectedMaterialId) {
                return <MaterialDetail materialId={selectedMaterialId} onBack={handleBreadcrumbNav} />;
            } else {
                return <MaterialsContent onMaterialSelect={handleMaterialSelect} />;
            }
        }
        return <PlaceholderContent pageTitle={activePage} />;
    };

    return (
        <main className="main-content">
            {renderContent()}
        </main>
    );
};

const App = () => {
    const [activePage, setActivePage] = useState('Coste Laboral');

    return (
        <>
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="app-container">
                <Header />
                <MainContent activePage={activePage} setActivePage={setActivePage} />
            </div>
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);