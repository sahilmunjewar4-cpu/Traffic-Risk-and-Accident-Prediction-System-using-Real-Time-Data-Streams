# 🚦 TRAAP Nagpur – Traffic Risk Analysis & Accident Prediction

**TRAAP (Traffic Risk Analysis and Accident Prevention)** is a Nagpur-focused web-based traffic intelligence and decision-support dashboard designed to monitor road conditions, analyze traffic risk, simulate accident-risk prediction, visualize weather impacts, and support emergency vehicle routing.

The application combines an interactive map, traffic analytics, risk prediction, emergency corridor simulation, weather-impact analysis, alerts, and reporting features into a centralized dashboard.

> **Project Type:** Web Application / Traffic Analytics / Risk Prediction
> **Location Focus:** Nagpur, Maharashtra, India
> **Frontend:** React + TypeScript + Vite
> **Status:** Academic / Demonstration Project

---

## ✨ Key Features

### 🚦 1. Live Traffic Monitoring

* Monitor major Nagpur road corridors.
* Display current traffic speed and density.
* Categorize roads as:

  * 🟢 Light
  * 🟡 Moderate
  * 🔴 Heavy
* Search roads and areas.
* View congestion index and traffic-risk information.
* Track active incidents and road conditions.

### 🧠 2. Accident Risk Prediction

TRAAP includes a simulation-based accident-risk prediction engine that evaluates multiple traffic and environmental factors.

**Input parameters include:**

* Vehicle speed
* Traffic density
* Weather condition
* Time of day
* Road damage / potholes
* Area and road

The system generates:

* Risk score
* Risk level
* Confidence value
* Primary risk factor
* Preventive action
* Individual risk-factor analysis

Risk categories:

```text
LOW
MEDIUM
HIGH
```

The project contains an **XGBoost-inspired/surrogate decision model implemented in TypeScript** for demonstration and simulation purposes.

---

## 🚑 3. Emergency Green-Wave System

The emergency module simulates traffic-signal priority for emergency vehicles.

Supported emergency vehicles:

* 🚑 Ambulance
* 🚒 Fire Brigade
* 🚓 Police
* ❤️ Organ Transport

Features include:

* Emergency route selection
* Green-wave activation
* Traffic signal priority simulation
* Estimated time savings
* Congestion-point identification
* Emergency corridor visualization
* Emergency siren simulation using the Web Audio API

---

## 🗺️ 4. Interactive Nagpur Map

The project provides an interactive map-based visualization of Nagpur's transportation network.

The map can represent:

* Roads
* Traffic conditions
* Risk zones
* Incidents
* Emergency routes
* Signals
* Important areas
* Hospitals
* Nagpur landmarks

Map functionality is implemented using **Leaflet / React Leaflet**.

---

## 🌧️ 5. Weather & Traffic Impact Analysis

The weather module analyzes how environmental conditions can affect road traffic and safety.

Supported conditions include:

* Sunny
* Cloudy
* Rainy
* Stormy
* Heavy Rain
* Fog

Displayed parameters include:

* Temperature
* Feels-like temperature
* Humidity
* Wind speed
* Visibility
* Rainfall
* UV index
* Air Quality Index
* Traffic impact
* Traction reduction

The system also provides zone-level weather impact information across Nagpur.

---

## 🚨 6. Traffic Alerts

TRAAP provides an alert interface for different traffic-related events.

Alert categories include:

* Accident
* Traffic Risk
* Weather
* Emergency
* Congestion

Alerts can contain:

* Location
* Road
* Severity
* Risk score
* Weather condition
* Traffic density
* Timestamp
* Status

---

## 📊 7. Dashboard & Reports

The centralized dashboard provides an overview of the Nagpur traffic network.

It includes:

* Traffic statistics
* Risk indicators
* Active incidents
* Road conditions
* Emergency status
* Prediction information
* Traffic trends
* Reports

Prediction records can also be exported as **CSV** for further analysis.

---

## 🏙️ 8. Nagpur-Specific Configuration

The application contains dedicated configuration and mock data for Nagpur.

It includes information structures for:

* Major roads
* Traffic corridors
* Nagpur areas
* Hospitals
* Landmarks
* Traffic signals
* Incidents
* Emergency routes
* Weather reports

Example road corridors include:

* Wardha Road
* Inner Ring Road
* Amravati Road
* Central Avenue
* Kamptee Road
* Hingna Road
* Koradi Road
* Bhandara Road
* Manewada Road
* Umred Road
* Katol Road

---

# 🛠️ Technology Stack

## Frontend

* **React.js**
* **TypeScript**
* **Vite**
* **HTML5**
* **CSS**
* **Tailwind CSS**

## Data Visualization

* **Recharts**
* **Leaflet**
* **React Leaflet**

## UI & Icons

* **Lucide React**
* Responsive dashboard components
* Interactive cards, tables and charts

## Application Logic

* TypeScript
* Rule-based risk calculation
* XGBoost-inspired surrogate prediction logic
* Local Storage
* CSV export
* Web Audio API

## Development Tools

* Node.js
* npm
* Vite
* Git
* GitHub
* VS Code

---

# 🏗️ Project Architecture

```text
TRAAP Nagpur
│
├── public/
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── AccidentPredictionView.tsx
│   │   ├── AlertsView.tsx
│   │   ├── DashboardView.tsx
│   │   ├── EmergencyPriorityView.tsx
│   │   ├── Header.tsx
│   │   ├── KnowledgeBaseView.tsx
│   │   ├── LiveTrafficView.tsx
│   │   ├── NagpurAreasView.tsx
│   │   ├── NagpurMap.tsx
│   │   ├── ReportsView.tsx
│   │   ├── SettingsView.tsx
│   │   └── WeatherImpactView.tsx
│   │
│   ├── config/
│   │   └── nagpur.ts
│   │
│   ├── data/
│   │   └── nagpurMockData.ts
│   │
│   ├── services/
│   │   ├── emergencyRouting.ts
│   │   └── trafficEngine.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 🔄 Application Workflow

```text
User
  │
  ▼
TRAAP Dashboard
  │
  ├── Live Traffic Monitoring
  │       │
  │       ├── Road Speed
  │       ├── Traffic Density
  │       └── Congestion
  │
  ├── Accident Risk Prediction
  │       │
  │       ├── Speed
  │       ├── Density
  │       ├── Weather
  │       ├── Time
  │       └── Road Condition
  │              │
  │              ▼
  │       Risk Calculation Engine
  │              │
  │              ▼
  │       Risk Score + Risk Level
  │
  ├── Weather Impact
  │
  ├── Emergency Routing
  │       │
  │       ▼
  │   Green Wave Simulation
  │
  ├── Alerts
  │
  └── Reports
```

---

# 🧠 Risk Prediction Methodology

The accident-risk engine combines several factors to calculate a normalized risk score.

### Main factors

| Factor          | Description                               |
| --------------- | ----------------------------------------- |
| Traffic Density | Vehicle/lane occupancy level              |
| Speed           | Current road speed and speed variation    |
| Weather         | Rain, fog, storm and other conditions     |
| Time            | Peak-hour and late-night traffic patterns |
| Road Condition  | Potholes or road damage                   |

The resulting score is converted into a risk category:

```text
Risk Score < 40      → LOW
Risk Score 40–69     → MEDIUM
Risk Score ≥ 70      → HIGH
```

The application also identifies a primary risk factor and provides a suggested preventive intervention.

> **Note:** The current repository implements a simulation/surrogate prediction engine rather than a production-trained accident-prediction model connected to a live traffic database.

---

# 💾 Data Storage

Prediction history is temporarily stored using the browser's:

**LocalStorage**

The application also supports exporting prediction history as a CSV file.

Example:

```text
TRAAP_Nagpur_Accident_Predictions.csv
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/traap-nagpur-traffic-risk-analysis.git
```

```bash
cd traap-nagpur-traffic-risk-analysis
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## 4. Build for Production

```bash
npm run build
```

## 5. Preview Production Build

```bash
npm run preview
```

---

# ⚙️ Environment Configuration

If environment variables are required, create a `.env` file based on:

```text
.env.example
```

Do not commit private API keys, credentials, or secrets to GitHub.

---

# 📌 Current Project Scope

TRAAP is currently designed as an **academic/prototype traffic intelligence platform**.

The repository uses structured Nagpur datasets and simulated traffic, weather, incident, signal, and emergency-routing information.

For a production deployment, the system could be connected to:

* Real-time traffic APIs
* Government traffic feeds
* Weather APIs
* GPS/vehicle data
* CCTV/computer-vision systems
* IoT traffic sensors
* Real accident datasets
* Cloud databases
* Production ML models

---

# 🔮 Future Enhancements

* Real-time traffic API integration
* Real accident dataset integration
* Production machine-learning model
* Computer vision for accident detection
* CCTV-based traffic-density estimation
* IoT sensor integration
* GPS-based emergency vehicle tracking
* Real-time traffic signal controller integration
* Mobile application
* Cloud deployment
* PostgreSQL/MySQL database
* User authentication and role-based access
* Historical traffic analytics
* Advanced predictive analytics
* Automated incident detection

---

# 🎯 Project Objectives

The major objectives of TRAAP are:

1. Monitor traffic conditions across major Nagpur roads.
2. Analyze traffic congestion and road-risk factors.
3. Simulate accident-risk prediction using traffic and environmental parameters.
4. Visualize traffic information on an interactive map.
5. Analyze the effect of weather on traffic conditions.
6. Simulate emergency vehicle green-wave routing.
7. Provide traffic alerts and risk information.
8. Generate useful reports and export prediction data.

---

# 👨‍💻 Developer

**Sahil Munjewar**

B.Tech – Computer Science and Medical Engineering

Interested in:

* Data Analytics
* Python Development
* Data Science
* Machine Learning
* SQL
* Web Development

---

# 📄 License

This project is developed for academic, learning, research, and demonstration purposes.

If you reuse or modify this project, please provide appropriate attribution to the original author.

---

## ⭐ If You Find This Project Useful

Consider giving the repository a ⭐ on GitHub and following the project for future updates.

